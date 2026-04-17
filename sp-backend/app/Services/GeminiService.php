<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Roadmap;
use App\Models\RoadmapPhase;
use App\Models\RoadmapTopic;
use App\Models\TopicResource;
use App\Models\AiFeedback;
use App\Models\Quizz;
use App\Models\QuizzQuestion;
use App\Models\QuizzAnswer;
use App\Models\Skill;

/**
 * Class GeminiService
 * @package App\Services
 */
class GeminiService
{
  private string $apiKey;
  private string $model;
  private string $streamUrl;
  private string $fallbackModel;
  private string $fallbackStreamUrl;

  public function __construct()
  {
    $this->apiKey          = config('services.gemini.key');
    $this->model           = config('services.gemini.model');
    $this->streamUrl       = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:streamGenerateContent";
    $this->fallbackModel   = config('services.gemini.fallback_model', 'gemini-2.5-flash-lite');
    $this->fallbackStreamUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->fallbackModel}:streamGenerateContent";
  }

  private function callGemini(string $prompt, int $maxRetries = 3): string
  {
    $baseMessages = [
      [
        'role'  => 'user',
        'parts' => [['text' => $prompt]]
      ]
    ];

    // Try primary model first, then fallback if 503 is exhausted
    $modelsToTry = [
      ['url' => $this->streamUrl,         'name' => $this->model],
      ['url' => $this->fallbackStreamUrl, 'name' => $this->fallbackModel],
    ];

    foreach ($modelsToTry as $modelIndex => $modelConfig) {
      $fullText = '';
      $messages = $baseMessages;

      if ($modelIndex > 0) {
        Log::warning('Switching to fallback Gemini model', [
          'fallback_model' => $modelConfig['name'],
        ]);
        sleep(2); // brief pause before trying fallback
      }

      for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
        $response = Http::connectTimeout(15)
          ->timeout(180)
          ->post("{$modelConfig['url']}?alt=sse&key={$this->apiKey}", [
            'contents'         => $messages,
            'generationConfig' => [
              'temperature'      => 0.7,
              'maxOutputTokens'  => 65536,
              'responseMimeType' => 'application/json',
            ]
          ]);

        // 503: retry with exponential backoff on the same model
        if ($response->status() === 503 && $attempt < $maxRetries) {
          $waitSeconds = pow(2, $attempt + 1); // 2s, 4s, 8s
          Log::warning('Gemini API 503 (high demand), retrying...', [
            'model'        => $modelConfig['name'],
            'attempt'      => $attempt + 1,
            'retry_in_sec' => $waitSeconds,
          ]);
          sleep($waitSeconds);
          continue;
        }

        // 503 after all retries exhausted → break to try fallback model
        if ($response->status() === 503) {
          Log::warning('Gemini all retries exhausted on 503, switching to fallback model...', [
            'model' => $modelConfig['name'],
          ]);
          break; // eksit for → foreach lanjut ke model berikutnya
        }

        if ($response->failed()) {
          Log::error('Gemini API Error', [
            'status' => $response->status(),
            'body'   => $response->body(),
            'model'  => $modelConfig['name'],
          ]);
          throw new \Exception('Gagal menghubungi Gemini API: ' . $response->status());
        }

        $chunkText    = '';
        $finishReason = null;
        $lines        = explode("\n", $response->body());

        foreach ($lines as $line) {
          $line = trim($line);
          if (str_starts_with($line, 'data: ')) {
            $json  = substr($line, 6);
            $chunk = json_decode($json, true);

            // Check for API-level errors in the stream
            if (isset($chunk['error'])) {
              Log::error('Gemini Stream Error Chunk', ['chunk' => $chunk]);
              throw new \Exception('Gemini API Error: ' . ($chunk['error']['message'] ?? 'Unknown error'));
            }

            if (isset($chunk['candidates'][0]['content']['parts'][0]['text'])) {
              $chunkText .= $chunk['candidates'][0]['content']['parts'][0]['text'];
            }

            if (isset($chunk['candidates'][0]['finishReason'])) {
              $finishReason = $chunk['candidates'][0]['finishReason'];
            }
          }
        }

        $fullText .= $chunkText;

        if ($finishReason === 'MAX_TOKENS' && $attempt < $maxRetries) {
          Log::warning('Gemini response truncated (MAX_TOKENS), attempting continuation...', [
            'model'          => $modelConfig['name'],
            'attempt'        => $attempt + 1,
            'fullTextLength' => strlen($fullText),
          ]);

          // Build continuation: append model's partial response and ask to continue
          $messages[] = [
            'role'  => 'model',
            'parts' => [['text' => $chunkText]]
          ];
          $messages[] = [
            'role'  => 'user',
            'parts' => [['text' => 'Response JSON kamu terpotong. Lanjutkan TEPAT dari posisi terakhir, jangan ulangi dari awal. Lanjutkan menulis sisa JSON-nya saja.']]
          ];

          continue;
        }

        if ($finishReason === 'MAX_TOKENS') {
          Log::error('Gemini response still truncated after retry', [
            'model'          => $modelConfig['name'],
            'fullTextLength' => strlen($fullText),
          ]);
        }

        break; // success atau non-503 error — keluar dari retry loop
      }

      // Kalau model ini berhasil menghasilkan teks, langsung return
      if (!empty($fullText)) {
        return $fullText;
      }

      // fullText kosong → model ini gagal (503 exhausted) → coba model berikutnya
    }

    // Semua model gagal
    Log::error('Gemini all models failed to produce a response', [
      'primary_model'  => $this->model,
      'fallback_model' => $this->fallbackModel,
    ]);
    throw new \Exception('Response AI kosong atau tidak lengkap, coba lagi.');
  }

  private function parseJson(string $raw): array
  {
    // Robust extraction: find the first '{' and the last '}'
    if (preg_match('/\{.*\}/s', $raw, $matches)) {
      $clean = $matches[0];
    } else {
      $clean = preg_replace('/```json|```/', '', $raw);
      $clean = trim($clean);
    }

    $decoded = json_decode($clean, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      Log::warning('Gemini JSON Parse Error, trying to auto-repair...', [
        'error' => json_last_error_msg()
      ]);
      
      $clean = $this->repairJson($clean);
      $decoded = json_decode($clean, true);
      
      if (json_last_error() !== JSON_ERROR_NONE) {
          Log::error('Gemini JSON Repair Failed', [
            'error' => json_last_error_msg(),
            'raw_snippet' => substr($raw, -500)
          ]);
          throw new \Exception('Response AI tidak lengkap (terpotong) dan gagal dipulihkan, silakan coba lagi dengan jumlah topik yang sedikit lebih padat atau spesifik.');
      }
    }

    return $decoded;
  }

  /**
   * Auto-repair truncated JSON by checking unclosed strings and brackets.
   */
  private function repairJson(string $json): string
  {
    $inString = false;
    $escape = false;
    $stack = []; // Stores expected closing brackets

    for ($i = 0; $i < strlen($json); $i++) {
      $c = $json[$i];

      if ($escape) {
        $escape = false;
        continue;
      }
      if ($c === '\\') {
        $escape = true;
        continue;
      }
      if ($c === '"') {
        $inString = !$inString;
        continue;
      }

      if (!$inString) {
        if ($c === '{') {
          $stack[] = '}';
        } elseif ($c === '[') {
          $stack[] = ']';
        } elseif ($c === '}' || $c === ']') {
          array_pop($stack);
        }
      }
    }

    if ($inString) {
      $json .= '"';
    }

    // Clean up trailing commas if any, ignoring whitespace
    $json = preg_replace('/,\s*$/', '', $json);

    // Close all remaining brackets
    while (!empty($stack)) {
      $json .= array_pop($stack);
    }

    return $json;
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

Setiap topik WAJIB memiliki field 'description' yang berisi penjelasan ringkas nan padat tentang materi tersebut, MAKSIMAL 2-3 paragraf. Description ini harus berfungsi sebagai materi pembelajaran yang to-the-point. Gunakan format Markdown.

Struktur description yang WAJIB diikuti:
1. **Pengantar & Konsep**: Jelaskan secara sederhana apa itu [topik] dan konsep utamanya.
2. **Contoh Praktis**: Berikan contoh kode singkat JIKA relevan.
3. **Tips & Rangkuman**: Poin penting yang harus diingat.

Gunakan bahasa Indonesia yang mudah dipahami.
JANGAN melebihi 3 paragraf per topik. Buat penjelasan sepadat mungkin!

ATURAN RESOURCE (SANGAT PENTING):
- Berikan MAKSIMAL 2 link resource per topik (Dokumentasi/Video/Artikel).
- DOCUMENTATION: Gunakan link dokumentasi resmi yang valid.
- VIDEO: Format search YouTube: https://www.youtube.com/results?search_query=[keyword]
- ARTICLE: Format search Google dengan filter 'site:': https://www.google.com/search?q=[keyword]+site:[domain]
- JANGAN PERNAH gunakan link placeholder atau dummy.

ATURAN JUMLAH FASE DAN TOPIK (KRUSIAL UNTUK MENGHINDARI ERROR TOKEN LIMIT):
- Sesuaikan jumlah fase dan topik dengan kebutuhan materi.
- BAGAIMANAPUN JUGA, total KESELURUHAN TOPIK dalam roadmap JANGAN MELEBIHI 15 Topik! 
- Jika materi skill sangat luas, KELOMPOKKAN beberapa materi kecil menjadi satu topik (modul) besar. Jangan memecahnya menjadi 20+ topik karena respons PASTI akan terpotong (truncated) oleh sistem!

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
          \"description\": \"string (WAJIB detail 2-3 paragraf dalam format Markdown, berisi penjelasan lengkap materi, contoh kode, tips, dan rangkuman poin kunci)\",
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

  /**
   * Orchestrate roadmap generation and DB saving.
   */
  public function handleRoadmapGeneration(array $validated, Skill $skill): Roadmap
  {
    $aiResult = $this->generateRoadmap($validated, $skill);

    return DB::transaction(function () use ($validated, $skill, $aiResult) {
      $roadmap = Roadmap::create([
        'user_id'         => Auth::id(),
        'skill_id'        => $skill->id,
        'title'           => 'Roadmap ' . $skill->name,
        'description'     => $aiResult['ringkasan'] ?? '',
        'level'           => $validated['level'],
        'hours_per_day'   => $validated['hours_per_day'],
        'target_deadline' => $validated['target_deadline'],
        'tujuan_akhir'    => $validated['tujuan_akhir'],
        'status'          => 'active',
        'ai_raw_response' => json_encode($aiResult),
      ]);

      foreach ($aiResult['phases'] as $phaseData) {
        $phase = RoadmapPhase::create([
          'roadmap_id'           => $roadmap->id,
          'phase_title'          => $phaseData['phase_title'],
          'phase_description'    => $phaseData['phase_description'] ?? $phaseData['phase_title'],
          'order'                => $phaseData['order'],
          'durasi_estimasi_hari' => $phaseData['durasi_estimasi_hari'],
        ]);

        foreach ($phaseData['topics'] as $topicData) {
          $topic = RoadmapTopic::create([
            'roadmap_phase_id' => $phase->id,
            'topic_title'      => $topicData['topic_title'],
            'description'      => $topicData['description'] ?? '',
            'order'            => $topicData['order'],
            'is_completed'     => false,
          ]);

          foreach ($topicData['resources'] ?? [] as $resourceData) {
            TopicResource::create([
              'roadmap_topic_id' => $topic->id,
              'title'            => $resourceData['title'],
              'url'              => $resourceData['url'],
              'type'             => in_array($resourceData['type'], ['video', 'article', 'course', 'documentation'])
                ? $resourceData['type']
                : 'article',
            ]);
          }
        }
      }

      return $roadmap->load(['skill', 'roadmapPhases.roadmapTopics.topicResources']);
    });
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

  /**
   * Orchestrate feedback generation and DB saving.
   */
  public function handleFeedbackGeneration(Roadmap $roadmap): AiFeedback
  {
    $totalTopics     = 0;
    $completedTopics = 0;
    $breakdownPerFase = [];

    foreach ($roadmap->roadmapPhases as $phase) {
      $total = $phase->roadmapTopics->count();
      $completed = $phase->roadmapTopics->where('is_completed', 1)->count();

      $totalTopics     += $total;
      $completedTopics += $completed;

      $breakdownPerFase[] = [
        "phase_title" => $phase->phase_title,
        "completed"   => $completed,
        "total"       => $total,
      ];
    }

    $data = [
      'skill_name'         => $roadmap->skill->name,
      'total_topics'       => $totalTopics,
      'completed_topics'   => $completedTopics,
      'progress_persen'    => $totalTopics > 0 ? round(($completedTopics / $totalTopics) * 100, 1) : 0,
      'sisa_hari'          => now()->diffInDays($roadmap->target_deadline, false),
      'jam_per_hari'       => $roadmap->hours_per_day,
      'breakdown_per_fase' => $breakdownPerFase,
    ];

    $aiResult = $this->generateFeedback($data);

    return AiFeedback::create([
      'user_id'                  => Auth::id(),
      'roadmap_id'               => $roadmap->id,
      'score_progress'           => $aiResult['skor_progress'],
      'apresiasi'                => $aiResult['apresiasi'],
      'analisis'                 => $aiResult['analisis'],
      'saran_konkret'            => $aiResult['saran_konkret'],
      'pesan_motivasi'           => $aiResult['pesan_motivasi'],
      'perlu_penyesuaian_jadwal' => $aiResult['perlu_penyesuaian_jadwal'],
      'progress_saat_request'    => $data['progress_persen'],
    ]);
  }

  public function evaluateRoadmap(array $input): array
  {
    $currentPhasesText = "";
    foreach ($input['current_phases'] as $phase) {
      $currentPhasesText .= "\n  Fase: {$phase['phase_title']} (order: {$phase['order']})\n";
      foreach ($phase['topics'] as $topic) {
        $status = $topic['is_completed'] ? '✅ Selesai' : '❌ Belum';
        $currentPhasesText .= "    - [{$status}] {$topic['topic_title']}\n";
      }
    }

    $changesText = '';
    if (!empty($input['new_hours_per_day'])) {
      $changesText .= "- Jam belajar per hari diubah dari {$input['old_hours_per_day']} jam menjadi {$input['new_hours_per_day']} jam\n";
    }
    if (!empty($input['new_target_deadline'])) {
      $changesText .= "- Target deadline diubah menjadi {$input['new_target_deadline']}\n";
    }
    if (!empty($input['catatan_perubahan'])) {
      $changesText .= "- Request khusus dari pengguna: {$input['catatan_perubahan']}\n";
    }

    $existingTitles = collect($input['current_phases'])
      ->flatMap(fn($p) => collect($p['topics'])->pluck('topic_title'))
      ->implode(', ');

    $prompt = "Kamu adalah mentor belajar mandiri berpengalaman.
Tugas: Evaluasi dan sesuaikan roadmap belajar berikut berdasarkan perubahan yang diminta.
Response HANYA dalam format JSON valid.

INFORMASI ROADMAP SAAT INI:
- Skill: {$input['skill_name']}
- Level: {$input['level']}
- Jam belajar: {$input['old_hours_per_day']} jam/hari
- Deadline: {$input['old_target_deadline']}
- Struktur:
{$currentPhasesText}

JUDUL TOPIK YANG SUDAH ADA (PROTECTED):
[ {$existingTitles} ]

ATURAN REUSE JUDUL (SANGAT KRUSIAL):
1. Jika suatu topik sudah ada di daftar di atas, gunakan JUDUL YANG SAMA PERSIS.
2. JANGAN mengubah judul topik lama kecuali diminta spesifik. Perubahan judul akan memicu regenerasi deskripsi yang memakan banyak token.
3. UNTUK PENGHEMATAN TOKEN: Bagi topik yang judulnya SAMA dengan daftar di atas, KOSONGKAN field 'description' dan 'resources'. Kami akan mengambil data lama dari database.

PERUBAHAN YANG DIMINTA:
{$changesText}

HANYA untuk TOPIK BARU (yang judulnya tidak ada di daftar Protected), WAJIB isi 'description' (materi pembelajaran MAKSIMAL 2-3 paragraf padat Markdown).

Format JSON:
{
  \"ringkasan\": \"string penjelasan perubahan\",
  \"phases\": [
    {
      \"phase_title\": \"string\",
      \"phase_description\": \"string\",
      \"order\": integer,
      \"durasi_estimasi_hari\": integer,
      \"topics\": [
        {
          \"topic_title\": \"string\",
          \"description\": \"(Kosongkan jika judul ada di daftar Protected. Isi maksimal 2-3 paragraf jika TOPIK BARU)\",
          \"order\": integer,
          \"is_completed\": boolean,
          \"resources\": [] // Kosongkan jika judul ada di daftar Protected.
        }
      ]
    }
  ]
}";

    $raw = $this->callGemini($prompt);
    return $this->parseJson($raw);
  }

  /**
   * Orchestrate roadmap evaluation and DB update.
   */
  public function handleRoadmapEvaluation(Roadmap $roadmap, array $validated): Roadmap
  {
    // Prepare data for AI
    $totalTopics = 0;
    $completedTopics = 0;
    $currentPhases = [];

    foreach ($roadmap->roadmapPhases as $phase) {
      $topics = [];
      foreach ($phase->roadmapTopics as $topic) {
        $totalTopics++;
        if ($topic->is_completed) $completedTopics++;

        $topics[] = [
          'topic_title'  => $topic->topic_title,
          'is_completed' => (bool) $topic->is_completed,
        ];
      }

      $currentPhases[] = [
        'phase_title' => $phase->phase_title,
        'order'       => $phase->order,
        'topics'      => $topics,
      ];
    }

    $progressPersen = $totalTopics > 0 ? round(($completedTopics / $totalTopics) * 100, 1) : 0;

    $data = [
      'skill_name'          => $roadmap->skill->name,
      'level'               => $roadmap->level,
      'tujuan_akhir'        => $roadmap->tujuan_akhir,
      'old_hours_per_day'   => $roadmap->hours_per_day,
      'old_target_deadline' => $roadmap->target_deadline,
      'total_topics'        => $totalTopics,
      'completed_topics'    => $completedTopics,
      'progress_persen'     => $progressPersen,
      'current_phases'      => $currentPhases,
      'new_hours_per_day'   => $validated['hours_per_day'] ?? null,
      'new_target_deadline' => $validated['target_deadline'] ?? null,
      'catatan_perubahan'   => $validated['catatan_perubahan'] ?? null,
    ];

    $aiResult = $this->evaluateRoadmap($data);

    $oldTopicsData = $roadmap->roadmapPhases
      ->flatMap(fn($phase) => $phase->roadmapTopics)
      ->mapWithKeys(fn($topic) => [
        trim($topic->topic_title) => [
          'description'  => $topic->description,
          'is_completed' => (bool) $topic->is_completed,
          'completed_at' => $topic->completed_at,
          'resources'    => $topic->topicResources->map(fn($r) => [
            'title' => $r->title,
            'url'   => $r->url,
            'type'  => $r->type,
          ])->toArray()
        ]
      ])
      ->toArray();

    return DB::transaction(function () use ($oldTopicsData, $roadmap, $validated, $aiResult) {
      $updates = ['ai_raw_response' => json_encode($aiResult)];
      if (!empty($validated['hours_per_day'])) $updates['hours_per_day'] = $validated['hours_per_day'];
      if (!empty($validated['target_deadline'])) $updates['target_deadline'] = $validated['target_deadline'];
      if (!empty($aiResult['ringkasan'])) $updates['description'] = $aiResult['ringkasan'];

      $roadmap->update($updates);
      $roadmap->roadmapPhases()->delete();

      foreach ($aiResult['phases'] as $phaseData) {
        $phase = RoadmapPhase::create([
          'roadmap_id'           => $roadmap->id,
          'phase_title'          => $phaseData['phase_title'],
          'phase_description'    => $phaseData['phase_description'] ?? $phaseData['phase_title'],
          'order'                => $phaseData['order'],
          'durasi_estimasi_hari' => $phaseData['durasi_estimasi_hari'],
        ]);

        foreach ($phaseData['topics'] as $topicData) {
          // Normalize title for safer lookup
          $lookupTitle = trim($topicData['topic_title']);
          $oldTopic = $oldTopicsData[$lookupTitle] ?? null;

          $isCompleted = $topicData['is_completed'] ?? ($oldTopic['is_completed'] ?? false);

          $topic = RoadmapTopic::create([
            'roadmap_phase_id' => $phase->id,
            'topic_title'      => $topicData['topic_title'],
            'description'      => (!empty($topicData['description']) && !in_array(strtolower(trim($topicData['description'])), ['retain', 'kosong', '']))
              ? $topicData['description']
              : ($oldTopic['description'] ?? ''),
            'order'            => $topicData['order'],
            'is_completed'     => $isCompleted,
            'completed_at'     => $oldTopic['completed_at'] ?? ($isCompleted ? now() : null),
          ]);

          $resources = (!empty($topicData['resources']))
            ? $topicData['resources']
            : ($oldTopic['resources'] ?? []);

          foreach ($resources as $resourceData) {
            if (empty($resourceData['title']) || empty($resourceData['url'])) continue;

            TopicResource::create([
              'roadmap_topic_id' => $topic->id,
              'title'            => $resourceData['title'],
              'url'              => $resourceData['url'],
              'type'             => in_array($resourceData['type'] ?? 'article', ['video', 'article', 'course', 'documentation'])
                ? ($resourceData['type'] ?? 'article')
                : 'article',
            ]);
          }
        }
      }

      // Check status completion
      $finalCounts = RoadmapTopic::whereHas('roadmapPhase', fn($q) => $q->where('roadmap_id', $roadmap->id))
        ->selectRaw('count(*) as total, sum(is_completed) as completed')
        ->first();

      $roadmap->update([
        'status' => ($finalCounts->total > 0 && $finalCounts->total == $finalCounts->completed) ? 'completed' : 'active'
      ]);

      return $roadmap->load(['skill', 'roadmapPhases.roadmapTopics.topicResources']);
    });
  }

  public function generateQuiz(array $data): array
  {
    $topicsText = implode(', ', $data['topic_titles']);

    $prompt = "Kamu adalah instruktur yang membuat soal kuis.
Buat 5 soal pilihan ganda untuk menguji pemahaman materi berikut.
Response HANYA dalam format JSON valid, tanpa teks apapun di luar JSON.

Fase yang sudah dipelajari: {$data['phase_title']}
Topik-topik yang sudah diselesaikan: {$topicsText}
Skill: {$data['skill_name']}
Level pengguna: {$data['level']}

ATURAN:
1. Soal harus berdasarkan topik yang sudah dipelajari
2. Tingkat kesulitan: menengah (tidak terlalu mudah, tidak terlalu sulit)
3. Setiap soal punya 4 pilihan jawaban (a, b, c, d)
4. Sertakan pembahasan singkat mengapa jawaban itu benar

Format JSON:
{
  \"phase_title\": \"string\",
  \"questions\": [
    {
      \"order\": 1,
      \"question\": \"string\",
      \"option_a\": \"string\",
      \"option_b\": \"string\",
      \"option_c\": \"string\",
      \"option_d\": \"string\",
      \"true_answer\": \"a/b/c/d\",
      \"overview\": \"string\"
    }
  ]
}";

    $raw = $this->callGemini($prompt);
    return $this->parseJson($raw);
  }

  /**
   * Orchestrate quiz generation and DB saving.
   */
  public function handleQuizGeneration(RoadmapPhase $phase): Quizz
  {
    $data = [
      'phase_title'  => $phase->phase_title,
      'skill_name'   => $phase->roadmap->skill->name,
      'level'        => $phase->roadmap->level,
      'topic_titles' => $phase->roadmapTopics->pluck('topic_title')->toArray(),
    ];

    $aiResult = $this->generateQuiz($data);

    return DB::transaction(function () use ($aiResult, $phase) {
      $quiz = Quizz::create([
        'user_id'          => Auth::id(),
        'roadmap_phase_id' => $phase->id,
        'status'           => 'pending',
        'score'            => 0,
        'ai_raw_response'  => json_encode($aiResult),
      ]);

      foreach ($aiResult['questions'] as $q) {
        QuizzQuestion::create([
          'quiz_id'     => $quiz->id,
          'question'    => $q['question'],
          'option_a'    => $q['option_a'],
          'option_b'    => $q['option_b'],
          'option_c'    => $q['option_c'],
          'option_d'    => $q['option_d'],
          'true_answer' => $q['true_answer'],
          'overview'    => $q['overview'],
          'order'       => $q['order'],
        ]);
      }

      return $quiz;
    });
  }

  /**
   * Orchestrate quiz submission and scoring.
   */
  public function handleQuizSubmission(Quizz $quiz, array $answers): array
  {
    $correctCount = 0;
    $results = [];

    DB::transaction(function () use ($answers, $quiz, &$correctCount, &$results) {
      foreach ($answers as $ans) {
        $question = $quiz->questions->find($ans['question_id']);
        $isCorrect = $ans['answer'] === $question->true_answer;

        if ($isCorrect) $correctCount++;

        QuizzAnswer::create([
          'quizz_id'          => $quiz->id,
          'quizz_question_id' => $question->id,
          'user_answer'       => $ans['answer'],
          'is_correct'        => $isCorrect,
        ]);

        $results[] = [
          'question_id' => $question->id,
          'is_correct'  => $isCorrect,
          'correct'     => $question->true_answer,
          'overview'    => $question->overview,
        ];
      }

      $quiz->update([
        'status' => 'completed',
        'score'  => ($correctCount / $quiz->questions->count()) * 100
      ]);
    });

    return [
      'score'   => $quiz->score,
      'results' => $results
    ];
  }
}
