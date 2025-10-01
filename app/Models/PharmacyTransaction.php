<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PharmacyTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_number',
        'prescription_id',
        'patient_id',
        'pharmacist_id',
        'type',
        'total_amount',
        'payment_status',
        'status',
        'notes',
        'transaction_date',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'transaction_date' => 'datetime',
        ];
    }

    // Relationships
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function pharmacist()
    {
        return $this->belongsTo(User::class, 'pharmacist_id');
    }

    // Helper methods
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    public function getPaymentStatusColorAttribute()
    {
        return match($this->payment_status) {
            'unpaid' => 'red',
            'paid' => 'green',
            'partially_paid' => 'orange',
            default => 'gray'
        };
    }

    // Generate transaction number
    public static function generateTransactionNumber()
    {
        $lastTransaction = self::latest('id')->first();
        $nextId = $lastTransaction ? $lastTransaction->id + 1 : 1;
        return 'TXN' . date('Ymd') . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
