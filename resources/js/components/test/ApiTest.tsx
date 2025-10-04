import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loginStatus, setLoginStatus] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    // Test health endpoint
    api.get('/health')
      .then(response => {
        setHealthStatus(response.data);
      })
      .catch(error => {
        setHealthStatus({ error: error.message });
      });
  }, []);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/login', {
        email: 'admin@klinik.test',
        password: 'admin123'
      });
      
      setLoginStatus(response.data);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setToken(response.data.token);
      }
    } catch (error: any) {
      setLoginStatus({ error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  const testDashboard = async () => {
    if (!token) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/dashboard/admin');
      setDashboardData(response.data);
    } catch (error: any) {
      setDashboardData({ error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      {/* Health Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">API Health Status</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(healthStatus, null, 2)}
        </pre>
      </div>

      {/* Login Test */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Login Test</h2>
        <button 
          onClick={testLogin}
          disabled={loading}
          className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Login (admin@klinik.test)'}
        </button>
        {loginStatus && (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(loginStatus, null, 2)}
          </pre>
        )}
      </div>

      {/* Dashboard Test */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Dashboard API Test</h2>
        <div className="mb-2">
          <span className="text-sm">Token: {token ? '✅ Available' : '❌ Not available'}</span>
        </div>
        <button 
          onClick={testDashboard}
          disabled={loading || !token}
          className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Dashboard API'}
        </button>
        {dashboardData && (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ApiTest;