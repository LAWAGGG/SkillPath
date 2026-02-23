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
        Schema::create('quizz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId("quiz_id")->constrained("quizzs")->onDelete("cascade");
            $table->text("question");
            $table->text("option_a");
            $table->text("option_b");
            $table->text("option_c");
            $table->text("option_d");
            $table->text("true_answer");
            $table->text("overview");
            $table->integer("order");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizz_questions');
    }
};
