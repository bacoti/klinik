<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Screening extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'patient_id',
        'nurse_id',
        'height',
        'weight',
        'temperature',
        'blood_pressure',
        'heart_rate',
        'respiratory_rate',
        'chief_complaint',
        'additional_symptoms',
        'nurse_notes',
        'priority',
        'screened_at',
    ];

    protected function casts(): array
    {
        return [
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
            'temperature' => 'decimal:1',
            'screened_at' => 'datetime',
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

    public function nurse()
    {
        return $this->belongsTo(User::class, 'nurse_id');
    }

    public function examination()
    {
        return $this->hasOne(Examination::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    // Helper methods
    public function getBMIAttribute()
    {
        if ($this->height && $this->weight) {
            $heightInMeters = $this->height / 100;
            return round($this->weight / ($heightInMeters * $heightInMeters), 2);
        }
        return null;
    }

    public function getBMICategoryAttribute()
    {
        $bmi = $this->getBMIAttribute();
        if (!$bmi) return null;
        
        if ($bmi < 18.5) return 'Underweight';
        if ($bmi < 25) return 'Normal';
        if ($bmi < 30) return 'Overweight';
        return 'Obese';
    }

    public function getPriorityColorAttribute()
    {
        return match($this->priority) {
            'low' => 'green',
            'normal' => 'blue',
            'high' => 'orange',
            'emergency' => 'red',
            default => 'gray'
        };
    }
}
