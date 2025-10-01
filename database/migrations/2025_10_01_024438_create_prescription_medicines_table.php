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
        Schema::create('prescription_medicines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained('prescriptions')->onDelete('cascade');
            $table->foreignId('medicine_id')->constrained('medicines');
            $table->integer('quantity');
            $table->string('dosage'); // e.g., "1 tablet"
            $table->string('frequency'); // e.g., "3 times a day"
            $table->string('duration'); // e.g., "7 days"
            $table->text('instructions')->nullable(); // e.g., "after meals"
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->integer('dispensed_quantity')->default(0);
            $table->enum('status', ['pending', 'dispensed', 'partially_dispensed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescription_medicines');
    }
};
