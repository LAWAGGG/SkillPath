<?php

use App\Http\Controllers\AiFeedbackController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\RoadmapTopicController;
use App\Http\Controllers\SkillCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

//skills
Route::get("/skills", [SkillController::class, "index"]);
Route::get("/skill-categories", [SkillCategoryController::class, "index"]);

Route::prefix("/auth")->group(function () {
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/logout", [AuthController::class, "logout"])->middleware("auth:sanctum");
    Route::get("/me", [AuthController::class, "me"]);
});

Route::middleware("auth:sanctum")->group(function () {
    //roadmaps
    Route::post("/roadmaps/generate", [RoadmapController::class, "store"]);
    Route::get("/roadmaps", [RoadmapController::class, "index"]);
    Route::get("/roadmaps/{id}", [RoadmapController::class, "show"]);
    Route::delete("/roadmaps/{id}", [RoadmapController::class, "destroy"]);
    Route::put("/roadmaps/{id}/evaluate", [RoadmapController::class, "update"]);

    //update progress
    Route::patch("/topics/{id}/toggle", [RoadmapTopicController::class, "update"]);

    //ai feedback
    Route::post('/ai/feedback/{roadmapId}', [AiFeedbackController::class, "store"]);
    Route::get('/ai/feedbacks/{roadmapId}', [AiFeedbackController::class, "show"]);

    //admin features
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::prefix('/admin')->group(function () {
            //skill categories
            Route::get("/skill-categories", [SkillCategoryController::class, "index"]);
            Route::post("/skill-categories", [SkillCategoryController::class, "store"]);
            Route::put("/skill-categories/{id}", [SkillCategoryController::class, "update"]);
            Route::delete("/skill-categories/{id}", [SkillCategoryController::class, "destroy"]);

            //skill
            Route::get("/skills", [SkillController::class, "index"]);
            Route::post('/skills', [SkillController::class, "store"]);
            Route::put('/skills/{id}', [SkillController::class, "update"]);
            Route::delete('/skills/{id}', [SkillController::class, "destroy"]);

            //users
            Route::get("/users", [UserController::class, "index"]);
            Route::delete("/users/{id}", [UserController::class, "destroy"]);

            Route::get("/roadmaps", [RoadmapController::class, "adminRoadmaps"]);
        });
    });
});
