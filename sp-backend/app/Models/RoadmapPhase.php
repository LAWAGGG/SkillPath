<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoadmapPhase extends Model
{
    protected $guarded = [];

    public function roadmap(){
        return $this->belongsTo(Roadmap::class);
    }

    public function roadmapTopics(){
        return $this->hasMany(RoadmapTopic::class);
    }
}
