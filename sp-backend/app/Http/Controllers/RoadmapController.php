<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoadmapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::guard("sanctum")->user();
        $roadmaps = Roadmap::where("user_id", $user->id)->latest()->get();

        return response()->json([
            "success" => true,
            "data" => $roadmaps
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::guard("sanctum")->user();
        $roadmap = Roadmap::with("user", "skill", "roadmapPhases.roadmapTopics.topicResources", "aiFeedbacks")->find($id);

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

        return response()->json([
            "success" => true,
            "data" => $roadmap
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
            "success"=>true,
            "message"=>"Roadmap deleted succesfully",
        ]);
    }
}
