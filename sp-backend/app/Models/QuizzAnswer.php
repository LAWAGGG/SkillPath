<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Quizz;
use App\Models\QuizzQuestion;

class QuizzAnswer extends Model
{
    protected $table = 'quizz_answers';
    protected $guarded = [];

    public function quiz()
    {
        return $this->belongsTo(Quizz::class, 'quizz_id');
    }

    public function question()
    {
        return $this->belongsTo(QuizzQuestion::class, 'quizz_question_id');
    }
}
