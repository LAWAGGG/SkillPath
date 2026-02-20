<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
