<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\RoadmapPhase;
use App\Models\RoadmapTopic;
use App\Models\Skill;
use App\Models\TopicResource;
use App\Models\User;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        $roadmaps = Roadmap::with("skill")->where("user_id", $user->id)->latest()->get();

        return response()->json([
            "success" => true,
            "data" => $roadmaps->map(function($roadmap){
                return[
                    "id"=>$roadmap->id,
                    "title"=>$roadmap->title,
                    "hours_per_day"=>$roadmap->hours_per_day,
                    "status"=>$roadmap->status,
                    "skill"=>$roadmap->skill->name
                ];
            })
        ]);
    }

    public function adminRoadmaps()
    {
        $roadmaps = Roadmap::all();

        return response()->json([
            "success" => true,
            "data" => $roadmaps
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

        // 4. Panggil Gemini AI
        try {
            $aiResult = $this->gemini->generateRoadmap($validated, $skill);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate roadmap dari AI: ' . $e->getMessage(),
            ], 500);
        }

        // 5. Simpan ke DB dalam transaction
        try {
            $roadmap = DB::transaction(function () use ($validated, $skill, $aiResult, $request) {

                // Simpan roadmap utama
                $roadmap = Roadmap::create([
                    'user_id'         => Auth::user()->id,
                    'skill_id'        => $skill->id,
                    'title'           => 'Roadmap ' . $skill->name,
                    'description'     => $aiResult['ringkasan'] ?? '',
                    'level'           => $validated['level'],
                    'hours_per_day'   => $validated['hours_per_day'],
                    'target_deadline' => $validated['target_deadline'],
                    'tujuan_akhir'    => $validated['tujuan_akhir'],
                    'status'          => 'active',
                    'ai_raw_response' => json_encode($aiResult),
                ]);

                // Loop dan simpan setiap phase
                foreach ($aiResult['phases'] as $phaseData) {
                    $phase = RoadmapPhase::create([
                        'roadmap_id'           => $roadmap->id,
                        'phase_title'          => $phaseData['phase_title'],
                        'phase_description'    => $phaseData['phase_description'] ?? $phaseData['phase_title'],
                        'order'                => $phaseData['order'],
                        'durasi_estimasi_hari' => $phaseData['durasi_estimasi_hari'],
                    ]);

                    // Loop dan simpan setiap topic dalam phase
                    foreach ($phaseData['topics'] as $topicData) {
                        $topic = RoadmapTopic::create([
                            'roadmap_phase_id' => $phase->id,
                            'topic_title'      => $topicData['topic_title'],
                            'description'      => $topicData['description'] ?? '',
                            'order'            => $topicData['order'],
                            'is_completed'     => false,
                            'completed_at'     => null,
                        ]);

                        // Loop dan simpan setiap resource dalam topic
                        foreach ($topicData['resources'] ?? [] as $resourceData) {
                            TopicResource::create([
                                'roadmap_topic_id' => $topic->id,
                                'title'            => $resourceData['title'],
                                'url'              => $resourceData['url'],
                                'type'             => in_array($resourceData['type'], ['video', 'article', 'course', 'documentation'])
                                    ? $resourceData['type']
                                    : 'article',
                            ]);
                        }
                    }
                }

                return $roadmap;
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan roadmap ke database: ' . $e->getMessage(),
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

        if ($roadmap->user_id !== $user->id) {
            return response()->json([
                "success" => false,
                "message" => "Forbidden Access"
            ], 403);
        }

        $totalTopics     = $roadmap->roadmapPhases->sum(fn($phase) => $phase->roadmapTopics->count());
        $completedTopics = $roadmap->roadmapPhases->sum(fn($phase) => $phase->roadmapTopics->where('is_completed', 1)->count());

        $progressPersen = $totalTopics > 0
            ? round(($completedTopics / $totalTopics) * 100, 1)
            : 0;

        return response()->json([
            "success" => true,
            "data" => [
                "id" => $roadmap->id,
                "title" => $roadmap->title,
                "status" => $roadmap->status,
                "progress_persen" => $progressPersen,
                "target_deadline" => $roadmap->target_deadline,
                "skill" => $roadmap->skill,
                "phases" => $roadmap->roadmapPhases->map(function ($phase) {
                    return [
                        "id" => $phase->id,
                        "phase_title" => $phase->phase_title,
                        "order" => $phase->order,
                        "durasi_estimasi_hari" => $phase->durasi_estimasi_hari,
                        "topics" => $phase->roadmapTopics->map(function ($topic) {
                            return [
                                "id" => $topic->id,
                                "topic_title" => $topic->topic_title,
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Roadmap $roadmap)
    {
        //
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
