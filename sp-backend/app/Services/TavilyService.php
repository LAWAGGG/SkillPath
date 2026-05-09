<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Class TavilyService
 *
 * Mencari referensi belajar eksternal (artikel, video, dokumentasi)
 * menggunakan Tavily AI Search API.
 *
 * Free tier: 1.000 request/bulan
 * Docs   : https://docs.tavily.com
 *
 * @package App\Services
 */
class TavilyService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.tavily.com';

    /**
     * Durasi cache per query (dalam detik).
     * Default 7 hari — hasil pencarian topik belajar jarang berubah.
     */
    private int $cacheTtl;

    public function __construct()
    {
        $this->apiKey   = config('services.tavily.key');
        $this->cacheTtl = config('services.tavily.cache_ttl', 60 * 60 * 24 * 7);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Cari resource belajar untuk satu topik.
     *
     * Mengembalikan array resource siap simpan ke TopicResource:
     * [
     *   ['title' => string, 'url' => string, 'type' => 'article'|'video'|'documentation'],
     *   ...
     * ]
     *
     * @param  string $topicTitle  Judul topik (misal "Introduction to React Hooks")
     * @param  string $skillName   Nama skill (misal "React")
     * @param  int    $maxResults  Jumlah resource yang dikembalikan (default 2)
     */
    public function searchResourcesForTopic(
        string $topicTitle,
        string $skillName,
        int $maxResults = 2
    ): array {
        $query     = $this->buildQuery($topicTitle, $skillName);
        $cacheKey  = 'tavily:' . md5($query . ':' . $maxResults);

        // Gunakan cache agar tidak boros kuota API
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($query, $maxResults, $topicTitle, $skillName) {
            return $this->fetchAndParse($query, $maxResults, $topicTitle, $skillName);
        });
    }

    /**
     * Enrich semua topik dalam struktur roadmap AI dengan resource nyata.
     *
     * Menerima array $phases dari hasil parseJson(callGemini(...)) dan
     * mengganti/menambah resources di setiap topik dengan hasil Tavily.
     *
     * Gunakan di handleRoadmapGeneration() setelah generateRoadmap().
     *
     * @param  array  $phases     Array phases dari AI response
     * @param  string $skillName  Nama skill roadmap
     * @return array              $phases yang sudah di-enrich
     */
    public function enrichRoadmapResources(array $phases, string $skillName): array
    {
        foreach ($phases as &$phase) {
            if (empty($phase['topics'])) {
                continue;
            }

            foreach ($phase['topics'] as &$topic) {
                // Skip jika topik sudah punya resource lengkap (1 text + 1 video)
                if ($this->hasRequiredResources($topic['resources'] ?? [])) {
                    continue;
                }

                $resources = $this->searchResourcesForTopic(
                    topicTitle: $topic['topic_title'],
                    skillName: $skillName,
                    maxResults: 2
                );

                if (!empty($resources)) {
                    $topic['resources'] = $resources;
                }
            }
            unset($topic); // unset reference
        }
        unset($phase); // unset reference

        return $phases;
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * Bangun query pencarian yang kontekstual.
     * Contoh: "React Hooks tutorial learn beginner"
     */
    private function buildQuery(string $topicTitle, string $skillName): string
    {
        // Hindari duplikasi jika skillName sudah ada di topicTitle
        $needsSkill = !str_contains(strtolower($topicTitle), strtolower($skillName));
        $prefix     = $needsSkill ? "{$skillName} " : '';

        return "{$prefix}{$topicTitle} tutorial learn beginner";
    }

    /**
     * Panggil Tavily API dan parse hasilnya menjadi format resource SkillPath.
     */
    private function fetchAndParse(
        string $query,
        int $maxResults,
        string $topicTitle,
        string $skillName
    ): array {
        if (empty($this->apiKey)) {
            Log::warning('TavilyService: API key tidak dikonfigurasi, skip enrichment.');
            return [];
        }

        try {
            $response = Http::connectTimeout(10)
                ->timeout(30)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/search", [
                    'api_key'                => $this->apiKey,
                    'query'                  => $query,
                    'search_depth'           => 'basic',       // 'basic' hemat kuota, 'advanced' lebih akurat
                    'include_answer'         => false,
                    'include_raw_content'    => false,
                    'include_images'         => false,
                    'max_results'            => 10,            // Ambil lebih banyak (10) untuk memastikan ada variasi tipe
                    // Fokus ke domain edukatif & teknikal
                    'include_domains'        => [
                        'developer.mozilla.org',
                        'docs.python.org',
                        'reactjs.org',
                        'laravel.com',
                        'vuejs.org',
                        'nextjs.org',
                        'typescript-lang.org',
                        'javascript.info',
                        'freecodecamp.org',
                        'dev.to',
                        'medium.com',
                        'youtube.com',
                        'css-tricks.com',
                        'web.dev',
                        'digitalocean.com',
                        'baeldung.com',
                        'geeksforgeeks.org',
                        'w3schools.com',
                    ],
                ]);

            if ($response->failed()) {
                Log::warning('TavilyService: Request gagal', [
                    'status' => $response->status(),
                    'query'  => $query,
                ]);
                return [];
            }

            $data    = $response->json();
            $results = $data['results'] ?? [];

            return $this->parseResults($results, $maxResults);
        } catch (\Throwable $e) {
            // Tavily gagal tidak boleh menghentikan proses pembuatan roadmap
            Log::error('TavilyService: Exception saat search', [
                'message' => $e->getMessage(),
                'query'   => $query,
            ]);
            return [];
        }
    }

    /**
     * Ubah hasil mentah Tavily menjadi format TopicResource SkillPath.
     * Dipastikan mengembalikan 1 Doc/Article dan 1 Video jika tersedia.
     */
    private function parseResults(array $results, int $max): array
    {
        $textResult  = null;
        $videoResult = null;

        foreach ($results as $result) {
            $url   = $result['url']   ?? '';
            $title = $result['title'] ?? '';

            if (empty($url) || empty($title)) {
                continue;
            }

            $type = $this->detectType($url);
            $resource = [
                'title' => $this->cleanTitle($title),
                'url'   => $url,
                'type'  => $type,
            ];

            if ($type === 'video') {
                if (!$videoResult) {
                    $videoResult = $resource;
                }
            } else {
                // documentation atau article
                if (!$textResult) {
                    $textResult = $resource;
                }
            }

            // Jika sudah dapat keduanya, berhenti
            if ($textResult && $videoResult) {
                break;
            }
        }

        $final = [];
        // Urutan: Documentation/Article baru kemudian Video
        if ($textResult) {
            $final[] = $textResult;
        }
        if ($videoResult) {
            $final[] = $videoResult;
        }

        return $final;
    }

    /**
     * Deteksi tipe resource berdasarkan URL.
     */
    private function detectType(string $url): string
    {
        $url = strtolower($url);

        if (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) {
            return 'video';
        }

        $docDomains = [
            'developer.mozilla.org',
            'docs.python.org',
            'reactjs.org/docs',
            'laravel.com/docs',
            'vuejs.org/guide',
            'nextjs.org/docs',
            'typescript-lang.org',
            'w3schools.com',
            'docs.',
            '/docs/',
            '/documentation/',
            '/reference/',
            '/api/',
        ];

        foreach ($docDomains as $domain) {
            if (str_contains($url, $domain)) {
                return 'documentation';
            }
        }

        return 'article';
    }

    /**
     * Bersihkan title dari karakter tidak perlu.
     */
    private function cleanTitle(string $title): string
    {
        // Hapus suffix seperti "| Medium", "- DEV Community", "- YouTube"
        $title = preg_replace('/\s*[\|\-–]\s*(Medium|DEV Community|YouTube|GeeksforGeeks|freeCodeCamp|Towards Data Science|W3Schools).*$/i', '', $title);

        return trim($title);
    }

    /**
     * Cek apakah resource array sudah berisi resource yang dibutuhkan (1 text, 1 video).
     */
    private function hasRequiredResources(array $resources): bool
    {
        if (empty($resources)) {
            return false;
        }

        $hasText  = false;
        $hasVideo = false;

        foreach ($resources as $resource) {
            $type = $resource['type'] ?? '';
            if ($type === 'video') {
                $hasVideo = true;
            } elseif ($type === 'article' || $type === 'documentation') {
                $hasText = true;
            }
        }

        return $hasText && $hasVideo;
    }
}
