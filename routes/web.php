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
    Route::get('/nurse/queue', [NurseController::class, 'queue'])->name('test.nurse.queue');
    Route::get('/nurse/screening', [NurseController::class, 'screening'])->name('test.nurse.screening');
    Route::get('/nurse/notes', [NurseController::class, 'notes'])->name('test.nurse.notes');
    Route::get('/test/pharmacist/inventory', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/pharmacist/inventory',
        'title' => 'Medicine Inventory Management',
        'description' => 'Test page for Medicine Inventory system'
    ]);
});

Route::get('/test/pharmacist/prescriptions', function () {
        return view('welcome');
    })->name('test.pharmacist.prescriptions');

Route::get('/test/pharmacist/dispensing', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/pharmacist/dispensing',
        'title' => 'Dispensing Log',
        'description' => 'Test page for Pharmacist Dispensing Log system'
    ]);
})->name('test.pharmacist.dispensing');

Route::get('/test/pharmacist/stock', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/pharmacist/stock',
        'title' => 'Stock Management',
        'description' => 'Test page for Pharmacist Stock Management system'
    ]);
})->name('test.pharmacist.stock');

Route::get('/test/pharmacist/reports', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/pharmacist/reports',
        'title' => 'Sales Report',
        'description' => 'Test page for Pharmacist Sales Report system'
    ]);
})->name('test.pharmacist.reports');

Route::get('/test/doctor/queue', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/doctor/queue',
        'title' => 'Doctor Queue',
        'description' => 'Test page for Doctor Patient Queue Management system'
    ]);
})->name('test.doctor.queue');

Route::get('/test/doctor/records', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/doctor/records',
        'title' => 'Medical Records',
        'description' => 'Test page for Doctor Medical Records Management system'
    ]);
})->name('test.doctor.records');

Route::get('/test/doctor/prescriptions', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/doctor/prescriptions',
        'title' => 'Doctor Prescriptions',
        'description' => 'Test page for Doctor Prescriptions Management system'
    ]);
})->name('test.doctor.prescriptions');

Route::get('/test/doctor/patients', function () {
    return Inertia::render('Test', [
        'targetRoute' => '/doctor/patients',
        'title' => 'My Patients',
        'description' => 'Test page for Doctor My Patients Management system'
    ]);
})->name('test.doctor.patients');
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
