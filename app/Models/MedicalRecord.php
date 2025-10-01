<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'record_number',
        'patient_id',
        'appointment_id',
        'screening_id',
        'examination_id',
        'prescription_id',
        'type',
        'summary',
        'vital_signs',
        'diagnosis',
        'treatment',
        'notes',
        'attachments',
        'created_by',
        'record_date',
    ];

    protected function casts(): array
    {
        return [
            'vital_signs' => 'array',
            'attachments' => 'array',
            'record_date' => 'date',
        ];
    }

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    public function examination()
    {
        return $this->belongsTo(Examination::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Helper methods
    public function getTypeColorAttribute()
    {
        return match($this->type) {
            'registration' => 'blue',
            'screening' => 'green',
            'examination' => 'purple',
            'prescription' => 'orange',
            'pharmacy' => 'yellow',
            'follow_up' => 'cyan',
            default => 'gray'
        };
    }

    // Generate record number
    public static function generateRecordNumber()
    {
        $lastRecord = self::latest('id')->first();
        $nextId = $lastRecord ? $lastRecord->id + 1 : 1;
        return 'MR' . date('Ymd') . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }

    // Create comprehensive medical record from examination
    public static function createFromExamination(Examination $examination)
    {
        $vitalSigns = [];
        if ($examination->screening) {
            $vitalSigns = [
                'height' => $examination->screening->height,
                'weight' => $examination->screening->weight,
                'temperature' => $examination->screening->temperature,
                'blood_pressure' => $examination->screening->blood_pressure,
                'heart_rate' => $examination->screening->heart_rate,
                'respiratory_rate' => $examination->screening->respiratory_rate,
            ];
        }

        return self::create([
            'record_number' => self::generateRecordNumber(),
            'patient_id' => $examination->patient_id,
            'appointment_id' => $examination->appointment_id,
            'screening_id' => $examination->screening_id,
            'examination_id' => $examination->id,
            'type' => 'examination',
            'summary' => $examination->assessment,
            'vital_signs' => $vitalSigns,
            'diagnosis' => $examination->diagnosis_primary . ($examination->diagnosis_secondary ? ' | ' . $examination->diagnosis_secondary : ''),
            'treatment' => $examination->plan,
            'notes' => $examination->doctor_notes,
            'created_by' => $examination->doctor_id,
            'record_date' => $examination->examined_at->toDateString(),
        ]);
    }
}
