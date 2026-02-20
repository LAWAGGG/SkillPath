<?php

namespace Database\Seeders;

use App\Models\RoadmapTopic;
use Illuminate\Database\Seeder;

class RoadmapTopicSeeder extends Seeder
{
    public function run(): void
    {
        $topics = [
            // Phase 1: Dasar-Dasar Laravel (roadmap 1)
            ['roadmap_phase_id' => 1, 'topic_title' => 'Instalasi Laravel & Setup Environment', 'description' => 'Cara install Laravel menggunakan Composer dan konfigurasi awal.', 'order' => 1, 'is_completed' => true, 'completed_at' => '2026-02-22 10:00:00'],
            ['roadmap_phase_id' => 1, 'topic_title' => 'Routing & Controller', 'description' => 'Memahami sistem routing dan membuat controller di Laravel.', 'order' => 2, 'is_completed' => true, 'completed_at' => '2026-02-24 14:00:00'],
            ['roadmap_phase_id' => 1, 'topic_title' => 'Blade Templating Engine', 'description' => 'Menggunakan Blade untuk membuat view yang dynamic.', 'order' => 3, 'is_completed' => false, 'completed_at' => null],

            // Phase 2: Eloquent & Database (roadmap 1)
            ['roadmap_phase_id' => 2, 'topic_title' => 'Migration & Schema Builder', 'description' => 'Membuat dan mengelola struktur database menggunakan migration.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 2, 'topic_title' => 'Eloquent ORM Basics', 'description' => 'CRUD operations menggunakan Eloquent model.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 2, 'topic_title' => 'Eloquent Relationships', 'description' => 'Relasi hasOne, hasMany, belongsTo, dan belongsToMany.', 'order' => 3, 'is_completed' => false, 'completed_at' => null],

            // Phase 3: REST API & Auth (roadmap 1)
            ['roadmap_phase_id' => 3, 'topic_title' => 'Building REST API', 'description' => 'Membuat endpoint API dengan resource controller.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 3, 'topic_title' => 'Laravel Sanctum Authentication', 'description' => 'Implementasi token-based authentication menggunakan Sanctum.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 3, 'topic_title' => 'Middleware & Authorization', 'description' => 'Membuat middleware custom dan policy untuk authorization.', 'order' => 3, 'is_completed' => false, 'completed_at' => null],

            // Phase 4: Fundamental React (roadmap 2)
            ['roadmap_phase_id' => 4, 'topic_title' => 'Pengenalan JSX & Komponen', 'description' => 'Memahami JSX syntax dan membuat functional component.', 'order' => 1, 'is_completed' => true, 'completed_at' => '2026-02-21 09:00:00'],
            ['roadmap_phase_id' => 4, 'topic_title' => 'Props & State', 'description' => 'Passing data dengan props dan mengelola state komponen.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],

            // Phase 5: React Hooks (roadmap 2)
            ['roadmap_phase_id' => 5, 'topic_title' => 'useState & useEffect', 'description' => 'Hooks dasar untuk state dan side effects.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 5, 'topic_title' => 'useContext & Custom Hooks', 'description' => 'Context API dan membuat custom hooks.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],

            // Phase 7: Dart & Widget Dasar (roadmap 3)
            ['roadmap_phase_id' => 7, 'topic_title' => 'Bahasa Dart Fundamentals', 'description' => 'Tipe data, variabel, function, dan OOP di Dart.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 7, 'topic_title' => 'Widget Tree & Layout', 'description' => 'Memahami widget tree, Row, Column, dan Container.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 7, 'topic_title' => 'Stateful vs Stateless Widget', 'description' => 'Perbedaan dan penggunaan StatefulWidget dan StatelessWidget.', 'order' => 3, 'is_completed' => false, 'completed_at' => null],

            // Phase 10: Docker Fundamentals (roadmap 4)
            ['roadmap_phase_id' => 10, 'topic_title' => 'Konsep Containerization', 'description' => 'Memahami perbedaan container vs VM dan konsep image.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 10, 'topic_title' => 'Dockerfile & Building Images', 'description' => 'Menulis Dockerfile dan membangun custom image.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],

            // Phase 12: Python Basics (roadmap 5)
            ['roadmap_phase_id' => 12, 'topic_title' => 'Python Syntax & Data Types', 'description' => 'Variabel, tipe data, list, dictionary, dan control flow di Python.', 'order' => 1, 'is_completed' => false, 'completed_at' => null],
            ['roadmap_phase_id' => 12, 'topic_title' => 'NumPy & Pandas Basics', 'description' => 'Operasi array dengan NumPy dan DataFrame dengan Pandas.', 'order' => 2, 'is_completed' => false, 'completed_at' => null],
        ];

        foreach ($topics as $topic) {
            RoadmapTopic::create($topic);
        }
    }
}
