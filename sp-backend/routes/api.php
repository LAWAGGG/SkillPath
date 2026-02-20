<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SkillController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix("/auth")->group(function(){
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/logout", [AuthController::class, "logout"])->middleware("auth:sanctum");
    Route::post("/me", [AuthController::class, "me"]);
});

Route::middleware("auth:sanctum")->group(function(){
    Route::get("/skills", [SkillController::class, "index"]);
    Route::get("/skill-categories", [SkillController::class, "skillCategories"]);
});
