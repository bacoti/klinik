import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

interface UseRecentActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRecentActivities = (limit: number = 10): UseRecentActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      
      if (response.data.success) {
        setActivities(response.data.data);
      } else {
        setError('Failed to fetch recent activities');
      }
    } catch (err: any) {
      console.error('Recent activities error:', err);
      setError(err.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
};