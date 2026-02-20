<?php

namespace Database\Seeders;

use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Web Development', 'slug' => 'web-development'],
            ['name' => 'Mobile Development', 'slug' => 'mobile-development'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'DevOps', 'slug' => 'devops'],
            ['name' => 'UI/UX Design', 'slug' => 'ui-ux-design'],
            ['name' => 'Cybersecurity', 'slug' => 'cybersecurity'],
            ['name' => 'Cloud Computing', 'slug' => 'cloud-computing'],
            ['name' => 'Artificial Intelligence', 'slug' => 'artificial-intelligence'],
        ];

        foreach ($categories as $category) {
            SkillCategory::create($category);
        }
    }
}
