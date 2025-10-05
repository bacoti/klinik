<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'app' => config('app.name'),
        'version' => '1.0.0'
    ]);
});

// Unauthorized access route
Route::get('/unauthorized', function () {
    return view('errors.unauthorized');
})->name('unauthorized');

// Authentication routes (if needed for web)
Route::get('/login', function () {
    return view('welcome');
})->name('login');

// Development routes (remove in production)
Route::get('/nurse/vitals-dev', function () {
    return view('welcome');
})->name('nurse.vitals.dev');

// Test routes without authentication (for development only)
Route::prefix('test')->group(function () {
    Route::get('/nurse/vitals', [NurseController::class, 'vitals'])->name('test.nurse.vitals');
    Route::get('/nurse/dashboard', [NurseController::class, 'dashboard'])->name('test.nurse.dashboard');
});

// Protected routes with role-based access
Route::middleware(['auth:sanctum'])->group(function () {

    // Nurse routes - only accessible by nurses
    Route::middleware(['checkRole:nurse'])->prefix('nurse')->name('nurse.')->group(function () {
        Route::get('/dashboard', [NurseController::class, 'dashboard'])->name('dashboard');
        Route::get('/registration', [NurseController::class, 'registration'])->name('registration');
        Route::get('/queue', [NurseController::class, 'queue'])->name('queue');
        Route::get('/vitals', [NurseController::class, 'vitals'])->name('vitals');
        Route::post('/vitals', [NurseController::class, 'storeVitalSigns'])->name('vitals.store');
        Route::get('/screening', [NurseController::class, 'screening'])->name('screening');
        Route::get('/notes', [NurseController::class, 'notes'])->name('notes');
    });

    // Doctor routes - only accessible by doctors
    Route::middleware(['checkRole:doctor'])->prefix('doctor')->name('doctor.')->group(function () {
        Route::get('/dashboard', function () {
            return view('welcome');
        })->name('dashboard');
        // Add other doctor routes here
    });

    // Admin routes - only accessible by admins
    Route::middleware(['checkRole:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return view('welcome');
        })->name('dashboard');
        Route::get('/patients', function () {
            return view('welcome');
        })->name('patients');
        Route::get('/appointments', function () {
            return view('welcome');
        })->name('appointments');
        Route::get('/staff', function () {
            return view('welcome');
        })->name('staff');
        Route::get('/reports', function () {
            return view('welcome');
        })->name('reports');
        Route::get('/settings', function () {
            return view('welcome');
        })->name('settings');
    });

    // Pharmacist routes - only accessible by pharmacists
    Route::middleware(['checkRole:pharmacist'])->prefix('pharmacist')->name('pharmacist.')->group(function () {
        Route::get('/dashboard', function () {
            return view('welcome');
        })->name('dashboard');
        // Add other pharmacist routes here
    });
});

// API Documentation route (if using tools like Swagger)
Route::get('/api/docs', function () {
    return response()->json([
        'message' => 'API Documentation endpoint',
        'endpoints' => [
            'auth' => '/api/auth/*',
            'users' => '/api/users',
            'patients' => '/api/patients',
            'appointments' => '/api/appointments',
            'medical-records' => '/api/medical-records',
            'prescriptions' => '/api/prescriptions',
            'medicines' => '/api/medicines',
            'reports' => '/api/reports'
        ]
    ]);
});

// Fallback for React SPA - This should be the LAST route
// Catches all routes that don't match above and serves the React app
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
