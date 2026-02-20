<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopicResource extends Model
{
    protected $guarded = [];

    public function roadmapTopic(){
        return $this->belongsTo(RoadmapTopic::class);
    }
}
