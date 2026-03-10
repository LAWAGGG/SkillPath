<p align="center">
  <h1 align="center">🎯 SkillPath</h1>
  <p align="center">
    <strong>AI-Powered Personalized Learning Roadmap Platform</strong>
  </p>
  <p align="center">
    Platform pembelajaran cerdas yang menggunakan Google Gemini AI untuk menghasilkan roadmap belajar personal, quiz interaktif, dan feedback berbasis AI — tersedia di Web & Android.
  </p>
</p>

---

## 📖 Deskripsi

**SkillPath** adalah platform full-stack berbasis web dan mobile yang membantu pengguna merencanakan dan melacak perjalanan belajar mereka secara personal. Dengan memanfaatkan kecerdasan buatan **Google Gemini AI**, SkillPath mampu:

- **Generate roadmap belajar** yang terstruktur berdasarkan skill yang dipilih user, lengkap dengan fase, topik, dan sumber belajar.
- **Generate quiz** secara otomatis per fase untuk menguji pemahaman user.
- **Memberikan AI feedback** menyeluruh tentang progress belajar user pada sebuah roadmap.
- **Evaluasi & restrukturisasi roadmap** menggunakan AI berdasarkan input evaluasi dari user.

---

## ✨ Fitur Utama

### 👤 Fitur User

| Fitur                     | Deskripsi                                                                      |
| ------------------------- | ------------------------------------------------------------------------------ |
| **Registrasi & Login**    | Autentikasi user menggunakan Laravel Sanctum (token-based)                     |
| **Dashboard**             | Ringkasan overview progress belajar user                                       |
| **Generate Roadmap AI**   | Generate roadmap belajar berdasarkan skill pilihan, level, dan target deadline |
| **Detail Roadmap**        | Tampilan detail roadmap dengan fase, topik, resource, dan progress tracking    |
| **Toggle Progress Topik** | Tandai topik sebagai selesai/belum selesai                                     |
| **Quiz per Fase**         | Generate quiz AI setelah menyelesaikan semua topik dalam satu fase             |
| **Hasil Quiz**            | Lihat skor dan review jawaban benar/salah beserta penjelasan                   |
| **AI Feedback**           | Minta feedback AI menyeluruh tentang progress di sebuah roadmap                |
| **Cari Skill**            | Cari dan jelajahi skill yang tersedia berdasarkan kategori                     |
| **Rekomendasi Skill**     | Dapatkan rekomendasi skill dari sistem                                         |
| **Profil**                | Lihat dan kelola profil user                                                   |

### 🛡️ Fitur Admin

| Fitur                     | Deskripsi                                                |
| ------------------------- | -------------------------------------------------------- |
| **Admin Dashboard**       | Overview statistik platform (jumlah user, roadmap, dll.) |
| **Kelola Skill**          | CRUD (Create, Read, Update, Delete) skill                |
| **Kelola Kategori Skill** | CRUD kategori skill                                      |
| **Kelola User**           | Lihat daftar user dan hapus user                         |
| **Kelola Roadmap**        | Lihat semua roadmap yang dibuat oleh user                |

### 🤖 Integrasi AI (Google Gemini)

| Fitur                   | Deskripsi                                                                 |
| ----------------------- | ------------------------------------------------------------------------- |
| **Roadmap Generation**  | Generate roadmap lengkap (fase → topik → resource) berdasarkan input user |
| **Roadmap Evaluation**  | Evaluasi dan restrukturisasi roadmap berdasarkan feedback user            |
| **Quiz Generation**     | Generate pertanyaan quiz multiple-choice per fase                         |
| **Quiz Scoring**        | Evaluasi jawaban quiz user dan berikan skor                               |
| **Feedback Generation** | Generate feedback AI komprehensif tentang progress user                   |

---

## 🛠️ Tech Stack

### Backend (`sp-backend/`)

| Teknologi            | Versi            | Keterangan                         |
| -------------------- | ---------------- | ---------------------------------- |
| **PHP**              | ^8.2             | Bahasa pemrograman server-side     |
| **Laravel**          | ^12.0            | Framework PHP utama                |
| **Laravel Sanctum**  | ^4.0             | Autentikasi API berbasis token     |
| **MySQL**            | 8.0              | Database utama (production/Docker) |
| **SQLite**           | -                | Database development (local)       |
| **Google Gemini AI** | gemini-2.5-flash | AI model untuk generate konten     |
| **Nginx**            | Alpine           | Web server (Docker)                |
| **Redis**            | Alpine           | Cache & queue driver (Docker)      |
| **Docker**           | -                | Containerization                   |
| **PHPUnit**          | ^11.5            | Testing framework                  |

**Arsitektur Backend:**

