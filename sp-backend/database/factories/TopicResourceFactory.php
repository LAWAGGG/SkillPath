<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TopicResource>
 */
class TopicResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'roadmap_topic_id' => \App\Models\RoadmapTopic::factory(),
            'title' => fake()->sentence(),
            'url' => fake()->url(),
            'type' => fake()->randomElement(['video', 'article', 'course', 'documentation']),
        ];
    }
}
