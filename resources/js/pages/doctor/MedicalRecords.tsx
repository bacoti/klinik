import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, FileText, Calendar, User, Stethoscope, ClipboardList, Filter, Download, BookOpen } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getDoctorSidebarItems } from '../../config/doctorSidebar';

// Types
interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female';
  visitDate: string;
  visitTime: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  vitalSigns: {
    bloodPressure: string;
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
    weight: number;
    height: number;
    oxygenSaturation?: number;
  };
  physicalExamination: {
    general: string;
    head: string;
    chest: string;
    abdomen: string;
    extremities: string;
    neurological: string;
  };
  labResults?: {
    testName: string;
    result: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  followUpDate?: string;
  doctorNotes: string;
  status: 'active' | 'completed' | 'follow_up_required';
  doctorName: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phoneNumber: string;
  address: string;
  lastVisit: string;
  totalVisits: number;
  chronicConditions: string[];
}

interface RecordStats {
  totalRecords: number;
  todayRecords: number;
  activePatients: number;
  followUpRequired: number;
}

const MedicalRecords: React.FC = () => {
  const sidebarItems = getDoctorSidebarItems("/doctor/records");
  
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<RecordStats>({
    totalRecords: 0,
    todayRecords: 0,
    activePatients: 0,
    followUpRequired: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'patients'>('records');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockRecords: MedicalRecord[] = [
      {
        id: 'MR001',
        patientId: 'P001',
        patientName: 'Ahmad Wijaya',
        age: 45,
        gender: 'male',
        visitDate: '2025-01-05',
        visitTime: '10:30',
        chiefComplaint: 'Demam tinggi dan batuk berdahak sudah 3 hari',
        diagnosis: 'Upper Respiratory Tract Infection (URTI)',
        treatmentPlan: 'Istirahat cukup, banyak minum air putih, konsumsi obat sesuai resep',
        prescriptions: [
          {
            medicineId: 'MED001',
            medicineName: 'Paracetamol 500mg',
            dosage: '1 tablet',
            frequency: '3x sehari',
            duration: '5 hari',
            instructions: 'Diminum setelah makan'
          },
          {
            medicineId: 'MED002',
            medicineName: 'Amoxicillin 250mg',
            dosage: '1 capsule',
            frequency: '3x sehari',
            duration: '7 hari',
            instructions: 'Diminum sebelum makan, habiskan antibiotik'
          }
        ],
        vitalSigns: {
          bloodPressure: '120/80',
          temperature: 38.2,
          heartRate: 88,
          respiratoryRate: 20,
          weight: 70,
          height: 170,
          oxygenSaturation: 98
        },
        physicalExamination: {
          general: 'Pasien tampak sakit sedang, kesadaran compos mentis',
          head: 'Mata: konjungtiva tidak anemis, sklera tidak ikterik',
          chest: 'Paru: vesikuler, ronki basah halus pada kedua lapang paru',
          abdomen: 'Datar, lembut, bising usus normal',
          extremities: 'Tidak ada edema',
          neurological: 'Dalam batas normal'
        },
        labResults: [
          {
            testName: 'Leukosit',
            result: '12.500',
            normalRange: '4.000-10.000',
            status: 'abnormal'
          },
          {
            testName: 'Hemoglobin',
            result: '13.2',
            normalRange: '12.0-15.0',
            status: 'normal'
          }
        ],
        followUpDate: '2025-01-12',
        doctorNotes: 'Pasien menunjukkan gejala ISPA dengan komplikasi ringan. Monitoring kondisi dalam 3 hari, jika tidak ada perbaikan segera kontrol kembali.',
        status: 'follow_up_required',
        doctorName: 'Dr. Budi Santoso'
      },
      {
        id: 'MR002',
        patientId: 'P002',
        patientName: 'Sari Dewi',
        age: 32,
        gender: 'female',
        visitDate: '2025-01-05',
        visitTime: '11:00',
        chiefComplaint: 'Kontrol diabetes rutin',
        diagnosis: 'Diabetes Mellitus Type 2 - controlled',
        treatmentPlan: 'Lanjutkan terapi metformin, kontrol diet dan olahraga teratur',
        prescriptions: [
          {
            medicineId: 'MED003',
            medicineName: 'Metformin 500mg',
            dosage: '1 tablet',
            frequency: '2x sehari',
            duration: '30 hari',
            instructions: 'Diminum setelah makan pagi dan malam'
          }
        ],
        vitalSigns: {
          bloodPressure: '110/70',
          temperature: 36.5,
          heartRate: 76,
          respiratoryRate: 18,
          weight: 58,
          height: 155
        },
        physicalExamination: {
          general: 'Pasien tampak sehat, kesadaran compos mentis',
          head: 'Dalam batas normal',
          chest: 'Paru dan jantung dalam batas normal',
          abdomen: 'Datar, lembut, tidak ada nyeri tekan',
          extremities: 'Tidak ada edema, refleks normal',
          neurological: 'Dalam batas normal'
        },
        labResults: [
          {
            testName: 'Gula Darah Puasa',
            result: '110',
            normalRange: '70-100',
            status: 'abnormal'
          },
          {
            testName: 'HbA1c',
            result: '6.8',
            normalRange: '<7.0',
            status: 'normal'
          }
        ],
        followUpDate: '2025-02-05',
        doctorNotes: 'Kontrol diabetes baik, HbA1c dalam target. Lanjutkan terapi dan lifestyle modification.',
        status: 'active',
        doctorName: 'Dr. Budi Santoso'
      },
      {
        id: 'MR003',
        patientId: 'P003',
        patientName: 'Budi Santoso',
        age: 28,
        gender: 'male',
        visitDate: '2025-01-04',
        visitTime: '14:30',
        chiefComplaint: 'Nyeri dada dan sesak napas',
        diagnosis: 'Chest pain - non cardiac, Anxiety disorder',
        treatmentPlan: 'Edukasi tentang anxiety, teknik relaksasi, follow up jika keluhan berlanjut',
        prescriptions: [
          {
            medicineId: 'MED004',
            medicineName: 'Alprazolam 0.25mg',
            dosage: '1 tablet',
            frequency: '1x sehari',
            duration: '7 hari',
            instructions: 'Diminum malam hari sebelum tidur jika perlu'
          }
        ],
        vitalSigns: {
          bloodPressure: '140/90',
          temperature: 36.8,
          heartRate: 95,
          respiratoryRate: 24,
          weight: 75,
          height: 175,
          oxygenSaturation: 99
        },
        physicalExamination: {
          general: 'Pasien tampak cemas, kesadaran compos mentis',
          head: 'Dalam batas normal',
          chest: 'Jantung: BJ I-II reguler, tidak ada murmur. Paru: vesikuler, tidak ada ronki',
          abdomen: 'Dalam batas normal',
          extremities: 'Tidak ada edema',
          neurological: 'Tampak cemas, orientasi baik'
        },
        labResults: [
          {
            testName: 'EKG',
            result: 'Sinus rhythm normal',
            normalRange: 'Normal sinus rhythm',
            status: 'normal'
          },
          {
            testName: 'Troponin I',
            result: '0.02',
            normalRange: '<0.04',
            status: 'normal'
          }
        ],
        followUpDate: '2025-01-11',
        doctorNotes: 'Nyeri dada non-kardiak, kemungkinan anxiety disorder. EKG dan biomarker jantung normal. Edukasi stress management.',
        status: 'completed',
        doctorName: 'Dr. Budi Santoso'
      }
    ];

    const mockPatients: Patient[] = [
      {
        id: 'P001',
        name: 'Ahmad Wijaya',
        age: 45,
        gender: 'male',
        phoneNumber: '081234567890',
        address: 'Jl. Sudirman No. 123, Jakarta',
        lastVisit: '2025-01-05',
        totalVisits: 5,
        chronicConditions: ['Hipertensi', 'Diabetes Mellitus']
      },
      {
        id: 'P002',
        name: 'Sari Dewi',
        age: 32,
        gender: 'female',
        phoneNumber: '081234567891',
        address: 'Jl. Gatot Subroto No. 456, Jakarta',
        lastVisit: '2025-01-05',
        totalVisits: 12,
        chronicConditions: ['Diabetes Mellitus Type 2']
      },
      {
        id: 'P003',
        name: 'Budi Santoso',
        age: 28,
        gender: 'male',
        phoneNumber: '081234567892',
        address: 'Jl. Thamrin No. 789, Jakarta',
        lastVisit: '2025-01-04',
        totalVisits: 3,
        chronicConditions: []
      }
    ];

    setRecords(mockRecords);
    setPatients(mockPatients);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = mockRecords.filter(r => r.visitDate === today).length;
    const followUpRequired = mockRecords.filter(r => r.status === 'follow_up_required').length;

    setStats({
      totalRecords: mockRecords.length,
      todayRecords,
      activePatients: mockPatients.length,
      followUpRequired
    });
  }, []);

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const recordDate = new Date(record.visitDate);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return recordDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return recordDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return recordDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'follow_up_required': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLabResultColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'abnormal': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Medical Records">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600 mt-1">Kelola rekam medis dan riwayat pemeriksaan pasien</p>
            </div>
            <button
              onClick={() => setShowNewRecordModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Medical Record
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Records</p>
                    <p className="text-2xl font-bold text-green-600">{stats.todayRecords}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Patients</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.activePatients}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-up Required</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.followUpRequired}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <ClipboardList className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'records'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'patients'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Patients
            </button>
          </div>

          {/* Records Tab */}
          {activeTab === 'records' && (
            <>
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Cari berdasarkan nama pasien, ID, diagnosis, atau keluhan..."
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
                      <option value="completed">Completed</option>
                      <option value="follow_up_required">Follow-up Required</option>
                    </select>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Semua Tanggal</option>
                      <option value="today">Hari Ini</option>
                      <option value="week">7 Hari Terakhir</option>
                      <option value="month">30 Hari Terakhir</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Records List */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records ({filteredRecords.length} records)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paginatedRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{record.patientName}</h3>
                              <span className="text-gray-500">({record.patientId})</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Visit Date:</p>
                                <p className="font-medium">{record.visitDate} {record.visitTime}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Chief Complaint:</p>
                                <p className="font-medium">{record.chiefComplaint}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Diagnosis:</p>
                                <p className="font-medium">{record.diagnosis}</p>
                              </div>
                            </div>
                            {record.followUpDate && (
                              <div className="mt-2 text-sm">
                                <span className="text-orange-600 font-medium">Follow-up: {record.followUpDate}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowRecordModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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
            </>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <Card>
              <CardHeader>
                <CardTitle>My Patients ({patients.length} patients)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{patient.name}</h3>
                            <span className="text-gray-500">({patient.id})</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Age & Gender:</p>
                              <p className="font-medium">{patient.age} years • {patient.gender}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Last Visit:</p>
                              <p className="font-medium">{patient.lastVisit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Visits:</p>
                              <p className="font-medium">{patient.totalVisits} visits</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="text-gray-600">Phone: {patient.phoneNumber}</p>
                            <p className="text-gray-600">Address: {patient.address}</p>
                            {patient.chronicConditions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-gray-600">Chronic Conditions:</p>
                                <div className="flex gap-2 mt-1">
                                  {patient.chronicConditions.map((condition, index) => (
                                    <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                                      {condition}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <BookOpen className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Record Detail Modal */}
          {showRecordModal && selectedRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Medical Record Details</h2>
                  <button
                    onClick={() => setShowRecordModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Name:</span> {selectedRecord.patientName}
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">ID:</span> {selectedRecord.patientId}
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Age:</span> {selectedRecord.age} years
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Gender:</span> {selectedRecord.gender}
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Visit Date:</span> {selectedRecord.visitDate} {selectedRecord.visitTime}
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Doctor:</span> {selectedRecord.doctorName}
                      </div>
                    </div>
                  </div>

                  {/* Chief Complaint & Diagnosis */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Chief Complaint</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {selectedRecord.chiefComplaint}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {selectedRecord.diagnosis}
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-900">Blood Pressure</div>
                        <div className="text-red-700">{selectedRecord.vitalSigns.bloodPressure} mmHg</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="font-medium text-orange-900">Temperature</div>
                        <div className="text-orange-700">{selectedRecord.vitalSigns.temperature}°C</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium text-green-900">Heart Rate</div>
                        <div className="text-green-700">{selectedRecord.vitalSigns.heartRate} bpm</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-900">Respiratory Rate</div>
                        <div className="text-blue-700">{selectedRecord.vitalSigns.respiratoryRate} /min</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="font-medium text-purple-900">Weight</div>
                        <div className="text-purple-700">{selectedRecord.vitalSigns.weight} kg</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Height</div>
                        <div className="text-gray-700">{selectedRecord.vitalSigns.height} cm</div>
                      </div>
                    </div>
                  </div>

                  {/* Physical Examination */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Physical Examination</h3>
                    <div className="space-y-3 text-sm">
                      {Object.entries(selectedRecord.physicalExamination).map(([system, finding]) => (
                        <div key={system} className="border-l-4 border-blue-400 pl-3">
                          <div className="font-medium text-gray-900 capitalize">{system}:</div>
                          <div className="text-gray-600">{finding}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lab Results */}
                  {selectedRecord.labResults && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Laboratory Results</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-2 px-3 font-medium text-gray-900">Test</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-900">Result</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-900">Normal Range</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRecord.labResults.map((lab, index) => (
                              <tr key={index} className="border-t border-gray-100">
                                <td className="py-2 px-3">{lab.testName}</td>
                                <td className="py-2 px-3 font-medium">{lab.result}</td>
                                <td className="py-2 px-3 text-gray-600">{lab.normalRange}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLabResultColor(lab.status)}`}>
                                    {lab.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Prescriptions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Prescriptions</h3>
                    <div className="space-y-3">
                      {selectedRecord.prescriptions.map((prescription, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{prescription.medicineName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Dosage:</span> {prescription.dosage} • 
                            <span className="font-medium"> Frequency:</span> {prescription.frequency} • 
                            <span className="font-medium"> Duration:</span> {prescription.duration}
                          </div>
                          <div className="text-sm text-gray-600 italic mt-1">
                            {prescription.instructions}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Plan & Notes */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
                      <div className="p-3 bg-green-50 rounded-lg text-sm">
                        {selectedRecord.treatmentPlan}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Doctor's Notes</h3>
                      <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                        {selectedRecord.doctorNotes}
                      </div>
                    </div>
                  </div>

                  {/* Follow-up */}
                  {selectedRecord.followUpDate && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">Follow-up Required</h3>
                      <div className="text-orange-700">
                        Next appointment scheduled: {selectedRecord.followUpDate}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default MedicalRecords;