<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_number',
        'name',
        'email',
        'phone',
        'address',
        'gender',
        'birth_date',
        'birth_place',
        'occupation',
        'marital_status',
        'emergency_contact_name',
        'emergency_contact_phone',
        'blood_type',
        'allergies',
        'medical_history',
        'status',
        'registered_by',
        'is_verified',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    // Relationships
    public function registeredBy()
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }

    public function examinations()
    {
        return $this->hasMany(Examination::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function pharmacyTransactions()
    {
        return $this->hasMany(PharmacyTransaction::class);
    }

    // Helper methods
    public function getAgeAttribute()
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }

    public function getFullAddressAttribute()
    {
        return $this->address;
    }

    // Generate patient number
    public static function generatePatientNumber()
    {
        $lastPatient = self::latest('id')->first();
        $nextId = $lastPatient ? $lastPatient->id + 1 : 1;
        return 'P' . date('Y') . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
