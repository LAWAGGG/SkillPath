<?php

namespace Database\Seeders;

use App\Models\AiFeedback;
use Illuminate\Database\Seeder;

class AiFeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $feedbacks = [
            [
                'user_id' => 2,
                'roadmap_id' => 1,
                'score_progress' => 25,
                'apresiasi' => 'Kamu sudah menunjukkan progres yang bagus dalam mempelajari dasar-dasar pemrograman. Konsistensi belajarmu patut diapresiasi!',
                'analisis' => 'Dari 10 topik yang ada, kamu sudah menyelesaikan 2 topik dan sedang mengerjakan topik ke-3. Kecepatan belajarmu cukup baik untuk pemula.',
                'saran_konkret' => json_encode([
                    'Fokuskan waktu 30 menit setiap hari untuk latihan coding',
                    'Coba kerjakan mini project sederhana untuk mengaplikasikan teori',
                    'Review kembali materi variable dan tipe data sebelum lanjut ke fungsi',
                ]),
                'pesan_motivasi' => 'Setiap baris kode yang kamu tulis adalah langkah menuju keahlian. Terus semangat, kamu pasti bisa!',
                'perlu_penyesuaian_jadwal' => false,
                'progress_saat_request' => 25.00,
            ],
            [
                'user_id' => 3,
                'roadmap_id' => 2,
                'score_progress' => 10,
                'apresiasi' => 'Langkah pertamamu sudah tepat dengan memulai roadmap ini. Semangat untuk terus belajar!',
                'analisis' => 'Kamu baru menyelesaikan 1 topik dari total 8 topik. Masih banyak materi menarik yang menunggumu di depan.',
                'saran_konkret' => json_encode([
                    'Luangkan waktu khusus untuk membaca dokumentasi resmi',
                    'Buat catatan ringkas untuk setiap topik yang sudah dipelajari',
                    'Bergabung dengan komunitas online untuk diskusi dan bertanya',
                ]),
                'pesan_motivasi' => 'Perjalanan seribu mil dimulai dari satu langkah. Kamu sudah memulai, tinggal lanjutkan saja!',
                'perlu_penyesuaian_jadwal' => true,
                'progress_saat_request' => 10.00,
            ],
            [
                'user_id' => 4,
                'roadmap_id' => 3,
                'score_progress' => 0,
                'apresiasi' => 'Keputusanmu untuk memulai roadmap ini adalah langkah awal yang hebat. Selamat datang di perjalanan belajar!',
                'analisis' => 'Kamu belum memulai topik apapun. Tidak apa-apa, semua master pernah menjadi pemula.',
                'saran_konkret' => json_encode([
                    'Mulai dengan topik pertama dan jangan terburu-buru',
                    'Siapkan lingkungan development terlebih dahulu',
                    'Tentukan jadwal belajar yang realistis, minimal 3 kali seminggu',
                ]),
                'pesan_motivasi' => 'Waktu terbaik untuk memulai adalah sekarang. Ayo mulai topik pertamamu hari ini!',
                'perlu_penyesuaian_jadwal' => false,
                'progress_saat_request' => 0.00,
            ],
            [
                'user_id' => 2,
                'roadmap_id' => 4,
                'score_progress' => 0,
                'apresiasi' => 'Bagus sekali kamu mengambil roadmap tambahan! Ini menunjukkan semangatmu untuk terus berkembang.',
                'analisis' => 'Roadmap ini belum dimulai. Pastikan kamu menyelesaikan roadmap sebelumnya terlebih dahulu agar tidak kewalahan.',
                'saran_konkret' => json_encode([
                    'Selesaikan roadmap aktif sebelum memulai yang baru',
                    'Buat prioritas belajar agar lebih terstruktur',
                    'Gunakan teknik pomodoro untuk mengatur waktu belajar',
                ]),
                'pesan_motivasi' => 'Ambisimu luar biasa! Kelola waktumu dengan baik dan kamu akan mencapai semua targetmu.',
                'perlu_penyesuaian_jadwal' => true,
                'progress_saat_request' => 0.00,
            ],
            [
                'user_id' => 5,
                'roadmap_id' => 5,
                'score_progress' => 0,
                'apresiasi' => 'Selamat telah memilih roadmap ini! Topik yang kamu pilih sangat relevan dengan kebutuhan industri saat ini.',
                'analisis' => 'Belum ada progres yang tercatat. Roadmap ini memiliki 6 topik yang perlu diselesaikan secara berurutan.',
                'saran_konkret' => json_encode([
                    'Pelajari konsep dasar terlebih dahulu sebelum masuk ke praktik',
                    'Siapkan tools yang dibutuhkan sesuai panduan di topik pertama',
                    'Targetkan menyelesaikan minimal 1 topik per minggu',
                ]),
                'pesan_motivasi' => 'Skill yang akan kamu pelajari sangat dicari di dunia kerja. Investasi waktu belajarmu sekarang akan terbayar nanti!',
                'perlu_penyesuaian_jadwal' => false,
                'progress_saat_request' => 0.00,
            ],
        ];

        foreach ($feedbacks as $feedback) {
            AiFeedback::create($feedback);
        }
    }
}
