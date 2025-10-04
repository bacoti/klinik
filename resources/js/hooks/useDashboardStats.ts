import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface AdminStats {
  total_patients: number;
  total_staff: number;
  todays_appointments: number;
  monthly_revenue: number;
  pending_appointments: number;
  active_doctors: number;
  low_stock_medicines: number;
  completed_examinations_today: number;
}

interface DoctorStats {
  todays_appointments: number;
  patients_in_queue: number;
  completed_today: number;
  weekly_examinations: number;
  pending_prescriptions: number;
  follow_up_required: number;
}

interface NurseStats {
  screenings_today: number;
  patients_waiting: number;
  priority_cases: number;
  completed_registrations: number;
  pending_screening: number;
  emergency_cases_today: number;
}

interface PharmacistStats {
  pending_prescriptions: number;
  dispensed_today: number;
  low_stock_alerts: number;
  monthly_sales: number;
  expired_medicines: number;
  total_medicines: number;
  partially_dispensed: number;
}

type DashboardStats = AdminStats | DoctorStats | NurseStats | PharmacistStats;

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user?.role?.name) {
      setError('User role not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const endpoint = `/dashboard/${user.role.name}`;
      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role?.name) {
      fetchStats();
    }
  }, [user?.role?.name]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Type guards untuk membantu TypeScript
export const isAdminStats = (stats: DashboardStats): stats is AdminStats => {
  return 'total_patients' in stats;
};

export const isDoctorStats = (stats: DashboardStats): stats is DoctorStats => {
  return 'patients_in_queue' in stats;
};

export const isNurseStats = (stats: DashboardStats): stats is NurseStats => {
  return 'screenings_today' in stats;
};

export const isPharmacistStats = (stats: DashboardStats): stats is PharmacistStats => {
  return 'dispensed_today' in stats;
};