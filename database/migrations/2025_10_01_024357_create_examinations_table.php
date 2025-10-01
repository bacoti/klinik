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
        Schema::create('examinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments');
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('doctor_id')->constrained('users');
            $table->foreignId('screening_id')->nullable()->constrained('screenings');
            $table->text('subjective')->nullable(); // Patient's complaints
            $table->text('objective')->nullable(); // Doctor's observations
            $table->text('assessment')->nullable(); // Diagnosis
            $table->text('plan')->nullable(); // Treatment plan
            $table->text('diagnosis_primary')->nullable();
            $table->text('diagnosis_secondary')->nullable();
            $table->text('treatment_notes')->nullable();
            $table->text('doctor_notes')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->boolean('sick_leave_required')->default(false);
            $table->integer('sick_leave_days')->nullable();
            $table->date('sick_leave_start_date')->nullable();
            $table->date('sick_leave_end_date')->nullable();
            $table->text('sick_leave_notes')->nullable();
            $table->timestamp('examined_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examinations');
    }
};
