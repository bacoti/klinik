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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->text('description')->nullable();
            $table->string('manufacturer')->nullable();
            $table->enum('form', ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'patch', 'other'])->default('tablet');
            $table->string('strength')->nullable(); // e.g., "500mg", "10ml"
            $table->string('unit')->default('tablet'); // tablet, ml, mg, etc.
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(10);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->date('expiry_date')->nullable();
            $table->string('batch_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('usage_instructions')->nullable();
            $table->text('side_effects')->nullable();
            $table->text('contraindications')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
