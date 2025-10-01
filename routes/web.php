<?php

use Illuminate\Support\Facades\Route;

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
