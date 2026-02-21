<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Skill::with("category");

        if ($request->category) {
            $query->whereHas("category", function ($cat) use ($request) {
                $cat->where("slug", "LIKE", "%{$request->category}%");
            });
        }

        if ($request->search) {
            $query->where("slug", "LIKE", "%{$request->search}%");
        }

        $skills = $query->get();

        return response()->json([
            "success" => true,
            "data" => $skills
        ]);
    }

    /**
     * Display a listing of recommended skills.
     */
    public function recommendation()
    {
        $skills = Skill::withCount('roadmaps')
            ->orderBy('roadmaps_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            "success" => true,
            "data" => $skills
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "skill_category_id" => "required|exists:skill_categories,id",
            "name" => "required",
            "slug" => "required",
            "description" => "required",
            "is_active" => "required|boolean",
        ]);

        $skill = Skill::create($request->all());

        return response()->json([
            "success" => true,
            "message" => "Skill created succesfully",
            "data" => $skill
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Skill $skill)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                "success" => false,
                "message" => "Skill not found",
            ], 404);
        }

        $request->validate([
            "skill_category_id" => "required|exists:skill_categories,id",
            "name" => "required",
            "slug" => "required",
            "description" => "required",
            "is_active" => "required|boolean",
        ]);

        $skill->update($request->all());

        return response()->json([
            "success" => true,
            "message" => "Skill updated succesfully",
            "data" => $skill
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                "success" => false,
                "message" => "Skill not found",
            ], 404);
        }

        $skill->delete();

        return response()->json([
            "success" => true,
            "message" => "Skill deleted succesfully",
        ]);
    }
}
