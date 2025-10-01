<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'phone',
        'address',
        'gender',
        'birth_date',
        'employee_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birth_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function registeredPatients()
    {
        return $this->hasMany(Patient::class, 'registered_by');
    }

    public function verifiedPatients()
    {
        return $this->hasMany(Patient::class, 'verified_by');
    }

    public function createdAppointments()
    {
        return $this->hasMany(Appointment::class, 'created_by');
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'nurse_id');
    }

    public function examinations()
    {
        return $this->hasMany(Examination::class, 'doctor_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'doctor_id');
    }

    public function dispensedPrescriptions()
    {
        return $this->hasMany(Prescription::class, 'dispensed_by');
    }

    public function pharmacyTransactions()
    {
        return $this->hasMany(PharmacyTransaction::class, 'pharmacist_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'created_by');
    }

    // Helper methods
    public function hasRole($role)
    {
        return $this->role->name === $role;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isDoctor()
    {
        return $this->hasRole('doctor');
    }

    public function isNurse()
    {
        return $this->hasRole('nurse');
    }

    public function isPharmacist()
    {
        return $this->hasRole('pharmacist');
    }

    public function isPatient()
    {
        return $this->hasRole('patient');
    }
}
