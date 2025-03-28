<?php

use App\Http\Controllers\Orion\OrionModelController;
use App\Http\Controllers\TableGeneratorController;
use App\Http\Controllers\TableRemoverController;
use Illuminate\Support\Facades\Route;
use Orion\Facades\Orion;

Orion::resource('orion-models', OrionModelController::class)->middleware(['auth', 'web'])->withSoftDeletes();
Orion::resource('users', \App\Http\Controllers\Orion\UserController::class)->middleware(['auth', 'web'])->withSoftDeletes();
Route::post('generate-table', [TableGeneratorController::class, 'generate'])->middleware(['auth', 'web']);
Route::delete('remove-table', [TableRemoverController::class, 'removeTable'])->middleware(['auth', 'web']);


