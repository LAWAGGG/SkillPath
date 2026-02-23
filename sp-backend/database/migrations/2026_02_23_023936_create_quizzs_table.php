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
        Schema::create('quizzs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("roadmap_phase_id")->constrained()->onDelete("cascade");
            $table->enum("status",["pending", "completed"]);
            $table->integer("score");
            $table->longText("ai_raw_response");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzs');
    }
};
