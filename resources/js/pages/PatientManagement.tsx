import React, { useState } from 'react';
import { Users, UserPlus, List, Search } from 'lucide-react';
import PatientRegistrationForm from '@/components/forms/PatientRegistrationForm';
import PatientTable from '@/components/tables/PatientTable';
import { Card } from '@/components/ui/card';

type ViewMode = 'list' | 'add' | 'edit';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  address: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const PatientManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle successful patient registration
  const handlePatientRegistered = (_patient: Patient) => {
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
    setSelectedPatient(null);
  };

  // Handle patient update
  const handlePatientUpdated = (_patient: Patient) => {
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
    setSelectedPatient(null);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setSelectedPatient(null);
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manajemen Pasien
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola data pasien, registrasi baru, dan update informasi pasien
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedPatient(null);
                }}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                Daftar Pasien
              </button>
              <button
                onClick={() => {
                  setViewMode('add');
                  setSelectedPatient(null);
                }}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'add'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pasien
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <span className="text-gray-500">Dashboard</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-300 mx-2">/</span>
                  <span className="text-gray-500">Manajemen Pasien</span>
                </div>
              </li>
              {viewMode === 'add' && (
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-blue-600 font-medium">Tambah Pasien</span>
                  </div>
                </li>
              )}
              {viewMode === 'edit' && selectedPatient && (
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-blue-600 font-medium">Edit {selectedPatient.name}</span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        </div>

        {/* Statistics Cards (Only show in list view) */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Pasien</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pasien Baru</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Search className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Terverifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Belum Verifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* List View - Patient Table */}
          {viewMode === 'list' && (
            <PatientTable
              refreshTrigger={refreshTrigger}
            />
          )}

          {/* Add View - Patient Registration Form */}
          {viewMode === 'add' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <UserPlus className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Registrasi Pasien Baru
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Lengkapi form di bawah untuk mendaftarkan pasien baru
                    </p>
                  </div>
                </div>
                
                <PatientRegistrationForm
                  onSuccess={handlePatientRegistered}
                  onCancel={() => setViewMode('list')}
                />
              </Card>
            </div>
          )}

          {/* Edit View - Patient Update Form */}
          {viewMode === 'edit' && selectedPatient && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Edit Data Pasien
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Update informasi untuk: <span className="font-medium">{selectedPatient.name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Batal Edit
                  </button>
                </div>
                
                <PatientRegistrationForm
                  onSuccess={handlePatientUpdated}
                  onCancel={handleCancelEdit}
                />
              </Card>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-12">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Panduan Manajemen Pasien
                </h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• <strong>Daftar Pasien:</strong> Lihat semua pasien terdaftar, cari berdasarkan nama/email, dan kelola data pasien</li>
                  <li>• <strong>Tambah Pasien:</strong> Registrasi pasien baru dengan informasi lengkap termasuk riwayat medis</li>
                  <li>• <strong>Edit Pasien:</strong> Update informasi pasien yang sudah terdaftar</li>
                  <li>• <strong>Verifikasi:</strong> Verifikasi data pasien untuk memastikan keakuratan informasi</li>
                  <li>• <strong>Pencarian:</strong> Gunakan fitur pencarian untuk menemukan pasien dengan cepat</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;