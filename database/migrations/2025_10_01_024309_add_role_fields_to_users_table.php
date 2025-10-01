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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->after('email')->constrained('roles');
            $table->string('phone')->nullable()->after('role_id');
            $table->text('address')->nullable()->after('phone');
            $table->enum('gender', ['male', 'female'])->nullable()->after('address');
            $table->date('birth_date')->nullable()->after('gender');
            $table->string('employee_id')->nullable()->unique()->after('birth_date');
            $table->boolean('is_active')->default(true)->after('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'phone', 'address', 'gender', 'birth_date', 'employee_id', 'is_active']);
        });
    }
};
