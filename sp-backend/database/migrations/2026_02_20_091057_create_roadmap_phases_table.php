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
        Schema::create('roadmap_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId("roadmap_id")->constrained()->onDelete("cascade");
            $table->text("phase_title");
            $table->text("phase_description");
            $table->integer("order");
            $table->integer("durasi_estimasi_hari");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_phases');
    }
};