- **MVC + Service Layer** — Controller memanggil service (`GeminiService`) untuk logika bisnis AI
- **11 Model** — User, Skill, SkillCategory, Roadmap, RoadmapPhase, RoadmapTopic, TopicResource, AiFeedback, Quizz, QuizzQuestion, QuizzAnswer
- **Admin Middleware** — Role-based access control untuk memisahkan akses admin dan user
- **RESTful API** — Semua endpoint mengikuti pola REST
- **Database Seeder** — 9 seeder untuk data awal (skill, kategori, roadmap contoh, dll.)

### Frontend (`sp-frontend/`)

| Teknologi            | Versi   | Keterangan                        |
| -------------------- | ------- | --------------------------------- |
| **React**            | ^19.2.0 | Library UI utama                  |
| **React Router DOM** | ^7.13.0 | Client-side routing               |
| **Vite**             | ^7.3.1  | Build tool & dev server           |
| **Tailwind CSS**     | ^4.2.0  | Utility-first CSS framework       |
| **Axios**            | ^1.13.5 | HTTP client untuk API calls       |
| **Capacitor**        | ^8.1.0  | Bridge untuk build Android native |
| **ESLint**           | ^9.39.1 | Code linting                      |

**Arsitektur Frontend:**

- **SPA (Single Page Application)** dengan React Router
- **Role-based Routing** — Redirect otomatis berdasarkan role (user/admin)
- **Axios Interceptor** — Auto-attach token & auto-redirect saat 401 Unauthorized
- **Capacitor** — Build ke APK Android dari codebase web yang sama
- **12+ Halaman User** — Dashboard, Search, Roadmaps, RoadmapDetail, GeneratePage, FeedbackPage, Quiz, QuizResult, Profile, Login, Register
- **5+ Halaman Admin** — AdminDashboard, SkillManage, UserManage, RoadmapManage, AdminProfile

---

## 📁 Struktur Project

```
skillPath/
├── sp-backend/                 # Laravel 12 Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # 11 Controller (Auth, User, Skill, Roadmap, Quiz, AiFeedback, dll.)
│   │   │   └── Middleware/     # AdminMiddleware untuk role-based access
│   │   ├── Models/             # 11 Eloquent Models
│   │   ├── Providers/          # Service Providers
│   │   └── Services/           # GeminiService (integrasi AI)
│   ├── database/
│   │   ├── factories/          # 8 Model Factories
│   │   ├── migrations/         # 14 Migration Files
│   │   └── seeders/            # 9 Database Seeders
│   ├── routes/
│   │   └── api.php             # Definisi semua API endpoints
│   ├── docker/                 # Konfigurasi Nginx
│   ├── Dockerfile              # PHP 8.2-FPM image
│   ├── docker-compose.yml      # Multi-container setup
│   └── .env.example            # Template environment variables
│
└── sp-frontend/                # React 19 Frontend
    ├── src/
    │   ├── api/                # Axios instance & interceptors
    │   ├── components/         # Komponen reusable (BottomBar, AdminBottomBar, dll.)
    │   ├── pages/              # Halaman-halaman user
    │   │   └── admin/          # Halaman-halaman admin
    │   ├── utils/              # Utility functions (token management, BASE_URL)
    │   ├── assets/             # Static assets
    │   ├── App.jsx             # Root component & routing
    │   └── main.jsx            # Entry point
    ├── android/                # Capacitor Android project
    ├── capacitor.config.json   # Konfigurasi Capacitor
    └── package.json            # Dependencies & scripts
```

---

## 🗄️ Database Schema

```
User ──────────┐
               ├──< Roadmap ──< RoadmapPhase ──< RoadmapTopic
               │       │                              │
               │       ├──< AiFeedback                ├──< TopicResource
               │       │
               ├──< Quizz ──< QuizzQuestion
               │                    │
               └──< QuizzAnswer ────┘

SkillCategory ──< Skill ──< Roadmap
```

**Relasi Utama:**

- `User` memiliki banyak `Roadmap`, `Quizz`, dan `AiFeedback`
- `Roadmap` terdiri dari beberapa `RoadmapPhase`
- `RoadmapPhase` terdiri dari beberapa `RoadmapTopic`
- `RoadmapTopic` memiliki beberapa `TopicResource` (link belajar)
- `Skill` termasuk dalam satu `SkillCategory`
- `Quizz` memiliki banyak `QuizzQuestion` dan `QuizzAnswer`

---

## 🚀 Cara Menjalankan

### Prasyarat

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL 8.0 (atau SQLite untuk development)
- Google Gemini API Key

### Backend Setup

```bash
# Masuk ke folder backend
cd sp-backend

# Install dependencies PHP
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi .env (database & Gemini API key)
# DB_CONNECTION=mysql
# DB_DATABASE=laravel_skillpath
# GEMINI_API_KEY=your_gemini_api_key
# GEMINI_MODEL=gemini-2.5-flash

# Jalankan migrasi database
php artisan migrate

# (Opsional) Seed data awal
php artisan db:seed

# Jalankan server
php artisan serve
```

### Frontend Setup

