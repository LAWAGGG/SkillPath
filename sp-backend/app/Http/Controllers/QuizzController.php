<?php

namespace App\Http\Controllers;

use App\Models\Quizz;
use App\Models\RoadmapPhase;
use App\Models\QuizzQuestion;
use App\Models\QuizzAnswer;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuizzController extends Controller
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    public function show($phaseId)
    {
        $phase = RoadmapPhase::with(['roadmapTopics', 'roadmap.skill'])->find($phaseId);

        if (!$phase) {
            return response()->json(['success' => false, 'message' => 'Phase Not Found'], 404);
        }

        // Check ownership
        if ($phase->roadmap->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        // Check all topics completed
        $allCompleted = $phase->roadmapTopics->every(fn($t) => $t->is_completed);
        if (!$allCompleted) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan semua topik dalam fase ini terlebih dahulu.'
            ], 422);
        }

        // Check existing quiz
        $existing = Quizz::where('user_id', Auth::id())
            ->where('roadmap_phase_id', $phaseId)
            ->first();

        if (!$existing) {
            return response()->json([
                "message" => "Quizz not found",
                "success" => false
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quiz untuk fase ini sudah pernah dibuat.',
            'data'    =>  [
                'quiz_id'   => $existing->id,
                'questions' => $existing->questions->map(fn($q) => [
                    'id'       => $q->id,
                    'order'    => $q->order,
                    'question' => $q->question,
                    'option_a' => $q->option_a,
                    'option_b' => $q->option_b,
                    'option_c' => $q->option_c,
                    'option_d' => $q->option_d,
                ])
            ]
        ], 200);
    }

    /**
     * Generate Quiz for a phase.
     */
    public function store(Request $request, $id)
    {
        $phase = RoadmapPhase::with(['roadmapTopics', 'roadmap.skill'])->findOrFail($id);

        // Check ownership
        if ($phase->roadmap->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        // Check all topics completed
        $allCompleted = $phase->roadmapTopics->every(fn($t) => $t->is_completed);
        if (!$allCompleted) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan semua topik dalam fase ini terlebih dahulu.'
            ], 422);
        }

        // Check existing quiz
        $existing = Quizz::where('user_id', Auth::id())
            ->where('roadmap_phase_id', $id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz untuk fase ini sudah pernah dibuat.',
                'data'    => $existing->load('questions')
            ], 422);
        }

        // 4. Generate & Simpan via Service
        try {
            $quiz = $this->gemini->handleQuizGeneration($phase);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'quiz_id'   => $quiz->id,
                'questions' => $quiz->questions->map(fn($q) => [
                    'id'       => $q->id,
                    'order'    => $q->order,
                    'question' => $q->question,
                    'option_a' => $q->option_a,
                    'option_b' => $q->option_b,
                    'option_c' => $q->option_c,
                    'option_d' => $q->option_d,
                ])
            ]
        ]);
    }

    /**
     * Submit Quiz answers.
     */
    public function submit(Request $request, $id)
    {
        $quiz = Quizz::with('questions')->find($id);

        if (!$quiz) {
            return response()->json([
                "success" => false,
                "message" => "Quizz not found"
            ], 404);
        }

        if ($quiz->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        if ($quiz->status === 'completed') {
            return response()->json(['success' => false, 'message' => 'Quiz sudah selesai.'], 422);
        }

        $request->validate([
            'answers'               => 'required|array',
            'answers.*.question_id' => 'required|exists:quizz_questions,id',
            'answers.*.answer'      => 'required|in:a,b,c,d',
        ]);

        // 3. Submit & Score via Service
        try {
            $submissionResult = $this->gemini->handleQuizSubmission($quiz, $request->answers);
            $results = $submissionResult['results'];
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'score'   => $quiz->score,
                'results' => $results
            ]
        ]);
    }

    /**
     * Show Quiz result.
     */
    public function showResult($id)
    {
        $phase = RoadmapPhase::with(['roadmapTopics', 'roadmap.skill'])->find($id);

        if (!$phase) {
            return response()->json(['success' => false, 'message' => 'Phase Not Found'], 404);
        }

        if ($phase->roadmap->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $quizz = Quizz::with("answers.question")->where("roadmap_phase_id", $phase->id)->first();

        if (!$quizz) {
            return response()->json(['success' => false, 'message' => 'Quiz Not Found'], 404);
        }

        if ($quizz->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        return response()->json([
            'success' => true,
            'score'    => $quizz->score  . "/" . 100,
            "result" => [
                'quiz_id'   => $quizz->id,
                'answers' => $quizz->answers->map(fn($q) => [
                    "answer" => [
                        "user_answer" => $q->user_answer,
                        "is_correct" => $q->is_correct,
                        "overview" => $q->question->overview,
                    ],
                    "question" => [
                        'id'       => $q->question->id,
                        'order'    => $q->question->order,
                        'question' => $q->question->question,
                        'option_a' => $q->question->option_a,
                        'option_b' => $q->question->option_b,
                        'option_c' => $q->question->option_c,
                        'option_d' => $q->question->option_d,
                        'true_answer' => $q->question->true_answer,
                    ]
                ]),
            ]
        ]);
    }
}
