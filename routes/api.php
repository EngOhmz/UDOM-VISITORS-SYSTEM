<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\VisitRequestController;
use App\Http\Controllers\Api\VisitorLogController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\ReportController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    Route::apiResource('visitors', VisitorController::class);
    Route::apiResource('offices', OfficeController::class);
    
    Route::get('/requests', [VisitRequestController::class, 'index']);
    Route::post('/requests', [VisitRequestController::class, 'store']);
    Route::get('/requests/{id}', [VisitRequestController::class, 'show']);
    Route::put('/requests/{id}/approve', [VisitRequestController::class, 'approve']);
    Route::put('/requests/{id}/reject', [VisitRequestController::class, 'reject']);
    
    Route::get('/logs', [VisitorLogController::class, 'index']);
    Route::post('/logs/check-in', [VisitorLogController::class, 'checkIn']);
    Route::put('/logs/{id}/check-out', [VisitorLogController::class, 'checkOut']);

    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/export', [ReportController::class, 'export']);
});
