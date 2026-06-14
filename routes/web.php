<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\VisitorController;
use App\Http\Controllers\Web\VisitRequestController;
use App\Http\Controllers\Web\VisitorLogController;
use App\Http\Controllers\Web\OfficeController;
use App\Http\Controllers\Web\RoleController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\ReportController;
use App\Http\Controllers\Web\UserController;

// Visitor auth routes
Route::get('/visitor/login', [App\Http\Controllers\Web\VisitorAuthController::class, 'showLogin'])->name('visitor.login');
Route::get('/visitor/register', [App\Http\Controllers\Web\VisitorAuthController::class, 'showRegister'])->name('visitor.register');
Route::post('/visitor/register', [App\Http\Controllers\Web\VisitorAuthController::class, 'register']);

// Admin/Staff auth routes
Route::match(['get', 'put'], '/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Visitor routes (role: visitor)
    Route::middleware('role:visitor')->group(function () {
        Route::get('/visitor/request', [App\Http\Controllers\Web\VisitorRequestController::class, 'showRequestForm'])->name('visitor.request.form');
        Route::post('/visitor/request', [App\Http\Controllers\Web\VisitorRequestController::class, 'submitRequest'])->name('visitor.request.submit');
    });

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        Route::resource('visitors', VisitorController::class)->except(['show']);
        Route::resource('offices', OfficeController::class)->except(['show']);
        Route::resource('roles', RoleController::class)->except(['show']);
        Route::resource('users', UserController::class)->except(['show']);
    });
    
    // Staff & Admin routes
    Route::middleware('role:admin,staff')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    });
    
    // All authenticated users (admin, staff, secretary, visitor)
    Route::get('/requests', [VisitRequestController::class, 'index'])->name('requests.index');
    
    // Only admin, staff, secretary can approve/reject requests and access logs
    Route::middleware('role:admin,staff,secretary')->group(function () {
        Route::put('/requests/{id}/approve', [VisitRequestController::class, 'approve'])->name('requests.approve');
        Route::put('/requests/{id}/reject', [VisitRequestController::class, 'reject'])->name('requests.reject');
        
        Route::get('/logs', [VisitorLogController::class, 'index'])->name('logs.index');
        Route::post('/logs/check-in', [VisitorLogController::class, 'checkIn'])->name('logs.check-in');
        Route::put('/logs/{id}/check-out', [VisitorLogController::class, 'checkOut'])->name('logs.check-out');
    });
});
