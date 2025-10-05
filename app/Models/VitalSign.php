<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VitalSign extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'blood_pressure',
        'temperature',
        'pulse',
        'respiratory_rate',
        'oxygen_saturation',
        'weight',
        'height',
        'recorded_by',
        'notes',
    ];

    protected $casts = [
        'temperature' => 'decimal:1',
        'pulse' => 'integer',
        'respiratory_rate' => 'integer',
        'oxygen_saturation' => 'integer',
        'weight' => 'decimal:1',
        'height' => 'decimal:1',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the patient that owns the vital sign
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the user who recorded the vital sign
     */
    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Get systolic blood pressure
     */
    public function getSystolicAttribute(): ?int
    {
        if (!$this->blood_pressure) return null;

        $parts = explode('/', $this->blood_pressure);
        return isset($parts[0]) ? (int) $parts[0] : null;
    }

    /**
     * Get diastolic blood pressure
     */
    public function getDiastolicAttribute(): ?int
    {
        if (!$this->blood_pressure) return null;

        $parts = explode('/', $this->blood_pressure);
        return isset($parts[1]) ? (int) $parts[1] : null;
    }

    /**
     * Check if temperature is normal
     */
    public function getTemperatureStatusAttribute(): string
    {
        if ($this->temperature >= 38) return 'critical';
        if ($this->temperature >= 37.5) return 'warning';
        return 'normal';
    }

    /**
     * Check if pulse is normal
     */
    public function getPulseStatusAttribute(): string
    {
        if ($this->pulse > 100 || $this->pulse < 60) return 'warning';
        return 'normal';
    }

    /**
     * Check if oxygen saturation is normal
     */
    public function getOxygenStatusAttribute(): string
    {
        if ($this->oxygen_saturation < 95) return 'critical';
        if ($this->oxygen_saturation < 98) return 'warning';
        return 'normal';
    }

    /**
     * Scope for recent vital signs
     */
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope for specific patient
     */
    public function scopeForPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }
}
