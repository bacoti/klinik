<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Examination;
use App\Models\Prescription;
use App\Models\Medicine;
use App\Models\Screening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for Admin
     */
    public function adminStats()
    {
        try {
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
            
            $stats = [
                'total_patients' => Patient::where('status', 'active')->count(),
                'total_staff' => User::whereHas('role', function($query) {
                    $query->whereIn('name', ['doctor', 'nurse', 'pharmacist']);
                })->count(),
                'todays_appointments' => Appointment::whereDate('appointment_date', $today)
                    ->whereIn('status', ['registered', 'waiting', 'screening', 'examination'])
                    ->count(),
                'monthly_revenue' => Prescription::whereDate('created_at', '>=', $thisMonth)
                    ->where('status', 'dispensed')
                    ->sum('total_amount'),
                
                // Additional stats
                'pending_appointments' => Appointment::where('status', 'registered')->count(),
                'active_doctors' => User::whereHas('role', function($query) {
                    $query->where('name', 'doctor');
                })->where('is_active', true)->count(),
                'low_stock_medicines' => Medicine::whereRaw('stock_quantity <= minimum_stock')
                    ->where('is_active', true)
                    ->count(),
                'completed_examinations_today' => Examination::whereDate('examined_at', $today)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admin statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics for Doctor
     */
    public function doctorStats(Request $request)
    {
        try {
            $doctor = $request->user();
            $today = Carbon::today();
            $thisWeek = Carbon::now()->startOfWeek();
            
            $stats = [
                'todays_appointments' => Appointment::whereDate('appointment_date', $today)
                    ->whereIn('status', ['waiting', 'screening', 'examination'])
                    ->count(),
                'patients_in_queue' => Appointment::whereDate('appointment_date', $today)
                    ->where('status', 'waiting')
                    ->count(),
                'completed_today' => Examination::where('doctor_id', $doctor->id)
                    ->whereDate('examined_at', $today)
                    ->count(),
                'weekly_examinations' => Examination::where('doctor_id', $doctor->id)
                    ->whereDate('examined_at', '>=', $thisWeek)
                    ->count(),
                
                // Additional stats
                'pending_prescriptions' => Prescription::whereHas('examination', function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->id);
                })->where('status', 'pending')->count(),
                'follow_up_required' => Examination::where('doctor_id', $doctor->id)
                    ->where('follow_up_required', true)
                    ->whereDate('follow_up_date', '>=', $today)
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch doctor statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics for Nurse
     */
    public function nurseStats(Request $request)
    {
        try {
            $nurse = $request->user();
            $today = Carbon::today();
            
            $stats = [
                'screenings_today' => Screening::where('nurse_id', $nurse->id)
                    ->whereDate('screened_at', $today)
                    ->count(),
                'patients_waiting' => Appointment::whereDate('appointment_date', $today)
                    ->where('status', 'registered')
                    ->count(),
                'priority_cases' => Screening::whereDate('screened_at', $today)
                    ->whereIn('priority', ['high', 'emergency'])
                    ->count(),
                'completed_registrations' => Patient::whereDate('created_at', $today)
                    ->where('registered_by', $nurse->id)
                    ->count(),
                
                // Additional stats
                'pending_screening' => Appointment::whereDate('appointment_date', $today)
                    ->where('status', 'waiting')
                    ->count(),
                'emergency_cases_today' => Screening::whereDate('screened_at', $today)
                    ->where('priority', 'emergency')
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch nurse statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics for Pharmacist
     */
    public function pharmacistStats(Request $request)
    {
        try {
            $pharmacist = $request->user();
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
            
            $stats = [
                'pending_prescriptions' => Prescription::where('status', 'pending')->count(),
                'dispensed_today' => Prescription::where('dispensed_by', $pharmacist->id)
                    ->whereDate('dispensed_at', $today)
                    ->count(),
                'low_stock_alerts' => Medicine::whereRaw('stock_quantity <= minimum_stock')
                    ->where('is_active', true)
                    ->count(),
                'monthly_sales' => Prescription::where('dispensed_by', $pharmacist->id)
                    ->whereDate('dispensed_at', '>=', $thisMonth)
                    ->where('status', 'dispensed')
                    ->sum('total_amount'),
                
                // Additional stats
                'expired_medicines' => Medicine::where('expiry_date', '<', $today)
                    ->where('is_active', true)
                    ->count(),
                'total_medicines' => Medicine::where('is_active', true)->count(),
                'partially_dispensed' => Prescription::where('status', 'partially_dispensed')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pharmacist statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities for dashboard
     */
    public function recentActivities(Request $request)
    {
        try {
            $user = $request->user();
            $limit = $request->get('limit', 10);
            
            $activities = [];
            
            switch ($user->role->name) {
                case 'admin':
                    $activities = $this->getAdminActivities($limit);
                    break;
                case 'doctor':
                    $activities = $this->getDoctorActivities($user, $limit);
                    break;
                case 'nurse':
                    $activities = $this->getNurseActivities($user, $limit);
                    break;
                case 'pharmacist':
                    $activities = $this->getPharmacistActivities($user, $limit);
                    break;
            }

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getAdminActivities($limit)
    {
        return collect([
            // Recent registrations
            Patient::with(['registeredBy'])
                ->latest()
                ->take($limit / 2)
                ->get()
                ->map(function ($patient) {
                    return [
                        'id' => $patient->id,
                        'type' => 'patient_registration',
                        'title' => 'New Patient Registered',
                        'description' => "Patient {$patient->name} registered by {$patient->registeredBy->name}",
                        'time' => $patient->created_at,
                        'icon' => 'user-plus',
                        'color' => 'blue'
                    ];
                }),
            
            // Recent appointments
            Appointment::with(['patient', 'createdBy'])
                ->latest()
                ->take($limit / 2)
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'type' => 'appointment',
                        'title' => 'New Appointment',
                        'description' => "Appointment for {$appointment->patient->name}",
                        'time' => $appointment->created_at,
                        'icon' => 'calendar',
                        'color' => 'green'
                    ];
                })
        ])->flatten(1)->sortByDesc('time')->take($limit)->values();
    }

    private function getDoctorActivities($doctor, $limit)
    {
        return Examination::with(['patient', 'appointment'])
            ->where('doctor_id', $doctor->id)
            ->latest('examined_at')
            ->take($limit)
            ->get()
            ->map(function ($examination) {
                return [
                    'id' => $examination->id,
                    'type' => 'examination',
                    'title' => 'Patient Examination',
                    'description' => "Examined {$examination->patient->name} - {$examination->diagnosis_primary}",
                    'time' => $examination->examined_at,
                    'icon' => 'stethoscope',
                    'color' => 'blue'
                ];
            });
    }

    private function getNurseActivities($nurse, $limit)
    {
        return Screening::with(['patient', 'appointment'])
            ->where('nurse_id', $nurse->id)
            ->latest('screened_at')
            ->take($limit)
            ->get()
            ->map(function ($screening) {
                return [
                    'id' => $screening->id,
                    'type' => 'screening',
                    'title' => 'Patient Screening',
                    'description' => "Screened {$screening->patient->name} - Priority: {$screening->priority}",
                    'time' => $screening->screened_at,
                    'icon' => 'clipboard-check',
                    'color' => $screening->priority === 'emergency' ? 'red' : 'green'
                ];
            });
    }

    private function getPharmacistActivities($pharmacist, $limit)
    {
        return Prescription::with(['patient', 'examination.doctor'])
            ->where('dispensed_by', $pharmacist->id)
            ->whereNotNull('dispensed_at')
            ->latest('dispensed_at')
            ->take($limit)
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'type' => 'prescription',
                    'title' => 'Prescription Dispensed',
                    'description' => "Dispensed prescription for {$prescription->patient->name}",
                    'time' => $prescription->dispensed_at,
                    'icon' => 'pill',
                    'color' => 'purple'
                ];
            });
    }

    /**
     * Get upcoming appointments for today
     */
    public function upcomingAppointments(Request $request)
    {
        try {
            $user = $request->user();
            $today = Carbon::today();
            $limit = $request->get('limit', 5);
            
            $query = Appointment::with(['patient'])
                ->whereDate('appointment_date', $today)
                ->whereIn('status', ['registered', 'waiting', 'screening']);
            
            // Filter by role if needed
            if ($user->role->name === 'doctor') {
                // For future: when we add doctor assignment to appointments
                // $query->where('doctor_id', $user->id);
            }
            
            $appointments = $query->orderBy('appointment_time')
                ->take($limit)
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'patient_name' => $appointment->patient->name,
                        'patient_number' => $appointment->patient->patient_number,
                        'appointment_time' => $appointment->appointment_time,
                        'type' => $appointment->type,
                        'status' => $appointment->status,
                        'queue_number' => $appointment->queue_number,
                        'chief_complaint' => $appointment->chief_complaint
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch upcoming appointments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
