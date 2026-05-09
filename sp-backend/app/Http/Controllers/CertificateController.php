<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

use App\Services\GeminiService;
use App\Models\AiFeedback;

class CertificateController extends Controller
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    public function download($id)
    {
        $roadmap = Roadmap::with(['roadmapPhases.roadmapTopics', 'roadmapPhases.quizzes.answers', 'skill'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Check if all topics are completed
        $totalTopics = 0;
        $completedTopics = 0;
        $lastCompletedAt = null;

        foreach ($roadmap->roadmapPhases as $phase) {
            foreach ($phase->roadmapTopics as $topic) {
                $totalTopics++;
                if ($topic->is_completed) {
                    $completedTopics++;
                    if (!$lastCompletedAt || Carbon::parse($topic->completed_at)->gt($lastCompletedAt)) {
                        $lastCompletedAt = Carbon::parse($topic->completed_at);
                    }
                }
            }
        }

        if ($totalTopics === 0 || $completedTopics < $totalTopics) {
            return response()->json(['message' => 'Roadmap is not fully completed yet.'], 400);
        }

        // Get or Generate Feedback
        $feedback = AiFeedback::where('roadmap_id', $id)->latest()->first();
        if (!$feedback) {
            try {
                $feedback = $this->gemini->handleFeedbackGeneration($roadmap);
            } catch (\Exception $e) {
                // Fallback if AI fails, but ideally this shouldn't happen for certificate
            }
        }

        // Calculate Quiz Score
        $quizScores = [];
        foreach ($roadmap->roadmapPhases as $phase) {
            foreach ($phase->quizzes as $quiz) {
                $totalQuestions = $quiz->questions()->count();
                $correctAnswers = $quiz->answers()->where('is_correct', true)->count();
                
                if ($totalQuestions > 0) {
                    $quizScores[] = ($correctAnswers / $totalQuestions) * 100;
                }
            }
        }

        $avgQuizScore = count($quizScores) > 0 ? array_sum($quizScores) / count($quizScores) : 100;

        // Calculate Time Score
        $timeScore = 100;
        if ($roadmap->target_deadline && $lastCompletedAt) {
            $deadline = Carbon::parse($roadmap->target_deadline);
            if ($lastCompletedAt->gt($deadline)) {
                $daysLate = $lastCompletedAt->diffInDays($deadline);
                $timeScore = max(60, 100 - ($daysLate * 2));
            }
        }

        // Final Score: 70% Quiz, 30% Time
        $finalScore = round(($avgQuizScore * 0.7) + ($timeScore * 0.3));

        $data = [
            'user_name' => Auth::user()->name,
            'roadmap_title' => $roadmap->title,
            'score' => $finalScore,
            'completed_at' => $lastCompletedAt->format('d F Y'),
            'date' => Carbon::now()->format('d F Y'),
            'feedback' => $feedback
        ];

        $pdf = Pdf::loadView('certificate', $data)->setPaper('a4', 'landscape');
        
        return $pdf->download("Certificate-{$roadmap->title}.pdf");
    }
}
