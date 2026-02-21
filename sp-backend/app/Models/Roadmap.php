<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    protected $guarded = [];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function skill(){
        return $this->belongsTo(Skill::class);
    }

    public function roadmapPhases(){
        return $this->hasMany(RoadmapPhase::class);
    }

    public function aiFeedbacks(){
        return $this->hasMany(AiFeedback::class);
    }
}
