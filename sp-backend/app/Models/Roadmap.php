<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Skill;
use App\Models\RoadmapPhase;
use App\Models\AiFeedback;

class Roadmap extends Model
{
    protected $guarded = [];

    protected $casts = [
        "target_deadline" => "date"
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    public function roadmapPhases()
    {
        return $this->hasMany(RoadmapPhase::class);
    }

    public function aiFeedbacks()
    {
        return $this->hasMany(AiFeedback::class);
    }
}
