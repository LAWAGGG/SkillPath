<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SkillCategorySeeder::class,
            SkillSeeder::class,
            RoadmapSeeder::class,
            RoadmapPhaseSeeder::class,
            RoadmapTopicSeeder::class,
            TopicResourceSeeder::class,
            AiFeedbackSeeder::class,
        ]);
    }
}
