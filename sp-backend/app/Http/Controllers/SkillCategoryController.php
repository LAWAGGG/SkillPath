<?php

namespace App\Http\Controllers;

use App\Models\SkillCategory;
use Illuminate\Http\Request;

class SkillCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = SkillCategory::all();

        return response()->json([
            "success" => true,
            "data" => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string",
            "slug" => "required|string",
        ]);

        $category = SkillCategory::create($request->all());

        return response()->json([
            "success" => true,
            "message" => "Category created succesfully",
            "data" => $category
        ], 201);
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
        $request->validate([
            "name" => "string",
            "slug" => "string",
        ]);

        $category = SkillCategory::find($id);

        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Category not found"
            ], 404);
        }

        $category->update($request->all());

        return response()->json([
            "success" => true,
            "message" => "Category updated succesfully",
            "data" => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = SkillCategory::find($id);

        if (!$category) {
            return response()->json([
                "success" => false,
                "message" => "Category not found"
            ], 404);
        }

        $category->delete();

        return response()->json([
            "success" => true,
            "message" => "Category deleted succesfully",
        ]);
    }
}
