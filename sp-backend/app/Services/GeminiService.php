<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Class GeminiService
 * @package App\Services
 */
class GeminiService
{
  private string $apiKey;
  private string $model;
  private string $baseUrl;

  public function __construct()
  {
    $this->apiKey = config('services.gemini.key');
    $this->model = config('services.gemini.model');
    $this->baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";
  }

  private function callGemini(string $prompt): string
  {
    $response = Http::timeout(60)->post("{$this->baseUrl}?key={$this->apiKey}", [
      'contents' => [
        [
          'parts' => [
            ['text' => $prompt]
          ]
        ]
      ],
      'generationConfig' => [
        'temperature'       => 0.7,
        'maxOutputTokens'   => 16384,
        'responseMimeType'  => 'application/json',
      ]
    ]);

    if ($response->failed()) {
      Log::error('Gemini API Error', [
        'status' => $response->status(),
        'body'   => $response->body(),
      ]);
      throw new \Exception('Gagal menghubungi Gemini API: ' . $response->status());
    }

    $result = $response->json();

    return $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
  }

  private function parseJson(string $raw): array
  {
    $clean = preg_replace('/```json|```/', '', $raw);
    $clean = trim($clean);

    $decoded = json_decode($clean, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      Log::error('Gemini JSON Parse Error', ['raw' => $raw]);
      throw new \Exception('Response AI tidak valid, coba lagi.');
    }

    return $decoded;
  }

