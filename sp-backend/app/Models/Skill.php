<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $guarded = [];

    public function category(){
        return $this->belongsTo(SkillCategory::class, "skill_category_id");
    }

    public function roadmaps(){
        return $this->hasMany(Roadmap::class);
    }
}
