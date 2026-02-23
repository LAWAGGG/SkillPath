<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Quizz;
use App\Models\QuizzAnswer;

class QuizzQuestion extends Model
{
    protected $table = 'quizz_questions';
    protected $guarded = [];

    public function quiz()
    {
        return $this->belongsTo(Quizz::class, 'quiz_id');
    }

    public function answers()
    {
        return $this->hasMany(QuizzAnswer::class, 'quizz_question_id');
    }
}
