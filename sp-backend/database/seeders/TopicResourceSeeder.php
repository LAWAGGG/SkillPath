<?php

namespace Database\Seeders;

use App\Models\TopicResource;
use Illuminate\Database\Seeder;

class TopicResourceSeeder extends Seeder
{
    public function run(): void
    {
        $resources = [
            // Topic 1: Instalasi Laravel
            ['roadmap_topic_id' => 1, 'title' => 'Dokumentasi Resmi Laravel - Installation', 'url' => 'https://laravel.com/docs/11.x/installation', 'type' => 'documentation'],
            ['roadmap_topic_id' => 1, 'title' => 'Laravel dari Nol - Web Programming UNPAS', 'url' => 'https://youtube.com/watch?v=example1', 'type' => 'video'],

            // Topic 2: Routing & Controller
            ['roadmap_topic_id' => 2, 'title' => 'Laravel Routing Documentation', 'url' => 'https://laravel.com/docs/11.x/routing', 'type' => 'documentation'],
            ['roadmap_topic_id' => 2, 'title' => 'Tutorial Controller Laravel', 'url' => 'https://youtube.com/watch?v=example2', 'type' => 'video'],

            // Topic 3: Blade Templating
            ['roadmap_topic_id' => 3, 'title' => 'Blade Templates - Laravel Docs', 'url' => 'https://laravel.com/docs/11.x/blade', 'type' => 'documentation'],

            // Topic 4: Migration
            ['roadmap_topic_id' => 4, 'title' => 'Database Migration - Laravel Docs', 'url' => 'https://laravel.com/docs/11.x/migrations', 'type' => 'documentation'],

            // Topic 5: Eloquent ORM
            ['roadmap_topic_id' => 5, 'title' => 'Eloquent ORM - Laravel Docs', 'url' => 'https://laravel.com/docs/11.x/eloquent', 'type' => 'documentation'],
            ['roadmap_topic_id' => 5, 'title' => 'Laravel Eloquent Tutorial - Laracasts', 'url' => 'https://laracasts.com/series/laravel-eloquent', 'type' => 'course'],

            // Topic 7: Building REST API
            ['roadmap_topic_id' => 7, 'title' => 'Build REST API with Laravel - Article', 'url' => 'https://medium.com/laravel-rest-api-guide', 'type' => 'article'],

            // Topic 8: Sanctum
            ['roadmap_topic_id' => 8, 'title' => 'Laravel Sanctum - Official Docs', 'url' => 'https://laravel.com/docs/11.x/sanctum', 'type' => 'documentation'],

            // Topic 10: Pengenalan JSX (React)
            ['roadmap_topic_id' => 10, 'title' => 'React Official Tutorial', 'url' => 'https://react.dev/learn', 'type' => 'documentation'],
            ['roadmap_topic_id' => 10, 'title' => 'Full React Course - freeCodeCamp', 'url' => 'https://youtube.com/watch?v=react-full-course', 'type' => 'video'],

            // Topic 12: useState & useEffect
            ['roadmap_topic_id' => 12, 'title' => 'React Hooks Documentation', 'url' => 'https://react.dev/reference/react', 'type' => 'documentation'],

            // Topic 14: Dart Fundamentals
            ['roadmap_topic_id' => 14, 'title' => 'Dart Language Tour', 'url' => 'https://dart.dev/guides/language/language-tour', 'type' => 'documentation'],
            ['roadmap_topic_id' => 14, 'title' => 'Flutter & Dart Course - Udemy', 'url' => 'https://udemy.com/course/flutter-dart-complete', 'type' => 'course'],

            // Topic 17: Docker Containerization
            ['roadmap_topic_id' => 17, 'title' => 'Docker Getting Started', 'url' => 'https://docs.docker.com/get-started/', 'type' => 'documentation'],
            ['roadmap_topic_id' => 17, 'title' => 'Docker Tutorial - TechWorld with Nana', 'url' => 'https://youtube.com/watch?v=docker-tutorial', 'type' => 'video'],

            // Topic 19: Python Syntax
            ['roadmap_topic_id' => 19, 'title' => 'Python Official Tutorial', 'url' => 'https://docs.python.org/3/tutorial/', 'type' => 'documentation'],
            ['roadmap_topic_id' => 19, 'title' => 'Python for Beginners - Kelas Terbuka', 'url' => 'https://youtube.com/watch?v=python-indo', 'type' => 'video'],

            // Topic 20: NumPy & Pandas
            ['roadmap_topic_id' => 20, 'title' => 'Pandas Getting Started', 'url' => 'https://pandas.pydata.org/docs/getting_started/', 'type' => 'documentation'],
            ['roadmap_topic_id' => 20, 'title' => 'Data Analysis with Python - freeCodeCamp', 'url' => 'https://youtube.com/watch?v=data-analysis-python', 'type' => 'course'],
        ];

        foreach ($resources as $resource) {
            TopicResource::create($resource);
        }
    }
}
