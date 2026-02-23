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
- ARTICLE: JANGAN buat link direct. Gunakan format search Google dengan filter 'site:' sesuai topik. Gunakan KEYWORD DALAM BAHASA INGGRIS pada query pencarian agar hasil lebih akurat:
  * HTML, CSS, JS, PHP Dasar, SQL, Git Dasar: gunakan 'site:w3schools.com'
  * Laravel, Framework PHP: gunakan 'site:petanikode.com' atau 'site:malasngoding.com'
  * Topik Mahir/Inggris: gunakan 'site:freecodecamp.org' atau 'site:dev.to'
  * Format: https://www.google.com/search?q=[English+Keyword]+site:[domain]
- JANGAN PERNAH gunakan link placeholder atau dummy.
- Pastikan setiap fase memiliki MINIMAL 2 TOPIK pembelajaran.

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
   - ARTICLE: Gunakan format search Google spesifik sesuai topik. Gunakan KEYWORD DALAM BAHASA INGGRIS pada query pencarian:
     * Dasar (HTML/CSS/JS/PHP/SQL/Git): site:w3schools.com
     * Laravel/Framework: site:petanikode.com atau site:malasngoding.com
     * Lanjutan/English: site:freecodecamp.org atau site:dev.to
     * URL: https://www.google.com/search?q=[English+Keyword]+site:[domain]
   - DILARANG KERAS menggunakan link dummy/placeholder. Gunakan pola pencarian di atas jika ragu.
   - Setiap fase baru WAJIB memiliki MINIMAL 2 TOPIK.

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

    $completedTitles = $roadmap->roadmapPhases
      ->flatMap(fn($phase) => $phase->roadmapTopics)
      ->where('is_completed', true)
      ->pluck('topic_title')
      ->toArray();

    $completedTopicsData = $roadmap->roadmapPhases
      ->flatMap(fn($phase) => $phase->roadmapTopics)
      ->where('is_completed', true)
      ->mapWithKeys(fn($topic) => [
        $topic->topic_title => $topic->topicResources->map(fn($r) => [
          'title' => $r->title,
          'url'   => $r->url,
          'type'  => $r->type,
        ])->toArray()
      ])
      ->toArray();

    return DB::transaction(function () use ($completedTitles, $completedTopicsData, $roadmap, $validated, $aiResult) {
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
          $isCompleted = in_array($topicData['topic_title'], $completedTitles);

          $topic = RoadmapTopic::create([
            'roadmap_phase_id' => $phase->id,
            'topic_title'      => $topicData['topic_title'],
            'description'      => $topicData['description'] ?? '',
            'order'            => $topicData['order'],
            'is_completed'     => $isCompleted,
            'completed_at'     => $isCompleted ? now() : null,
          ]);

          $resources = ($isCompleted && isset($completedTopicsData[$topicData['topic_title']]))
            ? $completedTopicsData[$topicData['topic_title']]
            : ($topicData['resources'] ?? []);

          foreach ($resources as $resourceData) {
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
