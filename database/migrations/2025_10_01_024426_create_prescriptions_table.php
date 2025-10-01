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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('prescription_number')->unique();
            $table->foreignId('examination_id')->constrained('examinations');
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('doctor_id')->constrained('users');
            $table->date('prescribed_date');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'dispensed', 'partially_dispensed', 'cancelled'])->default('pending');
            $table->foreignId('dispensed_by')->nullable()->constrained('users');
            $table->timestamp('dispensed_at')->nullable();
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
