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

        // 3. Generate & Simpan via Service
        try {
            $feedback = $this->gemini->handleFeedbackGeneration($roadmap);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => 'Gagal generate feedback: ' . $e->getMessage(),
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

        $feedbacks = AiFeedback::with("user")->where("roadmap_id", $id)->latest()->get();

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
