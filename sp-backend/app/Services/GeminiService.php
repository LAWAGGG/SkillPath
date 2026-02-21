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
                'maxOutputTokens'   => 8192,
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
              \"url\": \"url valid yang bisa diakses\",
              \"type\": \"video/artikel/kursus/dokumentasi\"
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
}
