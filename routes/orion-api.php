<?php

use App\Http\Controllers\Orion\OrionModelController;
use App\Http\Controllers\TableGeneratorController;
use Illuminate\Support\Facades\Route;
use Orion\Facades\Orion;

Orion::resource('orion-models', OrionModelController::class)->middleware(['auth', 'web']);
Orion::resource('users', \App\Http\Controllers\Orion\UserController::class)->middleware(['auth', 'web']);
Route::post('generate-table', [TableGeneratorController::class, 'generate'])->middleware(['auth', 'web']);


Orion::resource('offices', \App\Http\Controllers\Orion\OfficeController::class)->middleware(['auth','web']);

Orion::resource('venues', \App\Http\Controllers\Orion\VenueController::class)->middleware(['auth','web']);

Orion::resource('officers', \App\Http\Controllers\Orion\OfficerController::class)->middleware(['auth','web']);