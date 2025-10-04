import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface UpcomingAppointment {
  id: number;
  patient_name: string;
  patient_number: string;
  appointment_time: string;
  type: string;
  status: string;
  queue_number: number;
  chief_complaint: string;
}

interface UseUpcomingAppointmentsReturn {
  appointments: UpcomingAppointment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUpcomingAppointments = (limit: number = 5): UseUpcomingAppointmentsReturn => {
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/dashboard/appointments?limit=${limit}`);
      
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setError('Failed to fetch upcoming appointments');
      }
    } catch (err: any) {
      console.error('Upcoming appointments error:', err);
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [limit]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments
  };
};