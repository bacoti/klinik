<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vital_signs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->string('blood_pressure')->nullable(); // e.g., "120/80"
            $table->decimal('temperature', 4, 1)->nullable(); // Celsius
            $table->integer('pulse')->nullable(); // beats per minute
            $table->integer('respiratory_rate')->nullable(); // breaths per minute
            $table->integer('oxygen_saturation')->nullable(); // percentage
            $table->decimal('weight', 5, 1)->nullable(); // kg
            $table->decimal('height', 5, 1)->nullable(); // cm
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Indexes for better performance
            $table->index(['patient_id', 'created_at']);
            $table->index('recorded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vital_signs');
    }
};
