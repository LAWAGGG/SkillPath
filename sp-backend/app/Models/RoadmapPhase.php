<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Roadmap;
use App\Models\RoadmapTopic;
use App\Models\Quizz;

class RoadmapPhase extends Model
{
    protected $guarded = [];

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function roadmapTopics()
    {
        return $this->hasMany(RoadmapTopic::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quizz::class);
    }
}
