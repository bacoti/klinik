<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_number',
        'patient_id',
        'appointment_date',
        'appointment_time',
        'type',
        'chief_complaint',
        'status',
        'queue_number',
        'created_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date',
            'appointment_time' => 'datetime:H:i',
        ];
    }

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function screening()
    {
        return $this->hasOne(Screening::class);
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
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'registered' => 'blue',
            'waiting' => 'yellow',
            'screening' => 'orange',
            'examination' => 'purple',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    // Generate appointment number
    public static function generateAppointmentNumber()
    {
        $lastAppointment = self::latest('id')->first();
        $nextId = $lastAppointment ? $lastAppointment->id + 1 : 1;
        return 'A' . date('Ymd') . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }

    // Generate queue number for today
    public static function generateQueueNumber($date = null)
    {
        $date = $date ?: date('Y-m-d');
        $lastQueue = self::whereDate('appointment_date', $date)
                        ->max('queue_number');
        return ($lastQueue ?? 0) + 1;
    }
}
