<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoadmapTopic extends Model
{
    protected $guarded = [];

    public function roadmapPhase(){
        return $this->belongsTo(RoadmapPhase::class, "roadmap_phase_id");
    }

    public function topicResources()
    {
        return $this->hasMany(TopicResource::class);
    }
}
