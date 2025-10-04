import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

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
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  is_verified: boolean;
}

interface PatientTableProps {
  onEdit?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
  refreshTrigger?: number;
}

const PatientTable: React.FC<PatientTableProps> = ({
  onEdit,
  onView,
  refreshTrigger
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; patient: Patient | null }>({
    show: false,
    patient: null
  });

  const fetchPatients = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await api.get('/patients', {
        params: {
          page,
          search: searchTerm,
          per_page: 10
        }
      });

      if (response.data.success) {
        setPatients(response.data.data.data || response.data.data);
        setTotalPages(response.data.data.last_page || 1);
        setCurrentPage(response.data.data.current_page || 1);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage, search);
  }, [currentPage, refreshTrigger]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPatients(1, search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModal.patient) return;

    try {
      const response = await api.delete(`/patients/${deleteModal.patient.id}`);
      
      if (response.data.success) {
        setDeleteModal({ show: false, patient: null });
        fetchPatients(currentPage, search);
      }
    } catch (error) {
      console.error('Failed to delete patient:', error);
    }
  };

  const handleVerify = async (patientId: number) => {
    try {
      const response = await api.post(`/patients/${patientId}/verify`);
      
      if (response.data.success) {
        fetchPatients(currentPage, search);
      }
    } catch (error) {
      console.error('Failed to verify patient:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading patients...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <div className="flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold">Age/Gender</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Registered</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{patient.phone}</p>
                          <p className="text-xs text-gray-600 truncate max-w-32">
                            {patient.address}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{calculateAge(patient.birth_date)} years</p>
                          <p className="text-xs text-gray-600 capitalize">{patient.gender}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          patient.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{formatDate(patient.created_at)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => onView?.(patient)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onEdit?.(patient)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Edit Patient"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {!patient.is_verified && (
                            <button
                              onClick={() => handleVerify(patient.id)}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                              title="Verify Patient"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteModal({ show: true, patient })}
                            className="text-red-600 hover:text-red-800 text-sm"
                            title="Delete Patient"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                ← Previous
              </button>
              
              {renderPagination()}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete patient "{deleteModal.patient?.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, patient: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientTable;