<?php

use App\Http\Controllers\Beats\BeatsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    //beats ...
    Route::get('/beats', [BeatsController::class, 'index'])->name('beats.index');
    //beat palet
    Route::get('/palets', [BeatsController::class, 'palets'])->name('beats.palet');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
