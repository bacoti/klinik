<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_number',
        'examination_id',
        'patient_id',
        'doctor_id',
        'prescribed_date',
        'notes',
        'status',
        'dispensed_by',
        'dispensed_at',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'prescribed_date' => 'date',
            'dispensed_at' => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

    // Relationships
    public function examination()
    {
        return $this->belongsTo(Examination::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function dispensedBy()
    {
        return $this->belongsTo(User::class, 'dispensed_by');
    }

    public function prescriptionMedicines()
    {
        return $this->hasMany(PrescriptionMedicine::class);
    }

    public function medicines()
    {
        return $this->belongsToMany(Medicine::class, 'prescription_medicines')
                    ->withPivot(['quantity', 'dosage', 'frequency', 'duration', 'instructions', 'unit_price', 'total_price', 'dispensed_quantity', 'status'])
                    ->withTimestamps();
    }

    public function pharmacyTransactions()
    {
        return $this->hasMany(PharmacyTransaction::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    // Helper methods
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'dispensed' => 'green',
            'partially_dispensed' => 'orange',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    public function calculateTotalAmount()
    {
        $total = $this->prescriptionMedicines->sum('total_price');
        $this->update(['total_amount' => $total]);
        return $total;
    }

    // Generate prescription number
    public static function generatePrescriptionNumber()
    {
        $lastPrescription = self::latest('id')->first();
        $nextId = $lastPrescription ? $lastPrescription->id + 1 : 1;
        return 'RX' . date('Ymd') . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }
}