  public function generateRoadmap(array $input, object $skill): array
  {
    $prompt = "Kamu adalah mentor belajar mandiri berpengalaman.
Buat roadmap belajar yang realistis dan terstruktur.
Response HANYA dalam format JSON valid, tanpa teks apapun di luar JSON.

Data pengguna:
- Skill yang ingin dipelajari: {$skill->name}
- Deskripsi skill: {$skill->description}
- Level saat ini: {$input['level']}
- Waktu belajar per hari: {$input['hours_per_day']} jam
- Target deadline: {$input['target_deadline']}
- Tujuan akhir: {$input['tujuan_akhir']}

ATURAN RESOURCE (SANGAT PENTING):
- DOCUMENTATION: Gunakan link dokumentasi resmi yang valid.
- VIDEO: JANGAN buat link direct video (kecuali sangat yakin). Gunakan format search YouTube: https://www.youtube.com/results?search_query=[keyword+pencarian+relevan]
- ARTICLE: JANGAN buat link direct. Gunakan format search Google: https://www.google.com/search?q=[keyword+pencarian+relevan]
- JANGAN PERNAH gunakan link placeholder atau dummy seperti 'youtube.com/watch?v=example1', 'example.com', atau URL tidak lengkap. Lebih baik gunakan link pencarian di atas jika ragu.
- Pastikan keyword pencarian spesifik dan membantu pengguna menemukan materi tersebut.

Format JSON yang harus dikembalikan:
{
  \"ringkasan\": \"string\",
  \"estimasi_total_hari\": integer,
  \"tingkat_kesulitan\": \"Pemula/Menengah/Mahir\",
  \"tips_sukses\": [\"string\", \"string\", \"string\"],
  \"peringatan\": \"string atau null\",
  \"phases\": [
    {
      \"phase_title\": \"string\",
      \"phase_description\": \"string\",
      \"order\": integer,
      \"durasi_estimasi_hari\": integer,
      \"topics\": [
        {
          \"topic_title\": \"string\",
          \"description\": \"string\",
          \"order\": integer,
          \"resources\": [
            {
              \"title\": \"string\",
              \"url\": \"string (URL pencarian/dokumentasi valid, NO PLACEHOLDER)\",
              \"type\": \"video/article/course/documentation\"
            }
          ]
        }
      ]
    }
  ]
}";

    $raw = $this->callGemini($prompt);
    return $this->parseJson($raw);
  }

  public function generateFeedback(array $data): array
  {
    $breakdownText = '';
    foreach ($data['breakdown_per_fase'] as $fase) {
      $breakdownText .= "- {$fase['phase_title']}: {$fase['completed']}/{$fase['total']} topic\n";
    }

    $prompt = "Kamu adalah mentor belajar mandiri.
Evaluasi progress belajar pengguna dan berikan feedback yang membangun.
Response HANYA dalam format JSON valid, tanpa teks apapun di luar JSON.

Data progress pengguna:
- Skill yang dipelajari: {$data['skill_name']}
- Total topik roadmap: {$data['total_topics']}
- Topik selesai: {$data['completed_topics']} dari {$data['total_topics']} ({$data['progress_persen']}%)
- Sisa hari menuju deadline: {$data['sisa_hari']} hari
- Jam belajar per hari yang direncanakan: {$data['jam_per_hari']} jam
- Breakdown progress per fase:
{$breakdownText}

Format JSON yang harus dikembalikan:
{
  \"skor_progress\": integer 0-100,
  \"apresiasi\": \"string\",
  \"analisis\": \"string\",
  \"saran_konkret\": [\"string\", \"string\", \"string\"],
  \"pesan_motivasi\": \"string\",
  \"perlu_penyesuaian_jadwal\": boolean
}";

    $raw = $this->callGemini($prompt);
    return $this->parseJson($raw);
  }

  public function evaluateRoadmap(array $data): array
  {
    $currentPhasesText = '';
    foreach ($data['current_phases'] as $phase) {
      $currentPhasesText .= "\n  Fase: {$phase['phase_title']} (order: {$phase['order']})\n";
      foreach ($phase['topics'] as $topic) {
        $status = $topic['is_completed'] ? '✅ Selesai' : '❌ Belum';
        $currentPhasesText .= "    - [{$status}] {$topic['topic_title']}\n";
      }
    }

    $changesText = '';
    if (!empty($data['new_hours_per_day'])) {
      $changesText .= "- Jam belajar per hari diubah dari {$data['old_hours_per_day']} jam menjadi {$data['new_hours_per_day']} jam\n";
    }
    if (!empty($data['new_target_deadline'])) {
      $changesText .= "- Target deadline diubah menjadi {$data['new_target_deadline']}\n";
    }
    if (!empty($data['catatan_perubahan'])) {
      $changesText .= "- Request khusus dari pengguna: {$data['catatan_perubahan']}\n";
    }

    $prompt = "Kamu adalah mentor belajar mandiri berpengalaman.
Evaluasi dan sesuaikan ulang roadmap belajar yang sudah ada berdasarkan perubahan yang diminta pengguna.
Response HANYA dalam format JSON valid, tanpa teks apapun di luar JSON.

Informasi roadmap saat ini:
- Skill: {$data['skill_name']}
- Level: {$data['level']}
- Tujuan akhir: {$data['tujuan_akhir']}
- Jam belajar per hari saat ini: {$data['old_hours_per_day']} jam
- Target deadline saat ini: {$data['old_target_deadline']}
- Progress: {$data['completed_topics']}/{$data['total_topics']} topik selesai ({$data['progress_persen']}%)

Struktur roadmap saat ini:
{$currentPhasesText}

Perubahan yang diminta:
{$changesText}

ATURAN PENTING:
1. Topik yang sudah selesai (✅) WAJIB tetap ada dengan topic_title yang SAMA PERSIS
2. Sesuaikan durasi estimasi dan struktur fase berdasarkan perubahan yang diminta
3. Boleh menambah, mengubah, atau menghapus topik yang BELUM selesai
4. Pastikan urutan (order) tetap logis dan berurutan
5. Maksimal 2 resource per topik
6. Maksimal 3-5 fase, dengan total topik tidak lebih dari 15
7. ATURAN RESOURCE (SANGAT PENTING):
   - DOCUMENTATION: Link resmi valid.
   - VIDEO: Gunakan URL search YouTube: https://www.youtube.com/results?search_query=[keyword]
   - ARTICLE: Gunakan URL search Google: https://www.google.com/search?q=[keyword]
   - DILARANG KERAS menggunakan link dummy/placeholder seperti 'youtube.com/watch?v=example' atau 'example.com'. Gunakan pola pencarian di atas jika ragu.

Format JSON yang harus dikembalikan:
{
  \"ringkasan\": \"string penjelasan singkat perubahan yang dilakukan\",
  \"phases\": [
    {
      \"phase_title\": \"string\",
      \"phase_description\": \"string\",
      \"order\": integer,
      \"durasi_estimasi_hari\": integer,
      \"topics\": [
        {
          \"topic_title\": \"string\",
          \"description\": \"string\",
          \"order\": integer,
          \"is_completed\": boolean,
          \"resources\": [
            {
              \"title\": \"string\",
              \"url\": \"string (URL pencarian/dokumentasi valid, NO PLACEHOLDER)\",
              \"type\": \"video/article/course/documentation\"
            }
          ]
        }
      ]
    }
  ]
}";

    $raw = $this->callGemini($prompt);
    return $this->parseJson($raw);
  }
}
