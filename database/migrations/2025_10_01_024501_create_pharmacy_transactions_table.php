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
        Schema::create('pharmacy_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->foreignId('prescription_id')->constrained('prescriptions');
            $table->foreignId('patient_id')->constrained('patients');
            $table->foreignId('pharmacist_id')->constrained('users');
            $table->enum('type', ['dispensing', 'stock_in', 'stock_out', 'adjustment'])->default('dispensing');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['unpaid', 'paid', 'partially_paid'])->default('unpaid');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_transactions');
    }
};
