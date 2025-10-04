<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Examination;
use App\Models\Prescription;
use App\Models\Medicine;
use App\Models\Screening;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class ClinicSampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample medicines first
        $medicines = [
            [
                'code' => 'MED001',
                'name' => 'Paracetamol 500mg',
                'generic_name' => 'Paracetamol',
                'description' => 'Pain reliever and fever reducer',
                'manufacturer' => 'Kimia Farma',
                'form' => 'tablet',
                'strength' => '500mg',
                'unit' => 'tablet',
                'stock_quantity' => 150,
                'minimum_stock' => 50,
                'unit_price' => 500,
                'expiry_date' => Carbon::now()->addMonths(18),
                'batch_number' => 'BTH001',
                'is_active' => true,
                'usage_instructions' => '3x sehari setelah makan',
            ],
            [
                'code' => 'MED002',
                'name' => 'Amoxicillin 250mg',
                'generic_name' => 'Amoxicillin',
                'description' => 'Antibiotic for bacterial infections',
                'manufacturer' => 'Sanbe Farma',
                'form' => 'capsule',
                'strength' => '250mg',
                'unit' => 'capsule',
                'stock_quantity' => 80,
                'minimum_stock' => 30,
                'unit_price' => 1200,
                'expiry_date' => Carbon::now()->addMonths(12),
                'batch_number' => 'BTH002',
                'is_active' => true,
                'usage_instructions' => '3x sehari sebelum makan',
            ],
            [
                'code' => 'MED003',
                'name' => 'Vitamin C 1000mg',
                'generic_name' => 'Ascorbic Acid',
                'description' => 'Vitamin C supplement',
                'manufacturer' => 'Kalbe Farma',
                'form' => 'tablet',
                'strength' => '1000mg',
                'unit' => 'tablet',
                'stock_quantity' => 25, // Low stock
                'minimum_stock' => 30,
                'unit_price' => 800,
                'expiry_date' => Carbon::now()->addMonths(24),
                'batch_number' => 'BTH003',
                'is_active' => true,
                'usage_instructions' => '1x sehari setelah makan',
            ],
            [
                'code' => 'MED004',
                'name' => 'Antacid Tablet',
                'generic_name' => 'Aluminum Hydroxide',
                'description' => 'Antacid for stomach acid',
                'manufacturer' => 'Dexa Medica',
                'form' => 'tablet',
                'strength' => '200mg',
                'unit' => 'tablet',
                'stock_quantity' => 45,
                'minimum_stock' => 20,
                'unit_price' => 300,
                'expiry_date' => Carbon::now()->subDays(10), // Expired
                'batch_number' => 'BTH004',
                'is_active' => true,
                'usage_instructions' => '2x sehari setelah makan',
            ],
        ];

        foreach ($medicines as $medicine) {
            Medicine::create($medicine);
        }

        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $doctorRole = Role::where('name', 'doctor')->first();
        $nurseRole = Role::where('name', 'nurse')->first();
        $pharmacistRole = Role::where('name', 'pharmacist')->first();

        // Create sample staff users (only if not exists)
        $admin = User::firstOrCreate(
            ['email' => 'admin@klinik.test'],
            [
                'name' => 'Dr. Admin Utama',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'phone' => '081234567890',
                'address' => 'Jl. Admin No. 1',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $doctors = [
            [
                'name' => 'Dr. Sarah Wijaya, Sp.PD',
                'email' => 'sarah.doctor@klinik.test',
                'password' => Hash::make('doctor123'),
                'role_id' => $doctorRole->id,
                'phone' => '081234567891',
                'address' => 'Jl. Dokter No. 1',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Ahmad Rizki, Sp.A',
                'email' => 'ahmad.doctor@klinik.test',
                'password' => Hash::make('doctor123'),
                'role_id' => $doctorRole->id,
                'phone' => '081234567892',
                'address' => 'Jl. Dokter No. 2',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        ];

        foreach ($doctors as $doctorData) {
            User::firstOrCreate(
                ['email' => $doctorData['email']],
                $doctorData
            );
        }

        $nurses = [
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurse@klinik.test',
                'password' => Hash::make('nurse123'),
                'role_id' => $nurseRole->id,
                'phone' => '081234567893',
                'address' => 'Jl. Perawat No. 1',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dewi Sartika',
                'email' => 'dewi.nurse@klinik.test',
                'password' => Hash::make('nurse123'),
                'role_id' => $nurseRole->id,
                'phone' => '081234567894',
                'address' => 'Jl. Perawat No. 2',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        ];

        foreach ($nurses as $nurseData) {
            User::firstOrCreate(
                ['email' => $nurseData['email']],
                $nurseData
            );
        }

        $pharmacist = User::firstOrCreate(
            ['email' => 'budi.pharmacist@klinik.test'],
            [
                'name' => 'Apt. Budi Santoso',
                'password' => Hash::make('pharmacist123'),
                'role_id' => $pharmacistRole->id,
                'phone' => '081234567895',
                'address' => 'Jl. Apoteker No. 1',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Get created users
        $doctor1 = User::where('email', 'sarah.doctor@klinik.test')->first();
        $doctor2 = User::where('email', 'ahmad.doctor@klinik.test')->first();
        $nurse1 = User::where('email', 'siti.nurse@klinik.test')->first();
        $nurse2 = User::where('email', 'dewi.nurse@klinik.test')->first();

        // Create sample patients
        $patients = [
            [
                'patient_number' => 'P' . str_pad(1, 6, '0', STR_PAD_LEFT),
                'name' => 'Ahmad Wijaya',
                'birth_date' => '1985-05-15',
                'birth_place' => 'Jakarta',
                'gender' => 'male',
                'phone' => '081234567896',
                'address' => 'Jl. Pasien No. 1, Jakarta',
                'emergency_contact_name' => 'Siti Wijaya',
                'emergency_contact_phone' => '081234567897',
                'blood_type' => 'A+',
                'allergies' => 'Seafood',
                'status' => 'active',
                'registered_by' => $nurse1->id,
                'created_at' => Carbon::now()->subDays(30),
            ],
            [
                'patient_number' => 'P' . str_pad(2, 6, '0', STR_PAD_LEFT),
                'name' => 'Maria Santos',
                'birth_date' => '1990-08-22',
                'birth_place' => 'Bandung',
                'gender' => 'female',
                'phone' => '081234567898',
                'address' => 'Jl. Pasien No. 2, Jakarta',
                'emergency_contact_name' => 'Jose Santos',
                'emergency_contact_phone' => '081234567899',
                'blood_type' => 'B+',
                'allergies' => null,
                'status' => 'active',
                'registered_by' => $nurse1->id,
                'created_at' => Carbon::now()->subDays(25),
            ],
            [
                'patient_number' => 'P' . str_pad(3, 6, '0', STR_PAD_LEFT),
                'name' => 'Budi Pramono',
                'birth_date' => '1978-12-10',
                'birth_place' => 'Surabaya',
                'gender' => 'male',
                'phone' => '081234567900',
                'address' => 'Jl. Pasien No. 3, Jakarta',
                'emergency_contact_name' => 'Rina Pramono',
                'emergency_contact_phone' => '081234567901',
                'blood_type' => 'O+',
                'allergies' => 'Penicillin',
                'status' => 'active',
                'registered_by' => $nurse2->id,
                'created_at' => Carbon::now()->subDays(20),
            ],
        ];

        foreach ($patients as $patientData) {
            Patient::create($patientData);
        }

        // Get created patients
        $patient1 = Patient::where('patient_number', 'P000001')->first();
        $patient2 = Patient::where('patient_number', 'P000002')->first();
        $patient3 = Patient::where('patient_number', 'P000003')->first();

        // Create sample appointments for today and recent days
        $appointments = [
            // Today's appointments
            [
                'patient_id' => $patient1->id,
                'appointment_date' => Carbon::today(),
                'appointment_time' => '08:00:00',
                'type' => 'general_checkup',
                'chief_complaint' => 'Demam dan batuk sejak 3 hari',
                'status' => 'registered',
                'queue_number' => 1,
                'notes' => 'Pasien sudah registrasi',
                'created_by' => $nurse1->id,
                'created_at' => Carbon::today()->setTime(7, 0),
            ],
            [
                'patient_id' => $patient2->id,
                'appointment_date' => Carbon::today(),
                'appointment_time' => '09:00:00',
                'type' => 'follow_up',
                'chief_complaint' => 'Kontrol tekanan darah',
                'status' => 'waiting',
                'queue_number' => 2,
                'notes' => 'Pasien sudah menunggu',
                'created_by' => $nurse1->id,
                'created_at' => Carbon::today()->setTime(8, 30),
            ],
            [
                'patient_id' => $patient3->id,
                'appointment_date' => Carbon::today(),
                'appointment_time' => '10:00:00',
                'type' => 'consultation',
                'chief_complaint' => 'Sakit kepala berkepanjangan',
                'status' => 'screening',
                'queue_number' => 3,
                'notes' => 'Sedang proses screening',
                'created_by' => $nurse2->id,
                'created_at' => Carbon::today()->setTime(9, 15),
            ],
            // Yesterday's completed appointments
            [
                'patient_id' => $patient1->id,
                'appointment_date' => Carbon::yesterday(),
                'appointment_time' => '14:00:00',
                'type' => 'general_checkup',
                'chief_complaint' => 'Checkup rutin',
                'status' => 'completed',
                'queue_number' => 1,
                'notes' => 'Selesai pemeriksaan',
                'created_by' => $nurse1->id,
                'created_at' => Carbon::yesterday()->setTime(13, 30),
            ],
        ];

        foreach ($appointments as $appointmentData) {
            Appointment::create($appointmentData);
        }

        // Create screenings for today
        $todayAppointments = Appointment::whereDate('appointment_date', Carbon::today())->get();
        
        foreach ($todayAppointments as $appointment) {
            if (in_array($appointment->status, ['waiting', 'screening', 'examination'])) {
                Screening::create([
                    'appointment_id' => $appointment->id,
                    'patient_id' => $appointment->patient_id,
                    'nurse_id' => $nurse1->id,
                    'height' => rand(150, 180),
                    'weight' => rand(50, 80),
                    'blood_pressure_systolic' => rand(110, 140),
                    'blood_pressure_diastolic' => rand(70, 90),
                    'heart_rate' => rand(60, 100),
                    'temperature' => rand(36, 38) + (rand(0, 9) / 10),
                    'respiratory_rate' => rand(16, 24),
                    'oxygen_saturation' => rand(95, 100),
                    'priority' => $appointment->queue_number == 3 ? 'high' : 'normal',
                    'notes' => 'Vital signs normal',
                    'screened_at' => Carbon::now()->subHours(rand(1, 3)),
                ]);
            }
        }

        // Create examinations for completed appointments
        $completedAppointment = Appointment::where('status', 'completed')->first();
        if ($completedAppointment) {
            $examination = Examination::create([
                'appointment_id' => $completedAppointment->id,
                'patient_id' => $completedAppointment->patient_id,
                'doctor_id' => $doctor1->id,
                'chief_complaint' => $completedAppointment->chief_complaint,
                'history_of_present_illness' => 'Pasien mengeluh demam sejak 3 hari disertai batuk',
                'physical_examination' => 'TD: 120/80 mmHg, Nadi: 84x/menit, Suhu: 37.2°C',
                'diagnosis_primary' => 'ISPA (Infeksi Saluran Pernapasan Atas)',
                'diagnosis_secondary' => null,
                'treatment_plan' => 'Istirahat, minum obat sesuai resep',
                'follow_up_required' => true,
                'follow_up_date' => Carbon::now()->addDays(7),
                'notes' => 'Pasien disarankan kontrol 1 minggu lagi',
                'examined_at' => Carbon::yesterday()->setTime(14, 30),
            ]);

            // Create prescription for the examination
            Prescription::create([
                'examination_id' => $examination->id,
                'patient_id' => $examination->patient_id,
                'doctor_id' => $examination->doctor_id,
                'medicines' => json_encode([
                    [
                        'medicine_id' => 1,
                        'name' => 'Paracetamol 500mg',
                        'quantity' => 10,
                        'dosage' => '3x1 tablet setelah makan',
                        'unit_price' => 500,
                        'total' => 5000
                    ],
                    [
                        'medicine_id' => 2,
                        'name' => 'Amoxicillin 250mg',
                        'quantity' => 15,
                        'dosage' => '3x1 kapsul sebelum makan',
                        'unit_price' => 1200,
                        'total' => 18000
                    ]
                ]),
                'total_amount' => 23000,
                'status' => 'dispensed',
                'notes' => 'Obat diminum sampai habis',
                'dispensed_by' => $pharmacist->id,
                'dispensed_at' => Carbon::yesterday()->setTime(15, 0),
            ]);
        }

        // Create some pending prescriptions
        for ($i = 0; $i < 3; $i++) {
            Prescription::create([
                'examination_id' => null, // Pending examination
                'patient_id' => $patient2->id,
                'doctor_id' => $doctor2->id,
                'medicines' => json_encode([
                    [
                        'medicine_id' => 3,
                        'name' => 'Vitamin C 1000mg',
                        'quantity' => 30,
                        'dosage' => '1x1 tablet setelah makan',
                        'unit_price' => 800,
                        'total' => 24000
                    ]
                ]),
                'total_amount' => 24000,
                'status' => 'pending',
                'notes' => 'Resep menunggu persetujuan',
                'dispensed_by' => null,
                'dispensed_at' => null,
                'created_at' => Carbon::now()->subHours(rand(1, 6)),
            ]);
        }

        $this->command->info('✅ Sample clinic data created successfully!');
        $this->command->info('👥 Created users:');
        $this->command->info('   - Admin: admin@klinik.test (admin123)');
        $this->command->info('   - Doctor: sarah.doctor@klinik.test (doctor123)');
        $this->command->info('   - Doctor: ahmad.doctor@klinik.test (doctor123)'); 
        $this->command->info('   - Nurse: siti.nurse@klinik.test (nurse123)');
        $this->command->info('   - Nurse: dewi.nurse@klinik.test (nurse123)');
        $this->command->info('   - Pharmacist: budi.pharmacist@klinik.test (pharmacist123)');
        $this->command->info('📋 Created 3 patients with appointments');
        $this->command->info('💊 Created 4 medicines (1 low stock, 1 expired)');
        $this->command->info('🎯 Created today\'s appointments and activities');
    }
}
