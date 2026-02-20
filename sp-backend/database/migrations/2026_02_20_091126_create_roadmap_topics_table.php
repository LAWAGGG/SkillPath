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
        Schema::create('roadmap_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId("roadmap_phase_id")->constrained("roadmap_phases")->onDelete("cascade");
            $table->text("topic_title");
            $table->text("description");
            $table->integer("order");
            $table->boolean("is_completed")->default(false);
            $table->dateTime("completed_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_topics');
    }
};
