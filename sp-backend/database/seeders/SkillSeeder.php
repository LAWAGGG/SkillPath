<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Web Development (category_id = 1)
            ['skill_category_id' => 1, 'name' => 'Laravel', 'slug' => 'laravel', 'description' => 'Framework PHP modern untuk membangun aplikasi web yang elegan dan powerful.', 'is_active' => true],
            ['skill_category_id' => 1, 'name' => 'React.js', 'slug' => 'react-js', 'description' => 'Library JavaScript untuk membangun user interface yang interaktif dan dinamis.', 'is_active' => true],
            ['skill_category_id' => 1, 'name' => 'Vue.js', 'slug' => 'vue-js', 'description' => 'Framework JavaScript progresif untuk membangun antarmuka pengguna.', 'is_active' => true],
            ['skill_category_id' => 1, 'name' => 'Node.js', 'slug' => 'node-js', 'description' => 'Runtime JavaScript di sisi server untuk membangun aplikasi backend yang scalable.', 'is_active' => true],

            // Mobile Development (category_id = 2)
            ['skill_category_id' => 2, 'name' => 'Flutter', 'slug' => 'flutter', 'description' => 'Framework UI dari Google untuk membangun aplikasi mobile cross-platform.', 'is_active' => true],
            ['skill_category_id' => 2, 'name' => 'React Native', 'slug' => 'react-native', 'description' => 'Framework untuk membangun aplikasi mobile native menggunakan React.', 'is_active' => true],
            ['skill_category_id' => 2, 'name' => 'Kotlin', 'slug' => 'kotlin', 'description' => 'Bahasa pemrograman modern untuk pengembangan aplikasi Android.', 'is_active' => true],

            // Data Science (category_id = 3)
            ['skill_category_id' => 3, 'name' => 'Python for Data Science', 'slug' => 'python-data-science', 'description' => 'Menggunakan Python untuk analisis data, machine learning, dan visualisasi.', 'is_active' => true],
            ['skill_category_id' => 3, 'name' => 'SQL & Database', 'slug' => 'sql-database', 'description' => 'Menguasai query SQL dan manajemen database untuk analisis data.', 'is_active' => true],

            // DevOps (category_id = 4)
            ['skill_category_id' => 4, 'name' => 'Docker', 'slug' => 'docker', 'description' => 'Platform containerization untuk mengemas dan mendistribusikan aplikasi.', 'is_active' => true],
            ['skill_category_id' => 4, 'name' => 'Kubernetes', 'slug' => 'kubernetes', 'description' => 'Sistem orkestrasi container untuk deployment dan scaling otomatis.', 'is_active' => true],

            // UI/UX Design (category_id = 5)
            ['skill_category_id' => 5, 'name' => 'Figma', 'slug' => 'figma', 'description' => 'Tool desain kolaboratif berbasis cloud untuk UI/UX design.', 'is_active' => true],

            // Cybersecurity (category_id = 6)
            ['skill_category_id' => 6, 'name' => 'Ethical Hacking', 'slug' => 'ethical-hacking', 'description' => 'Teknik penetration testing dan keamanan jaringan secara etis.', 'is_active' => true],

            // Cloud Computing (category_id = 7)
            ['skill_category_id' => 7, 'name' => 'AWS', 'slug' => 'aws', 'description' => 'Amazon Web Services - platform cloud computing terpopuler di dunia.', 'is_active' => true],

            // AI (category_id = 8)
            ['skill_category_id' => 8, 'name' => 'Machine Learning', 'slug' => 'machine-learning', 'description' => 'Membangun model prediktif menggunakan algoritma machine learning.', 'is_active' => true],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
