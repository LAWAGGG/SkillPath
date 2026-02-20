<?php

namespace Database\Seeders;

use App\Models\AiFeedback;
use Illuminate\Database\Seeder;

class AiFeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $feedbacks = [
            ['user_id' => 2, 'roadmap_id' => 1, 'score_progress' => 25],
            ['user_id' => 3, 'roadmap_id' => 2, 'score_progress' => 10],
            ['user_id' => 4, 'roadmap_id' => 3, 'score_progress' => 0],
            ['user_id' => 2, 'roadmap_id' => 4, 'score_progress' => 0],
            ['user_id' => 5, 'roadmap_id' => 5, 'score_progress' => 0],
        ];

        foreach ($feedbacks as $feedback) {
            AiFeedback::create($feedback);
        }
    }
}
