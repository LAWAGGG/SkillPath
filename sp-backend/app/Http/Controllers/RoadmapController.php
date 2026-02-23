<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\RoadmapPhase;
use App\Models\RoadmapTopic;
use App\Models\Skill;
use App\Models\TopicResource;
use App\Models\User;
use App\Services\GeminiService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use function Symfony\Component\Clock\now;

class RoadmapController extends Controller
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
        $user = Auth::guard("sanctum")->user();
        $roadmaps = Roadmap::with("skill", "roadmapPhases.roadmapTopics")->where("user_id", $user->id)->latest()->get();

        return response()->json([
            "success" => true,
            "data" => $roadmaps->map(function ($roadmap) {
                return [
                    "id" => $roadmap->id,
                    "title" => $roadmap->title,
                    "hours_per_day" => $roadmap->hours_per_day,
                    "status" => $roadmap->status,
                    "skill" => $roadmap->skill->name,
                    "days_left" => round(Carbon::parse(now())->diffInDays($roadmap->target_deadline, false)) . " days left",
                    "completed_topics_count" => $roadmap->roadmapPhases->sum(function ($phase) {
                        return $phase->roadmapTopics->where("is_completed", 1)->count();
                    }),
                    "total_topics" => $roadmap->roadmapPhases->sum(function ($phase) {
                        return $phase->roadmapTopics->count();
                    }),
                ];
            })
        ]);
    }

    public function adminRoadmaps()
    {
        $roadmaps = Roadmap::with("user", "skill", "roadmapPhases.roadmapTopics")->latest()->get();

        return response()->json([
            "success" => true,
            "data" => $roadmaps->map(function ($roadmap) {
                return [
                    "id" => $roadmap->id,
                    "title" => $roadmap->title,
                    "hours_per_day" => $roadmap->hours_per_day,
                    "status" => $roadmap->status,
                    "skill" => $roadmap->skill->name,
                    "days_left" => round(Carbon::parse(now())->diffInDays($roadmap->target_deadline, false)) . " days left",
                    "total_completed_topics" => $roadmap->roadmapPhases->sum(function ($phase) {
                        return $phase->roadmapTopics->where("is_completed", 1)->count();
                    }) . "/" . $roadmap->roadmapPhases->sum(function ($phase) {
                        return $phase->roadmapTopics->count();
                    }),
                    "created_at" => $roadmap->created_at->format("Y-m-d H:i:s"),
                    "user" => [
                        "id" => $roadmap->user->id,
                        "name" => $roadmap->user->name,
                    ]
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validasi request
        $validated = $request->validate([
            'skill_id'        => 'required|exists:skills,id',
            'level'           => 'required|string',
            'hours_per_day'   => 'required|numeric|min:0.5|max:12',
            'target_deadline' => 'required|date|after:today',
            'tujuan_akhir'    => 'required|string',
        ]);

        // 2. Cek batas maksimal 3 roadmap aktif
        $activeCount = Roadmap::where('user_id', Auth::user()->id)
            ->where('status', 'active')
            ->count();

        if ($activeCount >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu sudah memiliki 3 roadmap aktif. Selesaikan atau hapus salah satu sebelum membuat yang baru.',
            ], 422);
        }

        // 3. Ambil data skill
        $skill = Skill::findOrFail($validated['skill_id']);

        // 4. Generate & Simpan via Service
        try {
            $roadmap = $this->gemini->handleRoadmapGeneration($validated, $skill);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate roadmap: ' . $e->getMessage(),
            ], 500);
        }

        // 6. Load relasi dan return response
        $roadmap->load(['skill', 'roadmapPhases.roadmapTopics.topicResources']);

        return response()->json([
            'success' => true,
            'message' => 'Roadmap berhasil digenerate!',
            'data'    => $roadmap,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::guard("sanctum")->user();
        $roadmap = Roadmap::with("user", "skill", "roadmapPhases", "roadmapPhases.roadmapTopics.topicResources", "aiFeedbacks")->find($id);

        if (!$roadmap) {
            return response()->json([
                "success" => false,
                "message" => "Roadmap not found"
            ], 404);
        }

        if ($roadmap->user_id !== $user->id && $user->role != "admin") {
            return response()->json([
                "success" => false,
                "message" => "Forbidden Access"
            ], 403);
        }

        $totalTopics     = $roadmap->roadmapPhases->sum(fn($phase) => $phase->roadmapTopics->count());
        $completedTopics = $roadmap->roadmapPhases->sum(fn($phase) => $phase->roadmapTopics->where('is_completed', 1)->count());

        $progressPercent = $totalTopics > 0
            ? round(($completedTopics / $totalTopics) * 100, 1)
            : 0;

        return response()->json([
            "success" => true,
            "data" => [
                "id" => $roadmap->id,
                "title" => $roadmap->title,
                "status" => $roadmap->status,
                "hours_per_day" => $roadmap->hours_per_day,
                "progress_pecent" => $progressPercent,
                "target_deadline" => $roadmap->target_deadline,
                "skill" => $roadmap->skill,
                "days_left" => round(Carbon::parse(now())->diffInDays($roadmap->target_deadline, false)) . " days left",
                "phases" => $roadmap->roadmapPhases->map(function ($phase) {
                    return [
                        "id" => $phase->id,
                        "phase_title" => $phase->phase_title,
                        "order" => $phase->order,
                        "durasi_estimasi_hari" => $phase->durasi_estimasi_hari,
                        "completed_topic" => $phase->roadmapTopics->where("is_completed", 1)->count() . "/" . $phase->roadmapTopics->count(),
                        "is_complete_all" => $phase->roadmapTopics->where("is_completed", 1)->count() === $phase->roadmapTopics->count(),
                        "topics" => $phase->roadmapTopics->map(function ($topic) {
                            return [
                                "id" => $topic->id,
                                "topic_title" => $topic->topic_title,
                                "description" => $topic->description,
                                "completed_at" => $topic->completed_at,
                                "is_completed" => $topic->is_completed == 1 ? true : false,
                                "resources" => $topic->topicResources->map(function ($resource) {
                                    return [
                                        "title" => $resource->title,
                                        "url" => $resource->url,
                                        "type" => $resource->type,
                                    ];
                                }),
                            ];
                        })
                    ];
                }),
                "last_feedback" => $roadmap->aiFeedbacks()->latest()->first(),
            ]
        ]);
    }

    /**
     * Evaluate and restructure roadmap via AI.
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi — minimal satu field harus diisi
        $validated = $request->validate([
            'hours_per_day'      => 'nullable|numeric|min:0.5|max:12',
            'target_deadline'    => 'nullable|date|after_or_equal:today',
            'catatan_perubahan'  => 'nullable|string|max:500',
        ]);

        if (empty($validated['hours_per_day']) && empty($validated['target_deadline']) && empty($validated['catatan_perubahan'])) {
            return response()->json([
                'success' => false,
                'message' => 'Minimal satu field harus diisi (hours_per_day, target_deadline, atau catatan_perubahan).',
            ], 422);
        }

        // 2. Ambil roadmap + relasi & cek ownership
        $roadmap = Roadmap::with(['skill', 'roadmapPhases.roadmapTopics.topicResources'])->find($id);

        if (!$roadmap) {
            return response()->json([
                'success' => false,
                'message' => 'Roadmap not found',
            ], 404);
        }

        if ($roadmap->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden Access',
            ], 403);
        }

        // 3. Evaluasi & Simpan via Service
        try {
            $roadmap = $this->gemini->handleRoadmapEvaluation($roadmap, $validated);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengevaluasi roadmap: ' . $e->getMessage(),
            ], 500);
        }

        // 6. Return response
        $roadmap->load(['skill', 'roadmapPhases.roadmapTopics.topicResources']);

        return response()->json([
            'success' => true,
            'message' => 'Roadmap berhasil dievaluasi dan disesuaikan!',
            'data'    => $roadmap,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::guard("sanctum")->user();
        $roadmap = Roadmap::find($id);

        if (!$roadmap) {
            return response()->json([
                "success" => false,
                "message" => "Roadmap not found"
            ], 404);
        }

        if ($roadmap->user_id !== $user->id) {
            return response()->json([
                "success" => false,
                "message" => "Forbidden Access"
            ], 403);
        }

        $roadmap->delete();

        return response()->json([
            "success" => true,
            "message" => "Roadmap deleted succesfully",
        ]);
    }
}
