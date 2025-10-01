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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->string('record_number')->unique();
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('appointment_id')->nullable()->constrained('appointments');
            $table->foreignId('screening_id')->nullable()->constrained('screenings');
            $table->foreignId('examination_id')->nullable()->constrained('examinations');
            $table->foreignId('prescription_id')->nullable()->constrained('prescriptions');
            $table->enum('type', ['registration', 'screening', 'examination', 'prescription', 'pharmacy', 'follow_up'])->default('examination');
            $table->text('summary')->nullable();
            $table->json('vital_signs')->nullable(); // Store screening data as JSON
            $table->text('diagnosis')->nullable();
            $table->text('treatment')->nullable();
            $table->text('notes')->nullable();
            $table->json('attachments')->nullable(); // Store file paths as JSON
            $table->foreignId('created_by')->constrained('users');
            $table->date('record_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
