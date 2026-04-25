# GEMINI.md - SkillPath Project Context

## Project Overview
**SkillPath** is an AI-powered personalized learning roadmap platform that helps users plan and track their learning journeys. It leverages **Google Gemini AI** to generate structured roadmaps, interactive quizzes, and personalized feedback.

- **Frontend:** React 19 (Vite, Tailwind CSS 4, Axios, Capacitor for Android)
- **Backend:** Laravel 12 (PHP 8.2, Sanctum for Auth, MySQL/SQLite)
- **AI Integration:** Google Gemini AI (gemini-2.5-flash) via a dedicated `GeminiService`.
- **Architecture:** MVC + Service Layer in Backend; SPA in Frontend.

## Core Features
### User Features
- **Roadmap Generation:** Create learning paths based on skill, level, and deadline.
- **Progress Tracking:** Toggle topics as completed and track overall progress.
- **AI Feedback:** Receive comprehensive feedback on learning progress.
- **Interactive Quizzes:** AI-generated quizzes per roadmap phase to test understanding.
- **Android Support:** Built with Capacitor for a native mobile experience.

### Admin Features
- **Dashboard:** Platform statistics and overview.
- **Management:** CRUD for skills, skill categories, and user management.
- **Roadmap Oversight:** View and manage all user-generated roadmaps.

## Tech Stack & Architecture
### Backend (`sp-backend/`)
- **Framework:** Laravel 12.0
- **Authentication:** Laravel Sanctum (token-based).
- **Service Layer:** `App\Services\GeminiService` handles all AI prompts, JSON parsing, and repair logic.
- **Models:** User, Skill, SkillCategory, Roadmap, RoadmapPhase, RoadmapTopic, TopicResource, AiFeedback, Quizz, QuizzQuestion, QuizzAnswer.
- **Database:** MySQL (Production/Docker), SQLite (Local Dev).

### Frontend (`sp-frontend/`)
- **Framework:** React 19.2
- **Build Tool:** Vite 7.3
- **Styling:** Tailwind CSS 4.2 (using `@tailwindcss/vite`).
- **State/Routing:** React Router DOM 7.13.
- **API Client:** Axios with interceptors for auth token injection and 401 handling.
- **Mobile:** Capacitor 8.1 for Android.

## Building and Running
### Prerequisites
- PHP >= 8.2 & Composer
- Node.js >= 18 & npm
- Google Gemini API Key

### Backend Setup
```bash
cd sp-backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB_CONNECTION and GEMINI_API_KEY in .env
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd sp-frontend
npm install
npm run dev
```

### Docker Setup
```bash
cd sp-backend
docker-compose up -d
```

## Development Conventions
- **AI Logic:** Always use `GeminiService` for AI-related operations. It includes robust JSON repair logic for truncated responses.
- **API Routes:** Defined in `sp-backend/routes/api.php`. Use the `auth:sanctum` middleware for protected routes and `AdminMiddleware` for admin-only endpoints.
- **Frontend Components:** Reusable components are located in `sp-frontend/src/components/`.
- **API Calls:** Use the pre-configured Axios instance in `sp-frontend/src/api/api.js`.
- **Mobile Development:** After building the frontend (`npm run build`), use `npx cap sync android` to update the Android project.

## Project Structure
```text
skillPath/
├── sp-backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/   # API Logic
│   │   ├── Models/             # Eloquent Models
│   │   └── Services/           # GeminiService (AI Integration)
│   ├── database/               # Migrations & Seeders
│   └── routes/api.php          # API Route Definitions
└── sp-frontend/                # React Frontend
    ├── src/
    │   ├── api/                # Axios Configuration
    │   ├── components/         # Reusable UI
    │   ├── pages/              # Page Components
    │   └── App.jsx             # Routing & Root Component
    └── android/                # Capacitor Android Project
```
