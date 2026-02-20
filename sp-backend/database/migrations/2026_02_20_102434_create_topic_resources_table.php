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
        Schema::create('topic_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId("roadmap_topic_id")->constrained("roadmap_topics")->onDelete("cascade");
            $table->string("title");
            $table->text("url");
            $table->enum("type", ["video", "article", "course", "documentation"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topic_resources');
    }
};
