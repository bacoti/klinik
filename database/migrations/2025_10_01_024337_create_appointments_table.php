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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_number')->unique();
            $table->foreignId('patient_id')->constrained('patients');
            $table->date('appointment_date');
            $table->time('appointment_time')->nullable();
            $table->enum('type', ['regular', 'emergency', 'follow_up'])->default('regular');
            $table->text('chief_complaint')->nullable();
            $table->enum('status', ['registered', 'waiting', 'screening', 'examination', 'completed', 'cancelled'])->default('registered');
            $table->integer('queue_number')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
