<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoadmapPhase>
 */
class RoadmapPhaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'roadmap_id' => \App\Models\Roadmap::factory(),
            'phase_title' => fake()->sentence(),
            'phase_description' => fake()->paragraph(),
            'order' => fake()->numberBetween(1, 5),
            'durasi_estimasi_hari' => fake()->numberBetween(7, 30),
        ];
    }
}
