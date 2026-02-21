<?php

namespace App\Http\Controllers;

use App\Models\AiFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AiFeedbackController extends Controller
{
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::guard("sanctum")->user();
        $feedbacks = AiFeedback::with("roadmap", "user")->whereHas("roadmap", function ($roadmap) use ($id) {
            $roadmap->where("id", $id);
        })->get();

        if($feedbacks[0]->user->id !== $user->id){
            return response()->json([
                "message"=>"Forbidden Access"
            ],403);
        }

        return response()->json([
            "success"=>true,
            "data"=>$feedbacks
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
