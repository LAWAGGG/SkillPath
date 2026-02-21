<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            "success"=>true,
            "data"=>$users
        ]);
    }

    public function userDashboard(){
        $authUser = Auth::user();
        $user = User::with("roadmaps.roadmapPhases.roadmapTopics", "aiFeedbacks")->find($authUser->id);
        $totalTopics = $user->roadmaps->sum(function($roadmap){
            return $roadmap->roadmapPhases->sum(function($phase){
                return $phase->roadmapTopics->count();
            });
        });

        $remainingTopics = $user->roadmaps->sum(function($roadmap){
            return $roadmap->roadmapPhases->sum(function($phase){
                return $phase->roadmapTopics()->where("is_completed", 0)->count();
            });
        });

        $completedTopics = $user->roadmaps->sum(function($roadmap){
            return $roadmap->roadmapPhases->sum(function($phase){
                return $phase->roadmapTopics()->where("is_completed", 1)->count();
            });
        });

        $activeRoadmaps = $user->roadmaps()->where("status", "active")->count();

        $lastFeedback = $user->aiFeedbacks->first();

        return response()->json([
            "user_name"=>$user->name,
            "total_topics"=>$totalTopics,
            "topics_remaining"=>$remainingTopics,
            "topics_completed"=>$completedTopics,
            "active_roadmaps"=>$activeRoadmaps,
            "last_feedback"=>$lastFeedback->pesan_motivasi ?? null,
            "current_roadmaps"=>$user->roadmaps->take(2)->map(function ($roadmap) {
                return [
                    "id" => $roadmap->id,
                    "title" => $roadmap->title,
                    "hours_per_day" => $roadmap->hours_per_day,
                    "status" => $roadmap->status,
                    "skill" => $roadmap->skill->name,
                    "completed_topics_count"=>$roadmap->roadmapPhases->sum(function($phase){
                        return $phase->roadmapTopics->where("is_completed", 1)->count();
                    }),
                    "total_topics"=>$roadmap->roadmapPhases->sum(function($phase){
                        return $phase->roadmapTopics->count();
                    }),
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $user = User::find($id);

        if(!$user){
            return response()->json([
                "success"=>false,
                "message"=>"User not found"
            ],404);
        }

        if($user->role == "admin"){
            return response()->json([
                "success"=>false,
                "message"=>"You cannot delete admin!"
            ],403);
        }

        $user->delete();

        return response()->json([
            "success"=>true,
            "message"=>"User deleted succesfully",
        ]);
    }
}
