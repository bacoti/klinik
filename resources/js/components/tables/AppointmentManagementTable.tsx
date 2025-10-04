import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import AppointmentBookingForm from '@/components/forms/AppointmentBookingForm';

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  chief_complaint: string;
  notes: string;
  priority: 'normal' | 'urgent' | 'emergency';
  created_at: string;
  updated_at: string;
  patient: {
    id: number;
    name: string;
    phone: string;
    email?: string;
  };
  doctor: {
    id: number;
    name: string;
    specialization: string;
  };
}

interface AppointmentManagementTableProps {
  doctorId?: number; // Filter by specific doctor
  patientId?: number; // Filter by specific patient
  showActions?: boolean;
}

const AppointmentManagementTable: React.FC<AppointmentManagementTableProps> = ({
  doctorId,
  patientId,
  showActions = true
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, searchTerm, statusFilter, dateFilter, doctorId, patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(dateFilter && { date: dateFilter }),
        ...(doctorId && { doctor_id: doctorId.toString() }),
        ...(patientId && { patient_id: patientId.toString() })
      });

      const response = await api.get(`/appointments?${params}`);
      
      if (response.data.success) {
        setAppointments(response.data.data.data || response.data.data);
        setTotalPages(response.data.data.last_page || 1);
      }
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      setError(error.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update appointment status');
    }
  };

  const handleDelete = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchAppointments();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
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

  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return {
      date: appointmentDate.toLocaleDateString('id-ID'),
      time: appointmentDate.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(false);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointment List
          </button>
        </div>
        
        <AppointmentBookingForm
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
          }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Appointment Management</CardTitle>
          {showActions && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Book New Appointment
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Date & Time</th>
                  <th className="text-left p-3 font-medium text-gray-900">Patient</th>
                  <th className="text-left p-3 font-medium text-gray-900">Doctor</th>
                  <th className="text-left p-3 font-medium text-gray-900">Chief Complaint</th>
                  <th className="text-left p-3 font-medium text-gray-900">Priority</th>
                  <th className="text-left p-3 font-medium text-gray-900">Status</th>
                  {showActions && (
                    <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={showActions ? 7 : 6} className="text-center py-8 text-gray-500">
                      {searchTerm || statusFilter !== 'all' || dateFilter 
                        ? 'No appointments found matching your filters' 
                        : 'No appointments scheduled yet'}
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => {
                    const { date, time } = formatDateTime(appointment.appointment_date, appointment.appointment_time);
                    
                    return (
                      <tr
                        key={appointment.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{date}</p>
                            <p className="text-sm text-gray-500">{time}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patient.name}</p>
                            <p className="text-sm text-gray-500">{appointment.patient.phone}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctor.name}</p>
                            <p className="text-sm text-gray-500">{appointment.doctor.specialization}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-gray-900 max-w-xs truncate" title={appointment.chief_complaint}>
                            {appointment.chief_complaint}
                          </p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(appointment.priority)}`}>
                            {appointment.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          {showActions ? (
                            <select
                              value={appointment.status}
                              onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-sm border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(appointment.status)}`}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no_show">No Show</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                              {appointment.status.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        {showActions && (
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDelete(appointment.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentManagementTable;