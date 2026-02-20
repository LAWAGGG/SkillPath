<?php

namespace Database\Seeders;

use App\Models\RoadmapPhase;
use Illuminate\Database\Seeder;

class RoadmapPhaseSeeder extends Seeder
{
    public function run(): void
    {
        $phases = [
            // Roadmap 1: Laravel (3 phases)
            ['roadmap_id' => 1, 'phase_title' => 'Dasar-Dasar Laravel', 'phase_description' => 'Mempelajari instalasi, routing, controller, dan view di Laravel.', 'order' => 1, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 1, 'phase_title' => 'Eloquent & Database', 'phase_description' => 'Mempelajari Eloquent ORM, migration, seeder, dan relasi antar tabel.', 'order' => 2, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 1, 'phase_title' => 'REST API & Authentication', 'phase_description' => 'Membangun REST API, implementasi Sanctum, dan middleware.', 'order' => 3, 'durasi_estimasi_hari' => 21],

            // Roadmap 2: React.js (3 phases)
            ['roadmap_id' => 2, 'phase_title' => 'Fundamental React', 'phase_description' => 'Mempelajari JSX, komponen, props, dan state dasar.', 'order' => 1, 'durasi_estimasi_hari' => 10],
            ['roadmap_id' => 2, 'phase_title' => 'React Hooks & State Management', 'phase_description' => 'Mendalami hooks (useState, useEffect, useContext) dan state management.', 'order' => 2, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 2, 'phase_title' => 'Integrasi API & Routing', 'phase_description' => 'Fetching data dari API, React Router, dan deployment.', 'order' => 3, 'durasi_estimasi_hari' => 14],

            // Roadmap 3: Flutter (3 phases)
            ['roadmap_id' => 3, 'phase_title' => 'Dart & Widget Dasar', 'phase_description' => 'Mempelajari bahasa Dart dan widget-widget dasar Flutter.', 'order' => 1, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 3, 'phase_title' => 'Navigasi & State Management', 'phase_description' => 'Mempelajari navigasi antar halaman dan state management (Provider/Riverpod).', 'order' => 2, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 3, 'phase_title' => 'API Integration & Publishing', 'phase_description' => 'Integrasi dengan REST API dan proses publishing ke store.', 'order' => 3, 'durasi_estimasi_hari' => 21],

            // Roadmap 4: Docker (2 phases)
            ['roadmap_id' => 4, 'phase_title' => 'Docker Fundamentals', 'phase_description' => 'Mempelajari konsep container, image, dan perintah dasar Docker.', 'order' => 1, 'durasi_estimasi_hari' => 10],
            ['roadmap_id' => 4, 'phase_title' => 'Docker Compose & Networking', 'phase_description' => 'Mempelajari Docker Compose, networking, dan volume.', 'order' => 2, 'durasi_estimasi_hari' => 14],

            // Roadmap 5: Python Data Science (3 phases)
            ['roadmap_id' => 5, 'phase_title' => 'Python Basics & Libraries', 'phase_description' => 'Mempelajari dasar Python, NumPy, dan Pandas untuk data science.', 'order' => 1, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 5, 'phase_title' => 'Data Analysis & Visualization', 'phase_description' => 'Analisis data dengan Pandas dan visualisasi menggunakan Matplotlib/Seaborn.', 'order' => 2, 'durasi_estimasi_hari' => 14],
            ['roadmap_id' => 5, 'phase_title' => 'Machine Learning Dasar', 'phase_description' => 'Pengenalan ML dengan scikit-learn: supervised & unsupervised learning.', 'order' => 3, 'durasi_estimasi_hari' => 21],
        ];

        foreach ($phases as $phase) {
            RoadmapPhase::create($phase);
        }
    }
}
