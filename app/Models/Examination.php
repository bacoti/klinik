<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Examination extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'patient_id',
        'doctor_id',
        'screening_id',
        'subjective',
        'objective',
        'assessment',
        'plan',
        'diagnosis_primary',
        'diagnosis_secondary',
        'treatment_notes',
        'doctor_notes',
        'follow_up_required',
        'follow_up_date',
        'follow_up_notes',
        'sick_leave_required',
        'sick_leave_days',
        'sick_leave_start_date',
        'sick_leave_end_date',
        'sick_leave_notes',
        'examined_at',
    ];

    protected function casts(): array
    {
        return [
            'follow_up_required' => 'boolean',
            'follow_up_date' => 'date',
            'sick_leave_required' => 'boolean',
            'sick_leave_start_date' => 'date',
            'sick_leave_end_date' => 'date',
            'examined_at' => 'datetime',
        ];
    }

    // Relationships
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    // Helper methods
    public function getSOAPNotesAttribute()
    {
        return [
            'subjective' => $this->subjective,
            'objective' => $this->objective,
            'assessment' => $this->assessment,
            'plan' => $this->plan,
        ];
    }
}
