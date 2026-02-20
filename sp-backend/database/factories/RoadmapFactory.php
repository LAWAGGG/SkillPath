<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roadmap>
 */
class RoadmapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'skill_id' => \App\Models\Skill::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'level' => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
            'hours_per_day' => fake()->randomFloat(1, 1, 8),
            'target_deadline' => fake()->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'tujuan_akhir' => fake()->sentence(),
            'status' => 'active',
            'ai_raw_response' => fake()->paragraphs(3, true),
        ];
    }
}
