<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'generic_name',
        'description',
        'manufacturer',
        'form',
        'strength',
        'unit',
        'stock_quantity',
        'minimum_stock',
        'unit_price',
        'expiry_date',
        'batch_number',
        'is_active',
        'usage_instructions',
        'side_effects',
        'contraindications',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'expiry_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function prescriptionMedicines()
    {
        return $this->hasMany(PrescriptionMedicine::class);
    }

    public function prescriptions()
    {
        return $this->belongsToMany(Prescription::class, 'prescription_medicines')
                    ->withPivot(['quantity', 'dosage', 'frequency', 'duration', 'instructions', 'unit_price', 'total_price'])
                    ->withTimestamps();
    }

    // Helper methods
    public function isExpired()
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function isLowStock()
    {
        return $this->stock_quantity <= $this->minimum_stock;
    }

    public function getStockStatusAttribute()
    {
        if ($this->isExpired()) return 'expired';
        if ($this->isLowStock()) return 'low';
        if ($this->stock_quantity == 0) return 'out_of_stock';
        return 'available';
    }

    public function getStockStatusColorAttribute()
    {
        return match($this->getStockStatusAttribute()) {
            'expired' => 'red',
            'low' => 'orange',
            'out_of_stock' => 'red',
            'available' => 'green',
            default => 'gray'
        };
    }

    // Generate medicine code
    public static function generateCode()
    {
        $lastMedicine = self::latest('id')->first();
        $nextId = $lastMedicine ? $lastMedicine->id + 1 : 1;
        return 'MED' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
