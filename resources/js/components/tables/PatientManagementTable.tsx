import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import PatientRegistrationForm from '@/components/forms/PatientRegistrationForm';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: 'male' | 'female';
  birth_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type: string;
  allergies: string;
  medical_history: string;
  insurance_number: string;
  insurance_provider: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PatientManagementTableProps {
  onPatientSelect?: (patient: Patient) => void;
  showActions?: boolean;
}

const PatientManagementTable: React.FC<PatientManagementTableProps> = ({
  onPatientSelect,
  showActions = true
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/patients?${params}`);
      
      if (response.data.success) {
        setPatients(response.data.data.data || response.data.data);
        setTotalPages(response.data.data.last_page || 1);
      }
    } catch (error: any) {
      console.error('Failed to fetch patients:', error);
      setError(error.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (patientId: number) => {
    if (!confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await api.delete(`/patients/${patientId}`);
      fetchPatients();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete patient');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPatients.length === 0) {
      alert('Please select patients to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedPatients.length} patients?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedPatients.map(id => api.delete(`/patients/${id}`))
      );
      setSelectedPatients([]);
      fetchPatients();
    } catch (error: any) {
      alert('Failed to delete some patients');
    }
  };

  const handleFormSuccess = (_patient: Patient) => {
    setShowForm(false);
    setEditingPatient(null);
    fetchPatients();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(patients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId: number, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingPatient(null);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Patient List
          </button>
        </div>
        
        <PatientRegistrationForm
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Patient Management</CardTitle>
          {showActions && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add New Patient
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search patients by name, phone, or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {selectedPatients.length > 0 && showActions && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Selected ({selectedPatients.length})
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchPatients}
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
            <p className="text-gray-600">Loading patients...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  {showActions && (
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        checked={selectedPatients.length === patients.length && patients.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                      />
                    </th>
                  )}
                  <th className="text-left p-3 font-medium text-gray-900">Name</th>
                  <th className="text-left p-3 font-medium text-gray-900">Age/Gender</th>
                  <th className="text-left p-3 font-medium text-gray-900">Contact</th>
                  <th className="text-left p-3 font-medium text-gray-900">Emergency Contact</th>
                  <th className="text-left p-3 font-medium text-gray-900">Blood Type</th>
                  <th className="text-left p-3 font-medium text-gray-900">Status</th>
                  {showActions && (
                    <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={showActions ? 8 : 6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onPatientSelect?.(patient)}
                    >
                      {showActions && (
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedPatients.includes(patient.id)}
                            onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                            className="rounded"
                          />
                        </td>
                      )}
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-gray-900">{calculateAge(patient.birth_date)} years</p>
                          <p className="text-sm text-gray-500 capitalize">{patient.gender}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-gray-900">{patient.phone}</p>
                          {patient.email && (
                            <p className="text-sm text-gray-500">{patient.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-gray-900">{patient.emergency_contact_name || '-'}</p>
                          <p className="text-sm text-gray-500">{patient.emergency_contact_phone || '-'}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {patient.blood_type || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          patient.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {patient.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {showActions && (
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(patient)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(patient.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
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

export default PatientManagementTable;