<?php

namespace App\Http\Controllers;

use App\Models\AiFeedback;
use App\Models\Roadmap;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AiFeedbackController extends Controller
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $roadmapId)
    {
        $roadmap = Roadmap::with(['skill', 'roadmapPhases.roadmapTopics'])->find($roadmapId);

        if (!$roadmap) {
            return response()->json([
                "success" => false,
                "message" => "Roadmap not found"
            ], 404);
        }

        if ($roadmap->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden Access',
            ], 403);
        }

        $totalTopics     = 0;
        $completedTopics = 0;
        $breakdownPerFase = [];

        foreach ($roadmap->roadmapPhases as $phase) {
            $total = $phase->roadmapTopics->count();
            $completed = $phase->roadmapTopics->where('is_completed', 1)->count();

            $totalTopics     += $total;
            $completedTopics += $completed;

            $breakdownPerFase[] = [
                "phase_title" => $phase->phase_title,
                "completed" => $completed,
                "total" => $total,
            ];
        }

        $data = [
            'skill_name'         => $roadmap->skill->name,
            'total_topics'       => $totalTopics,
            'completed_topics'   => $completedTopics,
            'progress_persen'    => $totalTopics > 0 ? round(($completedTopics / $totalTopics) * 100, 1) : 0,
            'sisa_hari'          => now()->diffInDays($roadmap->target_deadline, false),
            'jam_per_hari'       => $roadmap->hours_per_day,
            'breakdown_per_fase' => $breakdownPerFase,
        ];

        try {
            $aiResult = $this->gemini->generateFeedback($data);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => 'Gagal generate roadmap dari AI: ' . $e->getMessage(),
            ], 500);
        }

        try {
            $feedback = DB::transaction(function () use ($roadmap, $aiResult, $data) {
                return AiFeedback::create([
                    'user_id'                  => Auth::id(),
                    'roadmap_id'               => $roadmap->id,
                    'score_progress'           => $aiResult['skor_progress'],
                    'apresiasi'                => $aiResult['apresiasi'],
                    'analisis'                 => $aiResult['analisis'],
                    'saran_konkret'            => $aiResult['saran_konkret'],
                    'pesan_motivasi'           => $aiResult['pesan_motivasi'],
                    'perlu_penyesuaian_jadwal' => $aiResult['perlu_penyesuaian_jadwal'],
                    'progress_saat_request'    => $data['progress_persen'],
                ]);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan roadmap ke database: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "AI Feedback for roadmap {$roadmap->id} created succesfully",
            "data" => $feedback
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::guard("sanctum")->user();

        $roadmap = Roadmap::find($id);

        if (!$roadmap) {
            return response()->json([
                "success" => false,
                "message" => "Roadmap not found"
            ], 404);
        }

        $feedbacks = AiFeedback::with("user")->where("roadmap_id", $id)->get();

        if ($feedbacks->isEmpty()) {
            return response()->json([
                "success" => true,
                "data" => []
            ]);
        }

        if ($feedbacks[0]->user->id !== $user->id) {
            return response()->json([
                "message" => "Forbidden Access"
            ], 403);
        }

        return response()->json([
            "success" => true,
            "data" => $feedbacks
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
