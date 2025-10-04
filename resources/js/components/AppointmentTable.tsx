import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, UserCheck, AlertCircle, Trash2, Edit, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'normal' | 'urgent' | 'emergency';
  symptoms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: Appointment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface AppointmentTableProps {
  refreshTrigger?: number;
  onAppointmentUpdate?: (appointment: Appointment) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  refreshTrigger = 0,
  onAppointmentUpdate 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // Fetch appointments
  const fetchAppointments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(dateFilter && { date: dateFilter })
      });

      const response = await fetch(`/api/appointments?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setAppointments(data.data || []);
      setCurrentPage(data.meta.current_page);
      setTotalPages(data.meta.last_page);
      setTotalAppointments(data.meta.total);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedAppointment = await response.json();
      
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: status as any }
            : appointment
        )
      );

      // Call callback if provided
      if (onAppointmentUpdate) {
        onAppointmentUpdate(updatedAppointment);
      }

      setShowStatusModal(false);
      setSelectedAppointment(null);
      setNewStatus('');
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update appointment status');
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from local state
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
      setTotalAppointments(prev => prev - 1);
      
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    }
  };

  // Effects
  useEffect(() => {
    fetchAppointments(1);
  }, [refreshTrigger, searchTerm, statusFilter, priorityFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'bg-green-100 text-green-800',
      urgent: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchAppointments(1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Appointment
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama pasien, dokter, atau gejala..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="scheduled">Dijadwalkan</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="in_progress">Sedang Berlangsung</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="no_show">Tidak Hadir</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioritas
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Prioritas</option>
              <option value="normal">Normal</option>
              <option value="urgent">Mendesak</option>
              <option value="emergency">Darurat</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Appointment ({totalAppointments})
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
          </div>
        </div>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pasien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dokter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gejala
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {appointment.doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.doctor.specialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.appointment_date)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(appointment.appointment_time)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'scheduled' && 'Dijadwalkan'}
                        {appointment.status === 'confirmed' && 'Dikonfirmasi'}
                        {appointment.status === 'in_progress' && 'Berlangsung'}
                        {appointment.status === 'completed' && 'Selesai'}
                        {appointment.status === 'cancelled' && 'Dibatalkan'}
                        {appointment.status === 'no_show' && 'Tidak Hadir'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appointment.priority)}`}>
                        {appointment.priority === 'normal' && 'Normal'}
                        {appointment.priority === 'urgent' && 'Mendesak'}
                        {appointment.priority === 'emergency' && 'Darurat'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {appointment.symptoms}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setNewStatus(appointment.status);
                            setShowStatusModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Update Status"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Hapus Appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada appointment</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || dateFilter
                ? 'Tidak ada appointment yang sesuai dengan filter yang dipilih.'
                : 'Belum ada appointment yang dijadwalkan.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalAppointments)} dari {totalAppointments} appointment
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Status Update Modal */}
      {showStatusModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <Edit className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Update Status Appointment</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Pasien: <span className="font-medium">{selectedAppointment.patient.name}</span>
              </p>
              <p className="text-gray-600 mb-4">
                Dokter: <span className="font-medium">Dr. {selectedAppointment.doctor.name}</span>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="scheduled">Dijadwalkan</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="in_progress">Sedang Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="no_show">Tidak Hadir</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => updateAppointmentStatus(selectedAppointment.id, newStatus)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedAppointment(null);
                  setNewStatus('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Konfirmasi Hapus Appointment</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Apakah Anda yakin ingin menghapus appointment ini?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Pasien:</strong> {selectedAppointment.patient.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Dokter:</strong> Dr. {selectedAppointment.doctor.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tanggal:</strong> {formatDate(selectedAppointment.appointment_date)} - {formatTime(selectedAppointment.appointment_time)}
                </p>
              </div>
              <p className="text-red-600 text-sm mt-2">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => deleteAppointment(selectedAppointment.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Appointment
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;