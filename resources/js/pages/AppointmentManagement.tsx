import React, { useState, useEffect } from 'react';
import { Calendar, CalendarPlus, List, Clock, Users, UserCheck, AlertTriangle } from 'lucide-react';
import AppointmentBookingForm from '@/components/forms/AppointmentBookingForm';
import AppointmentTable from '@/components/AppointmentTable';
import { Card } from '@/components/ui/card';

type ViewMode = 'list' | 'add' | 'edit';

interface AppointmentStats {
  total: number;
  today: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  pending: number;
}

interface Appointment {
  id: number;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    id: number;
    name: string;
    specialization: string;
  };
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'normal' | 'urgent' | 'emergency';
  symptoms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const AppointmentManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    pending: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch appointment statistics
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/appointments/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Handle successful appointment booking
  const handleAppointmentBooked = (_appointment: Appointment) => {
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
    setSelectedAppointment(null);
    fetchStats(); // Refresh stats
  };

  // Handle appointment update
  const handleAppointmentUpdated = (_appointment: Appointment) => {
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
    setSelectedAppointment(null);
    fetchStats(); // Refresh stats
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setSelectedAppointment(null);
    setViewMode('list');
  };

  // Get today's date string
  const getTodayString = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manajemen Appointment
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola jadwal appointment, booking baru, dan update status appointment
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getTodayString()}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedAppointment(null);
                }}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                Daftar Appointment
              </button>
              <button
                onClick={() => {
                  setViewMode('add');
                  setSelectedAppointment(null);
                }}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'add'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Booking Appointment
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
                  <span className="text-gray-500">Manajemen Appointment</span>
                </div>
              </li>
              {viewMode === 'add' && (
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-blue-600 font-medium">Booking Appointment</span>
                  </div>
                </li>
              )}
              {viewMode === 'edit' && selectedAppointment && (
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-blue-600 font-medium">Edit Appointment</span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        </div>

        {/* Statistics Cards (Only show in list view) */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.total}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.today}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Dijadwalkan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.scheduled}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.completed}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Dibatalkan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.cancelled}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? '-' : stats.pending}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions (Only show in list view) */}
        {viewMode === 'list' && (
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setViewMode('add')}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <CalendarPlus className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-green-900">Booking Baru</p>
                    <p className="text-sm text-green-700">Buat appointment baru</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // Filter untuk appointment hari ini
                    // Implementasi filter akan ditambahkan di AppointmentTable
                  }}
                  className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Clock className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">Appointment Hari Ini</p>
                    <p className="text-sm text-blue-700">Lihat jadwal hari ini</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // Refresh data
                    setRefreshTrigger(prev => prev + 1);
                    fetchStats();
                  }}
                  className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="h-6 w-6 text-gray-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Refresh Data</p>
                    <p className="text-sm text-gray-700">Perbarui semua data</p>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* List View - Appointment Table */}
          {viewMode === 'list' && (
            <AppointmentTable
              refreshTrigger={refreshTrigger}
              onAppointmentUpdate={handleAppointmentUpdated}
            />
          )}

          {/* Add View - Appointment Booking Form */}
          {viewMode === 'add' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <CalendarPlus className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Booking Appointment Baru
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Lengkapi form di bawah untuk membuat appointment baru
                    </p>
                  </div>
                </div>
                
                <AppointmentBookingForm
                  onSuccess={handleAppointmentBooked}
                  onCancel={() => setViewMode('list')}
                />
              </Card>
            </div>
          )}

          {/* Edit View - Appointment Update Form */}
          {viewMode === 'edit' && selectedAppointment && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Edit Appointment
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Update appointment untuk: <span className="font-medium">{selectedAppointment.patient.name}</span>
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
                
                <AppointmentBookingForm
                  onSuccess={handleAppointmentUpdated}
                  onCancel={handleCancelEdit}
                />
              </Card>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-12">
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Panduan Manajemen Appointment
                </h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• <strong>Daftar Appointment:</strong> Lihat semua appointment, filter berdasarkan status, tanggal, atau prioritas</li>
                  <li>• <strong>Booking Baru:</strong> Buat appointment baru dengan memilih pasien, dokter, dan waktu yang tersedia</li>
                  <li>• <strong>Update Status:</strong> Ubah status appointment (dijadwalkan, dikonfirmasi, selesai, dibatalkan)</li>
                  <li>• <strong>Prioritas:</strong> Atur prioritas appointment (normal, mendesak, darurat)</li>
                  <li>• <strong>Pencarian:</strong> Cari appointment berdasarkan nama pasien, dokter, atau gejala</li>
                  <li>• <strong>Filter Tanggal:</strong> Filter appointment berdasarkan tanggal tertentu</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;