<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        $doctorRole = \App\Models\Role::where('name', 'doctor')->first();
        $nurseRole = \App\Models\Role::where('name', 'nurse')->first();
        $pharmacistRole = \App\Models\Role::where('name', 'pharmacist')->first();

        $users = [
            [
                'name' => 'Administrator',
                'email' => 'admin@klinik.com',
                'password' => bcrypt('password123'),
                'role_id' => $adminRole->id,
                'phone' => '081234567890',
                'address' => 'Jl. Admin No. 1, Jakarta',
                'gender' => 'male',
                'birth_date' => '1980-01-01',
                'employee_id' => 'ADM001',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Budi Santoso',
                'email' => 'dokter@klinik.com',
                'password' => bcrypt('password123'),
                'role_id' => $doctorRole->id,
                'phone' => '081234567891',
                'address' => 'Jl. Dokter No. 1, Jakarta',
                'gender' => 'male',
                'birth_date' => '1975-05-15',
                'employee_id' => 'DOC001',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sari Nurse',
                'email' => 'perawat@klinik.com',
                'password' => bcrypt('password123'),
                'role_id' => $nurseRole->id,
                'phone' => '081234567892',
                'address' => 'Jl. Perawat No. 1, Jakarta',
                'gender' => 'female',
                'birth_date' => '1985-08-20',
                'employee_id' => 'NUR001',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Apt. Dewi Farmasi',
                'email' => 'apoteker@klinik.com',
                'password' => bcrypt('password123'),
                'role_id' => $pharmacistRole->id,
                'phone' => '081234567893',
                'address' => 'Jl. Farmasi No. 1, Jakarta',
                'gender' => 'female',
                'birth_date' => '1982-12-10',
                'employee_id' => 'PHR001',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
