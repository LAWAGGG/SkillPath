<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quizz extends Model
{
    protected $table = 'quizzs';
    protected $guarded = [];

    public function questions()
    {
        return $this->hasMany(QuizzQuestion::class, 'quiz_id');
    }

    public function answers()
    {
        return $this->hasMany(QuizzAnswer::class, 'quizz_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function roadmapPhase()
    {
        return $this->belongsTo(RoadmapPhase::class, 'roadmap_phase_id');
    }
}
