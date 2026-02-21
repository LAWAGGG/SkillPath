<?php

namespace App\Http\Controllers;

use App\Models\RoadmapTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoadmapTopicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(RoadmapTopic $roadmapTopic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RoadmapTopic $roadmapTopic)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::guard("sanctum")->user();
        $topic = RoadmapTopic::with("roadmapPhase.roadmap")->find($id);

        if(!$topic){
            return response()->json([
                "success"=>false,
                "message"=>"Topic not found"
            ],404);
        }

        if($topic->roadmapPhase->roadmap->user_id !== $user->id){
            return response()->json([
                "success"=>false,
                "message"=>"Forbidden Access"
            ],403);
        }

        $toggle = $topic->is_completed == 0 ? 1 : 0;

        $topic->update([
            "is_completed"=>$toggle
        ]);

        return response()->json([
            "success"=>true,
            "message"=>"Topic updated to {$toggle} succesfully",
            "data"=>$topic
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoadmapTopic $roadmapTopic)
    {
        //
    }
}
