import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, Phone, Mail, MapPin, User, Heart, Activity, FileText, Plus, Edit, X } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getDoctorSidebarItems } from '../../config/doctorSidebar';

// Types
interface Patient {
  id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female';
  phoneNumber: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
  nextAppointment?: string;
  totalVisits: number;
  status: 'active' | 'inactive' | 'follow_up_needed';
  riskLevel: 'low' | 'medium' | 'high';
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
}

interface Visit {
  id: string;
  date: string;
  time: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  prescriptions: string[];
  followUpDate?: string;
  status: 'completed' | 'ongoing' | 'follow_up_scheduled';
  vitalSigns: {
    bloodPressure: string;
    temperature: number;
    heartRate: number;
    weight: number;
    height: number;
  };
  notes?: string;
}

interface PatientStats {
  totalPatients: number;
  activePatients: number;
  followUpNeeded: number;
  highRiskPatients: number;
}

const MyPatients: React.FC = () => {
  const sidebarItems = getDoctorSidebarItems("/doctor/patients");
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientVisits, setPatientVisits] = useState<Visit[]>([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'visits' | 'medical'>('info');
  
  // New patient form state
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceValidUntil: ''
  });

  // Edit patient form state
  const [editPatientForm, setEditPatientForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceValidUntil: ''
  });
  
  const [stats, setStats] = useState<PatientStats>({
    totalPatients: 0,
    activePatients: 0,
    followUpNeeded: 0,
    highRiskPatients: 0
  });

  const patientsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: 'PAT001',
        patientId: 'P001',
        fullName: 'Ahmad Wijaya',
        dateOfBirth: '1978-05-15',
        age: 46,
        gender: 'male',
        phoneNumber: '081234567890',
        email: 'ahmad.wijaya@email.com',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        emergencyContact: {
          name: 'Siti Wijaya',
          relationship: 'Istri',
          phoneNumber: '081234567891'
        },
        bloodType: 'O+',
        allergies: ['Penisilin', 'Kacang'],
        chronicConditions: ['Hipertensi', 'Diabetes Tipe 2'],
        lastVisit: '2025-01-03',
        nextAppointment: '2025-01-15',
        totalVisits: 15,
        status: 'active',
        riskLevel: 'high',
        insurance: {
          provider: 'BPJS Kesehatan',
          policyNumber: '0001234567890',
          validUntil: '2025-12-31'
        }
      },
      {
        id: 'PAT002',
        patientId: 'P002',
        fullName: 'Sari Dewi',
        dateOfBirth: '1992-08-22',
        age: 32,
        gender: 'female',
        phoneNumber: '081234567892',
        email: 'sari.dewi@email.com',
        address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
        emergencyContact: {
          name: 'Budi Dewi',
          relationship: 'Suami',
          phoneNumber: '081234567893'
        },
        bloodType: 'A+',
        allergies: ['Sulfa'],
        chronicConditions: [],
        lastVisit: '2025-01-04',
        totalVisits: 8,
        status: 'active',
        riskLevel: 'low'
      },
      {
        id: 'PAT003',
        patientId: 'P003',
        fullName: 'Budi Santoso',
        dateOfBirth: '1985-03-10',
        age: 39,
        gender: 'male',
        phoneNumber: '081234567894',
        address: 'Jl. Thamrin No. 78, Jakarta Pusat',
        emergencyContact: {
          name: 'Maria Santoso',
          relationship: 'Istri',
          phoneNumber: '081234567895'
        },
        bloodType: 'B+',
        allergies: [],
        chronicConditions: ['Asma'],
        lastVisit: '2024-12-20',
        totalVisits: 12,
        status: 'follow_up_needed',
        riskLevel: 'medium'
      },
      {
        id: 'PAT004',
        patientId: 'P004',
        fullName: 'Maria Gonzales',
        dateOfBirth: '1960-11-08',
        age: 64,
        gender: 'female',
        phoneNumber: '081234567896',
        address: 'Jl. Kuningan No. 12, Jakarta Selatan',
        emergencyContact: {
          name: 'Carlos Gonzales',
          relationship: 'Anak',
          phoneNumber: '081234567897'
        },
        bloodType: 'AB+',
        allergies: ['Aspirin'],
        chronicConditions: ['Hipertensi', 'Arthritis'],
        lastVisit: '2025-01-02',
        nextAppointment: '2025-01-20',
        totalVisits: 25,
        status: 'active',
        riskLevel: 'high'
      },
      {
        id: 'PAT005',
        patientId: 'P005',
        fullName: 'Robert Johnson',
        dateOfBirth: '1988-07-14',
        age: 36,
        gender: 'male',
        phoneNumber: '081234567898',
        email: 'robert.johnson@email.com',
        address: 'Jl. Senayan No. 56, Jakarta Pusat',
        emergencyContact: {
          name: 'Lisa Johnson',
          relationship: 'Istri',
          phoneNumber: '081234567899'
        },
        bloodType: 'O-',
        allergies: [],
        chronicConditions: [],
        lastVisit: '2025-01-05',
        totalVisits: 5,
        status: 'active',
        riskLevel: 'low'
      }
    ];

    const mockVisits: Visit[] = [
      {
        id: 'V001',
        date: '2025-01-03',
        time: '10:00',
        chiefComplaint: 'Kontrol diabetes dan hipertensi rutin',
        diagnosis: 'Diabetes Mellitus Tipe 2 terkontrol, Hipertensi Grade 1',
        treatment: 'Lanjutkan terapi, diet rendah gula dan garam',
        prescriptions: ['Metformin 500mg 2x1', 'Amlodipine 5mg 1x1'],
        followUpDate: '2025-01-15',
        status: 'completed',
        vitalSigns: {
          bloodPressure: '130/85',
          temperature: 36.5,
          heartRate: 78,
          weight: 72,
          height: 168
        },
        notes: 'Pasien patuh minum obat, gula darah terkontrol baik'
      },
      {
        id: 'V002',
        date: '2024-12-15',
        time: '14:30',
        chiefComplaint: 'Kontrol diabetes rutin',
        diagnosis: 'Diabetes Mellitus Tipe 2',
        treatment: 'Adjust medication dosage',
        prescriptions: ['Metformin 500mg 2x1'],
        status: 'completed',
        vitalSigns: {
          bloodPressure: '135/90',
          temperature: 36.8,
          heartRate: 82,
          weight: 73,
          height: 168
        }
      }
    ];

    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
    setPatientVisits(mockVisits);

    // Calculate stats
    const activeCount = mockPatients.filter(p => p.status === 'active').length;
    const followUpCount = mockPatients.filter(p => p.status === 'follow_up_needed').length;
    const highRiskCount = mockPatients.filter(p => p.riskLevel === 'high').length;

    setStats({
      totalPatients: mockPatients.length,
      activePatients: activeCount,
      followUpNeeded: followUpCount,
      highRiskPatients: highRiskCount
    });
  }, []);

  // Filter patients
  useEffect(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phoneNumber.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, riskFilter, patients]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + patientsPerPage);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('info');
    setShowPatientModal(true);
  };

  const handleViewVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowVisitModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'follow_up_needed': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveNewPatient = () => {
    if (!newPatientForm.fullName || !newPatientForm.dateOfBirth || !newPatientForm.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newPatient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      patientId: `PAT-${new Date().getFullYear()}-${String(patients.length + 1).padStart(4, '0')}`,
      fullName: newPatientForm.fullName,
      dateOfBirth: newPatientForm.dateOfBirth,
      age: calculateAge(newPatientForm.dateOfBirth),
      gender: newPatientForm.gender,
      phoneNumber: newPatientForm.phoneNumber,
      email: newPatientForm.email || undefined,
      address: newPatientForm.address,
      emergencyContact: {
        name: newPatientForm.emergencyContactName,
        relationship: newPatientForm.emergencyContactRelationship,
        phoneNumber: newPatientForm.emergencyContactPhone
      },
      bloodType: newPatientForm.bloodType,
      allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map(a => a.trim()) : [],
      chronicConditions: newPatientForm.chronicConditions ? newPatientForm.chronicConditions.split(',').map(c => c.trim()) : [],
      lastVisit: '',
      totalVisits: 0,
      status: 'active',
      riskLevel: 'low',
      insurance: newPatientForm.insuranceProvider ? {
        provider: newPatientForm.insuranceProvider,
        policyNumber: newPatientForm.insurancePolicyNumber,
        validUntil: newPatientForm.insuranceValidUntil
      } : undefined
    };

    setPatients(prev => [...prev, newPatient]);
    setShowAddPatientModal(false);
    
    // Reset form
    setNewPatientForm({
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceValidUntil: ''
    });
    
    alert('Patient added successfully!');
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditPatientForm({
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phoneNumber: patient.phoneNumber,
      email: patient.email || '',
      address: patient.address,
      emergencyContactName: patient.emergencyContact.name,
      emergencyContactRelationship: patient.emergencyContact.relationship,
      emergencyContactPhone: patient.emergencyContact.phoneNumber,
      bloodType: patient.bloodType,
      allergies: patient.allergies.join(', '),
      chronicConditions: patient.chronicConditions.join(', '),
      insuranceProvider: patient.insurance?.provider || '',
      insurancePolicyNumber: patient.insurance?.policyNumber || '',
      insuranceValidUntil: patient.insurance?.validUntil || ''
    });
    setShowEditPatientModal(true);
  };

  const handleSaveEditPatient = () => {
    if (!editPatientForm.fullName || !editPatientForm.dateOfBirth || !editPatientForm.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedPatient) return;

    const updatedPatient: Patient = {
      ...selectedPatient,
      fullName: editPatientForm.fullName,
      dateOfBirth: editPatientForm.dateOfBirth,
      age: calculateAge(editPatientForm.dateOfBirth),
      gender: editPatientForm.gender,
      phoneNumber: editPatientForm.phoneNumber,
      email: editPatientForm.email || undefined,
      address: editPatientForm.address,
      emergencyContact: {
        name: editPatientForm.emergencyContactName,
        relationship: editPatientForm.emergencyContactRelationship,
        phoneNumber: editPatientForm.emergencyContactPhone
      },
      bloodType: editPatientForm.bloodType,
      allergies: editPatientForm.allergies ? editPatientForm.allergies.split(',').map(a => a.trim()) : [],
      chronicConditions: editPatientForm.chronicConditions ? editPatientForm.chronicConditions.split(',').map(c => c.trim()) : [],
      insurance: editPatientForm.insuranceProvider ? {
        provider: editPatientForm.insuranceProvider,
        policyNumber: editPatientForm.insurancePolicyNumber,
        validUntil: editPatientForm.insuranceValidUntil
      } : undefined
    };

    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
    setShowEditPatientModal(false);
    setSelectedPatient(null);
    
    alert('Patient updated successfully!');
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="My Patients">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
              <p className="text-gray-600 mt-1">Kelola dan pantau pasien yang ditangani</p>
            </div>
            <button 
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Patients</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activePatients}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-up Needed</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.followUpNeeded}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Risk</p>
                    <p className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama, ID pasien, atau nomor telepon..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="follow_up_needed">Follow-up Needed</option>
                </select>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Risk Level</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Patients List */}
          <Card>
            <CardHeader>
              <CardTitle>Patients List ({filteredPatients.length} patients)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Blood Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Conditions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Visit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Risk</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{patient.fullName}</div>
                            <div className="text-gray-500 text-xs">{patient.patientId} • {patient.age} years • {patient.gender}</div>
                            <div className="text-gray-500 text-xs">{patient.totalVisits} visits</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {patient.phoneNumber}
                            </div>
                            {patient.email && (
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {patient.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-red-600">{patient.bloodType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {patient.chronicConditions.length > 0 ? (
                              <div>
                                {patient.chronicConditions.slice(0, 2).map((condition, idx) => (
                                  <div key={idx} className="text-gray-600">{condition}</div>
                                ))}
                                {patient.chronicConditions.length > 2 && (
                                  <div className="text-gray-500 text-xs">+{patient.chronicConditions.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">{patient.lastVisit}</div>
                          {patient.nextAppointment && (
                            <div className="text-xs text-blue-600">Next: {patient.nextAppointment}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewPatient(patient)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + patientsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded-md ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Detail Modal */}
          {showPatientModal && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                  <button
                    onClick={() => setShowPatientModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'info'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Patient Info
                  </button>
                  <button
                    onClick={() => setActiveTab('visits')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'visits'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Visit History
                  </button>
                  <button
                    onClick={() => setActiveTab('medical')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'medical'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Medical Info
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="text-sm text-gray-900">{selectedPatient.fullName}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                            <div className="text-sm text-gray-900">{selectedPatient.patientId}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <div className="text-sm text-gray-900">{selectedPatient.dateOfBirth} ({selectedPatient.age} years old)</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <div className="text-sm text-gray-900 capitalize">{selectedPatient.gender}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                            <div className="text-sm font-medium text-red-600">{selectedPatient.bloodType}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="text-sm text-gray-900">{selectedPatient.phoneNumber}</div>
                          </div>
                          {selectedPatient.email && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <div className="text-sm text-gray-900">{selectedPatient.email}</div>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <div className="text-sm text-gray-900">{selectedPatient.address}</div>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Emergency Contact</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="text-sm text-gray-900">{selectedPatient.emergencyContact.name}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Relationship</label>
                            <div className="text-sm text-gray-900">{selectedPatient.emergencyContact.relationship}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="text-sm text-gray-900">{selectedPatient.emergencyContact.phoneNumber}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedPatient.insurance && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Provider</label>
                            <div className="text-sm text-gray-900">{selectedPatient.insurance.provider}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                            <div className="text-sm text-gray-900">{selectedPatient.insurance.policyNumber}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                            <div className="text-sm text-gray-900">{selectedPatient.insurance.validUntil}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'visits' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Visit History</h3>
                    {patientVisits.map((visit) => (
                      <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{visit.date} at {visit.time}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                                {visit.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2"><strong>Chief Complaint:</strong> {visit.chiefComplaint}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Diagnosis:</strong> {visit.diagnosis}</p>
                            <p className="text-sm text-gray-600"><strong>Treatment:</strong> {visit.treatment}</p>
                            {visit.followUpDate && (
                              <p className="text-sm text-blue-600 mt-2"><strong>Follow-up:</strong> {visit.followUpDate}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleViewVisit(visit)}
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'medical' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                          {selectedPatient.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.allergies.map((allergy, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No known allergies</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                          {selectedPatient.chronicConditions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.chronicConditions.map((condition, idx) => (
                                <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No chronic conditions</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Visits</label>
                        <div className="text-2xl font-bold text-blue-600">{selectedPatient.totalVisits}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Visit</label>
                        <div className="text-sm text-gray-900">{selectedPatient.lastVisit}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Risk Level</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedPatient.riskLevel)}`}>
                          {selectedPatient.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visit Detail Modal */}
          {showVisitModal && selectedVisit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
                  <button
                    onClick={() => setShowVisitModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <div className="text-sm text-gray-900">{selectedVisit.date} at {selectedVisit.time}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVisit.status)}`}>
                        {selectedVisit.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedVisit.chiefComplaint}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedVisit.diagnosis}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                    <div className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg">{selectedVisit.treatment}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vital Signs</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-red-900">Blood Pressure</div>
                        <div className="text-red-700">{selectedVisit.vitalSigns.bloodPressure} mmHg</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-orange-900">Temperature</div>
                        <div className="text-orange-700">{selectedVisit.vitalSigns.temperature}°C</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-900">Heart Rate</div>
                        <div className="text-green-700">{selectedVisit.vitalSigns.heartRate} bpm</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-purple-900">Weight</div>
                        <div className="text-purple-700">{selectedVisit.vitalSigns.weight} kg</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescriptions</label>
                    <div className="space-y-2">
                      {selectedVisit.prescriptions.map((prescription, idx) => (
                        <div key={idx} className="bg-purple-50 p-2 rounded-lg text-sm text-purple-800">
                          {prescription}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedVisit.followUpDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                      <div className="text-sm text-blue-600 font-medium">{selectedVisit.followUpDate}</div>
                    </div>
                  )}

                  {selectedVisit.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{selectedVisit.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add New Patient Modal */}
          {showAddPatientModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Patient</h2>
                  <button
                    onClick={() => setShowAddPatientModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.fullName}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newPatientForm.dateOfBirth}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={newPatientForm.gender}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newPatientForm.phoneNumber}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newPatientForm.email}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={newPatientForm.address}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact & Medical Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Emergency Contact</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={newPatientForm.emergencyContactName}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Emergency contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={newPatientForm.emergencyContactRelationship}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={newPatientForm.emergencyContactPhone}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Emergency contact phone"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Medical Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={newPatientForm.bloodType}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <input
                        type="text"
                        value={newPatientForm.allergies}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, allergies: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter allergies (separated by commas)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                      <input
                        type="text"
                        value={newPatientForm.chronicConditions}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, chronicConditions: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter chronic conditions (separated by commas)"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Insurance Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                      <input
                        type="text"
                        value={newPatientForm.insuranceProvider}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Insurance company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                      <input
                        type="text"
                        value={newPatientForm.insurancePolicyNumber}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, insurancePolicyNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Insurance policy number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={newPatientForm.insuranceValidUntil}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, insuranceValidUntil: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setShowAddPatientModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewPatient}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Patient
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Patient Modal */}
          {showEditPatientModal && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Patient - {selectedPatient.fullName}</h2>
                  <button
                    onClick={() => setShowEditPatientModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editPatientForm.fullName}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editPatientForm.dateOfBirth}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={editPatientForm.gender}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={editPatientForm.phoneNumber}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editPatientForm.email}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={editPatientForm.address}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact & Medical Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Emergency Contact</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={editPatientForm.emergencyContactName}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Emergency contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={editPatientForm.emergencyContactRelationship}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={editPatientForm.emergencyContactPhone}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Emergency contact phone"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Medical Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={editPatientForm.bloodType}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <input
                        type="text"
                        value={editPatientForm.allergies}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, allergies: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter allergies (separated by commas)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                      <input
                        type="text"
                        value={editPatientForm.chronicConditions}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, chronicConditions: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter chronic conditions (separated by commas)"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Insurance Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                      <input
                        type="text"
                        value={editPatientForm.insuranceProvider}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Insurance company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                      <input
                        type="text"
                        value={editPatientForm.insurancePolicyNumber}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, insurancePolicyNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Insurance policy number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={editPatientForm.insuranceValidUntil}
                        onChange={(e) => setEditPatientForm(prev => ({ ...prev, insuranceValidUntil: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setShowEditPatientModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditPatient}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Update Patient
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default MyPatients;