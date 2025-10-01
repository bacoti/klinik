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
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments');
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('nurse_id')->constrained('users');
            $table->decimal('height', 5, 2)->nullable(); // in cm
            $table->decimal('weight', 5, 2)->nullable(); // in kg
            $table->decimal('temperature', 4, 1)->nullable(); // in celsius
            $table->string('blood_pressure')->nullable(); // e.g., "120/80"
            $table->integer('heart_rate')->nullable(); // bpm
            $table->integer('respiratory_rate')->nullable(); // per minute
            $table->text('chief_complaint')->nullable();
            $table->text('additional_symptoms')->nullable();
            $table->text('nurse_notes')->nullable();
            $table->enum('priority', ['low', 'normal', 'high', 'emergency'])->default('normal');
            $table->timestamp('screened_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
