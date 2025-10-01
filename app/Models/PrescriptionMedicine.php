<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrescriptionMedicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'medicine_id',
        'quantity',
        'dosage',
        'frequency',
        'duration',
        'instructions',
        'unit_price',
        'total_price',
        'dispensed_quantity',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    // Relationships
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    // Helper methods
    public function getRemainingQuantityAttribute()
    {
        return $this->quantity - $this->dispensed_quantity;
    }

    public function isFullyDispensed()
    {
        return $this->dispensed_quantity >= $this->quantity;
    }

    public function isPartiallyDispensed()
    {
        return $this->dispensed_quantity > 0 && $this->dispensed_quantity < $this->quantity;
    }

    public function getDispenseStatusAttribute()
    {
        if ($this->isFullyDispensed()) return 'dispensed';
        if ($this->isPartiallyDispensed()) return 'partially_dispensed';
        return 'pending';
    }

    // Calculate total price when quantity or unit price changes
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->total_price = $model->quantity * $model->unit_price;
        });
        
        static::updating(function ($model) {
            if ($model->isDirty(['quantity', 'unit_price'])) {
                $model->total_price = $model->quantity * $model->unit_price;
            }
        });
    }
}
