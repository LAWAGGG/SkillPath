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
        Schema::create('ai_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("roadmap_id")->constrained()->onDelete("cascade");
            $table->integer("score_progress");
            $table->text("apresiasi");
            $table->text("analisis");
            $table->json("saran_konkret");
            $table->text("pesan_motivasi");
            $table->boolean("perlu_penyesuaian_jadwal")->default(false);
            $table->decimal("progress_saat_request");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_feedback');
    }
};
