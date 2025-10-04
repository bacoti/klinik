<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Api\ExaminationController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\PharmacyController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'api_version' => '1.0.0',
        'laravel_version' => app()->version()
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Guest routes (for some public information)
Route::get('/doctors/available', [AuthController::class, 'availableDoctors']);
Route::get('/specializations', [AuthController::class, 'specializations']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Dashboard routes - Role specific
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats'])->middleware('role:admin');
    Route::get('/dashboard/doctor', [DashboardController::class, 'doctorStats'])->middleware('role:doctor');
    Route::get('/dashboard/nurse', [DashboardController::class, 'nurseStats'])->middleware('role:nurse');
    Route::get('/dashboard/pharmacist', [DashboardController::class, 'pharmacistStats'])->middleware('role:pharmacist');
    Route::get('/dashboard/activities', [DashboardController::class, 'recentActivities']);
    Route::get('/dashboard/appointments', [DashboardController::class, 'upcomingAppointments']);

    // Patient routes
    Route::apiResource('patients', PatientController::class);
    Route::post('/patients/{patient}/verify', [PatientController::class, 'verify'])->middleware('role:admin');
    Route::get('/patients/{patient}/medical-history', [PatientController::class, 'medicalHistory']);
    Route::get('/patients/search/{term}', [PatientController::class, 'search']);

    // Appointment routes
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/queue/today', [AppointmentController::class, 'todayQueue']);
    Route::put('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
    Route::get('/appointments/doctor/{doctor}/today', [AppointmentController::class, 'doctorTodayAppointments']);

    // Screening routes (Nurse only)
    Route::middleware('role:nurse,admin')->group(function () {
        Route::apiResource('screenings', ScreeningController::class);
        Route::get('/queue/screening', [ScreeningController::class, 'screeningQueue']);
        Route::post('/screenings/{screening}/vital-signs', [ScreeningController::class, 'recordVitalSigns']);
    });

    // Examination routes (Doctor only)
    Route::middleware('role:doctor,admin')->group(function () {
        Route::apiResource('examinations', ExaminationController::class);
        Route::get('/queue/examination', [ExaminationController::class, 'examinationQueue']);
        Route::post('/examinations/{examination}/sick-leave', [ExaminationController::class, 'generateSickLeave']);
        Route::get('/examinations/doctor/queue', [ExaminationController::class, 'doctorQueue']);
    });

    // Prescription routes
    Route::middleware('role:doctor,pharmacist,admin')->group(function () {
        Route::apiResource('prescriptions', PrescriptionController::class);
        Route::put('/prescriptions/{prescription}/dispense', [PrescriptionController::class, 'dispense'])->middleware('role:pharmacist,admin');
        Route::get('/prescriptions/pending', [PrescriptionController::class, 'pending'])->middleware('role:pharmacist,admin');
    });

    // Medicine routes
    Route::apiResource('medicines', MedicineController::class);
    Route::get('/medicines/low-stock', [MedicineController::class, 'lowStock'])->middleware('role:pharmacist,admin');
    Route::get('/medicines/expired', [MedicineController::class, 'expired'])->middleware('role:pharmacist,admin');
    Route::get('/medicines/search/{term}', [MedicineController::class, 'search']);

    // Pharmacy routes (Pharmacist only)
    Route::middleware('role:pharmacist,admin')->group(function () {
        Route::get('/pharmacy/transactions', [PharmacyController::class, 'transactions']);
        Route::post('/pharmacy/dispense', [PharmacyController::class, 'dispense']);
        Route::get('/pharmacy/pending-prescriptions', [PharmacyController::class, 'pendingPrescriptions']);
        Route::get('/pharmacy/daily-sales', [PharmacyController::class, 'dailySales']);
        Route::get('/pharmacy/inventory-report', [PharmacyController::class, 'inventoryReport']);
    });

    // Medical Record routes
    Route::get('/medical-records', [MedicalRecordController::class, 'index']);
    Route::get('/medical-records/{record}', [MedicalRecordController::class, 'show']);
    Route::get('/medical-records/{record}/pdf', [MedicalRecordController::class, 'generatePDF']);
    Route::get('/patients/{patient}/medical-records', [MedicalRecordController::class, 'patientRecords']);

    // PDF Generation routes
    Route::get('/prescriptions/{prescription}/pdf', [PrescriptionController::class, 'generatePDF']);
    Route::get('/examinations/{examination}/sick-leave-pdf', [ExaminationController::class, 'generateSickLeavePDF']);

    // Notification routes
    Route::get('/notifications', function () {
        return response()->json(['notifications' => []]);
    });
    Route::post('/notifications/mark-read', function () {
        return response()->json(['success' => true]);
    });

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'users']);
        Route::post('/users', [AuthController::class, 'createUser']);
        Route::put('/users/{user}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{user}', [AuthController::class, 'deleteUser']);
        Route::get('/roles', [AuthController::class, 'roles']);

        // System reports
        Route::get('/reports/system-overview', [DashboardController::class, 'systemOverview']);
        Route::get('/reports/user-activity', [DashboardController::class, 'userActivity']);
        Route::get('/reports/financial', [DashboardController::class, 'financialReport']);
    });
});
