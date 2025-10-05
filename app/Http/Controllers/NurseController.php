<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NurseController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Nurse/NurseDashboard');
    }

    public function registration()
    {
        return Inertia::render('Nurse/PatientRegistration');
    }

    public function queue()
    {
        return Inertia::render('Nurse/PatientQueue', [
            'patients' => [
                ['id' => 1, 'name' => 'John Doe', 'status' => 'waiting', 'priority' => 'normal'],
                ['id' => 2, 'name' => 'Jane Smith', 'status' => 'in_progress', 'priority' => 'urgent'],
                ['id' => 3, 'name' => 'Bob Johnson', 'status' => 'waiting', 'priority' => 'emergency'],
            ]
        ]);
    }

    public function vitals()
    {
        return Inertia::render('Nurse/VitalSigns', [
            'patients' => [
                ['id' => 1, 'name' => 'John Doe', 'room' => '101'],
                ['id' => 2, 'name' => 'Jane Smith', 'room' => '102'],
                ['id' => 3, 'name' => 'Bob Johnson', 'room' => '103'],
                ['id' => 4, 'name' => 'Alice Brown', 'room' => '104'],
                ['id' => 5, 'name' => 'Charlie Wilson', 'room' => '105'],
            ]
        ]);
    }

    public function screening()
    {
        return Inertia::render('Nurse/PatientScreening', [
            'pending_screenings' => [
                ['id' => 1, 'patient_name' => 'Alice Brown', 'registered_at' => '09:30 AM'],
                ['id' => 2, 'patient_name' => 'Charlie Wilson', 'registered_at' => '09:45 AM'],
                ['id' => 3, 'patient_name' => 'Diana Lee', 'registered_at' => '10:00 AM'],
            ]
        ]);
    }

    public function notes()
    {
        return Inertia::render('Nurse/NursingNotes', [
            'notes' => [
                [
                    'id' => 1,
                    'patient_name' => 'John Doe',
                    'note' => 'Patient shows improvement in vital signs',
                    'created_at' => '2 hours ago',
                    'nurse_name' => 'Nurse Mary'
                ],
                [
                    'id' => 2,
                    'patient_name' => 'Jane Smith',
                    'note' => 'Administered medication as prescribed',
                    'created_at' => '1 hour ago',
                    'nurse_name' => 'Nurse Sarah'
                ]
            ]
        ]);
    }

    public function storeVitalSigns(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|integer',
            'blood_pressure_systolic' => 'required|numeric|min:50|max:300',
            'blood_pressure_diastolic' => 'required|numeric|min:30|max:200',
            'temperature' => 'required|numeric|min:30|max:45',
            'pulse' => 'required|numeric|min:30|max:200',
            'respiratory_rate' => 'required|numeric|min:5|max:50',
            'oxygen_saturation' => 'required|numeric|min:70|max:100',
            'weight' => 'nullable|numeric|min:1|max:300',
            'height' => 'nullable|numeric|min:50|max:250',
        ]);

        // TODO: Save to database
        // VitalSign::create([
        //     'patient_id' => $validated['patient_id'],
        //     'blood_pressure' => $validated['blood_pressure_systolic'] . '/' . $validated['blood_pressure_diastolic'],
        //     'temperature' => $validated['temperature'],
        //     'pulse' => $validated['pulse'],
        //     'respiratory_rate' => $validated['respiratory_rate'],
        //     'oxygen_saturation' => $validated['oxygen_saturation'],
        //     'weight' => $validated['weight'],
        //     'height' => $validated['height'],
        //     'recorded_by' => auth()->id(),
        // ]);

        return response()->json([
            'message' => 'Vital signs recorded successfully',
            'data' => $validated
        ]);
    }
}