```bash
# Masuk ke folder frontend
cd sp-frontend

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

### Docker Setup (Opsional)

```bash
# Dari folder sp-backend
cp .env.docker.example .env.docker

# Jalankan semua container
docker-compose up -d

# Backend tersedia di http://localhost:8080
```

Docker Compose menjalankan 4 service:

- **app** — PHP 8.2-FPM (Laravel)
- **webserver** — Nginx (port 8080)
- **db** — MySQL 8.0 (port 3306)
- **redis** — Redis Alpine

### Build Android (Capacitor)

```bash
cd sp-frontend

# Build web assets
npm run build

# Sync ke project Android
npx cap sync android

# Buka di Android Studio
npx cap open android
```

---

## 🔌 API Endpoints

### Public

| Method | Endpoint                     | Keterangan                  |
| ------ | ---------------------------- | --------------------------- |
| `GET`  | `/api/skills`                | Daftar semua skill          |
| `GET`  | `/api/skill-categories`      | Daftar semua kategori skill |
| `GET`  | `/api/skills/recommendation` | Rekomendasi skill           |

### Auth

| Method | Endpoint             | Keterangan             |
| ------ | -------------------- | ---------------------- |
| `POST` | `/api/auth/register` | Registrasi user baru   |
| `POST` | `/api/auth/login`    | Login user             |
| `POST` | `/api/auth/logout`   | Logout (auth required) |
| `GET`  | `/api/auth/me`       | Data user yang login   |

### User (Auth Required)

| Method   | Endpoint                        | Keterangan                                |
| -------- | ------------------------------- | ----------------------------------------- |
| `GET`    | `/api/user/dashboard`           | Data dashboard user                       |
| `POST`   | `/api/roadmaps/generate`        | Generate roadmap baru via AI              |
| `GET`    | `/api/roadmaps`                 | Daftar roadmap user                       |
| `GET`    | `/api/roadmaps/{id}`            | Detail roadmap                            |
| `DELETE` | `/api/roadmaps/{id}`            | Hapus roadmap                             |
| `PUT`    | `/api/roadmaps/{id}/evaluate`   | Evaluasi & restrukturisasi roadmap via AI |
| `PATCH`  | `/api/topics/{id}/toggle`       | Toggle status topik (selesai/belum)       |
| `POST`   | `/api/ai/feedback/{roadmapId}`  | Generate AI feedback                      |
| `GET`    | `/api/ai/feedbacks/{roadmapId}` | Lihat feedback roadmap                    |
| `POST`   | `/api/phases/{id}/quiz`         | Generate quiz untuk fase                  |
| `GET`    | `/api/quizzes/{id}`             | Lihat quiz                                |
| `POST`   | `/api/quizzes/{id}/submit`      | Submit jawaban quiz                       |
| `GET`    | `/api/quizzes/{id}/result`      | Lihat hasil quiz                          |

### Admin (Auth + Admin Role Required)

| Method   | Endpoint                           | Keterangan            |
| -------- | ---------------------------------- | --------------------- |
| `GET`    | `/api/admin/dashboard`             | Data dashboard admin  |
| `GET`    | `/api/admin/skill-categories`      | Daftar kategori skill |
| `POST`   | `/api/admin/skill-categories`      | Tambah kategori skill |
| `PUT`    | `/api/admin/skill-categories/{id}` | Update kategori skill |
| `DELETE` | `/api/admin/skill-categories/{id}` | Hapus kategori skill  |
| `GET`    | `/api/admin/skills`                | Daftar skill (admin)  |
| `POST`   | `/api/admin/skills`                | Tambah skill          |
| `PUT`    | `/api/admin/skills/{id}`           | Update skill          |
| `DELETE` | `/api/admin/skills/{id}`           | Hapus skill           |
| `GET`    | `/api/admin/users`                 | Daftar semua user     |
| `DELETE` | `/api/admin/users/{id}`            | Hapus user            |
| `GET`    | `/api/admin/roadmaps`              | Daftar semua roadmap  |

---

## 🔐 Environment Variables

| Variable         | Keterangan                                            |
| ---------------- | ----------------------------------------------------- |
| `DB_CONNECTION`  | Driver database (`mysql` / `sqlite`)                  |
| `DB_HOST`        | Host database                                         |
| `DB_PORT`        | Port database                                         |
| `DB_DATABASE`    | Nama database                                         |
| `DB_USERNAME`    | Username database                                     |
| `DB_PASSWORD`    | Password database                                     |
| `GEMINI_API_KEY` | API Key Google Gemini AI                              |
| `GEMINI_MODEL`   | Model Gemini yang digunakan (e.g. `gemini-2.5-flash`) |

---

## 👥 Roles

| Role    | Keterangan                                                                 |
| ------- | -------------------------------------------------------------------------- |
| `user`  | Pengguna biasa — bisa generate roadmap, quiz, dan minta AI feedback        |
| `admin` | Administrator — bisa kelola skill, kategori, user, dan lihat semua roadmap |

---

## 📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran dan latihan.
