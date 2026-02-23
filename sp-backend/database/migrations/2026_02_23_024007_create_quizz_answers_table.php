<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId("quizz_id")->constrained("quizzs")->onDelete("cascade");
            $table->foreignId("quizz_question_id")->constrained("quizz_questions")->onDelete("cascade");
            $table->enum("user_answer", ["a", "b", "c", "d"]);
            $table->boolean("is_correct");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizz_answers');
    }
};
