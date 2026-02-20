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
        Schema::create('roadmaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("skill_id")->constrained()->onDelete("cascade");
            $table->string("title");
            $table->text("description");
            $table->string("level");
            $table->decimal("hours_per_day");
            $table->date("target_deadline");
            $table->text("tujuan_akhir");
            $table->enum("status",["active", "completed"])->default("active");
            $table->longText("ai_raw_response");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmaps');
    }
};
