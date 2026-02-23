<?php

namespace App\Http\Controllers;

use App\Models\Quizz;
use App\Models\QuizzAnswer;
use App\Models\QuizzQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizzQuestionController extends Controller
{
    public function answerQuestion($quizzId, $questionId, Request $request)
    {
        $request->validate([
            "answer" => "required|in:a,b,c,d"
        ]);

        // Tidak perlu eager loading "questions" dan "answers.question" jika tidak dipakai
        $quizz = Quizz::find($quizzId);

        if (!$quizz) {
            return response()->json(['success' => false, 'message' => 'Quiz Not Found'], 404);
        }

        if ($quizz->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        // Langsung cek quiz_id di query untuk efisiensi
        $question = QuizzQuestion::where('id', $questionId)->where('quiz_id', $quizzId)->first();

        if (!$question) {
            return response()->json(['success' => false, 'message' => 'Question Not Found or Forbidden'], 404);
        }

        $isAlreadyHaveAnswer = QuizzAnswer::where("quizz_id", $quizzId)->where("quizz_question_id", $questionId)->first();

        if ($isAlreadyHaveAnswer) {
            $isAlreadyHaveAnswer->update([
                "user_answer" => $request->answer,
                "is_correct" => $request->answer === $question->true_answer,
            ]);

            return response()->json([
                'success' => true,
                'question' => $isAlreadyHaveAnswer,
            ]);
        } else {
            $answer = QuizzAnswer::create([
                'quizz_id' => $quizzId,
                'quizz_question_id' => $questionId,
                'user_answer' => $request->answer,
                'is_correct' => $request->answer === $question->true_answer,
            ]);

            return response()->json([
                'success' => true,
                'question' => $answer,
            ]);
        }
    }
}
