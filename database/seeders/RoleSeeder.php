<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'System administrator with full access to all features'
            ],
            [
                'name' => 'doctor',
                'display_name' => 'Dokter',
                'description' => 'Medical doctor who can examine patients and prescribe medications'
            ],
            [
                'name' => 'nurse',
                'display_name' => 'Perawat',
                'description' => 'Nurse who can perform patient screening and vital signs assessment'
            ],
            [
                'name' => 'pharmacist',
                'display_name' => 'Apoteker',
                'description' => 'Pharmacist who can dispense medications and manage pharmacy inventory'
            ],
            [
                'name' => 'patient',
                'display_name' => 'Pasien',
                'description' => 'Patient who can register for appointments and view medical records'
            ]
        ];

        foreach ($roles as $role) {
            \App\Models\Role::create($role);
        }
    }
}
