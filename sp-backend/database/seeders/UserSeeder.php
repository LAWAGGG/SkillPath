<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin SkillPath',
            'email' => 'admin@skillpath.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        // Regular users
        $users = [
            ['name' => 'Budi Santoso', 'email' => 'budi@example.com', 'password' => 'password', 'role' => 'user'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siti@example.com', 'password' => 'password', 'role' => 'user'],
            ['name' => 'Andi Pratama', 'email' => 'andi@example.com', 'password' => 'password', 'role' => 'user'],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@example.com', 'password' => 'password', 'role' => 'user'],
            ['name' => 'Rizky Hidayat', 'email' => 'rizky@example.com', 'password' => 'password', 'role' => 'user'],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
