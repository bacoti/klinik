import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Download, Calendar, User, Pill, FileText, Clock, AlertCircle } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getDoctorSidebarItems } from '../../config/doctorSidebar';

// Types
interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  instructions: string;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'drops';
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  diagnosis: string;
  complaint: string;
  medicines: Medicine[];
  status: 'draft' | 'issued' | 'dispensed' | 'completed' | 'cancelled';
  doctorName: string;
  notes?: string;
  validUntil: string;
  followUpDate?: string;
  totalCost: number;
}

interface PrescriptionStats {
  totalPrescriptions: number;
  issuedToday: number;
  pendingDispensing: number;
  totalMedicines: number;
}

const DoctorPrescriptions: React.FC = () => {
  const sidebarItems = getDoctorSidebarItems("/doctor/prescriptions");
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [stats, setStats] = useState<PrescriptionStats>({
    totalPrescriptions: 0,
    issuedToday: 0,
    pendingDispensing: 0,
    totalMedicines: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockPrescriptions: Prescription[] = [
      {
        id: 'PRX001',
        prescriptionNumber: 'RX-2025-001',
        date: '2025-01-05',
        time: '09:30:00',
        patientId: 'P001',
        patientName: 'Ahmad Wijaya',
        patientAge: 45,
        patientGender: 'male',
        diagnosis: 'Upper Respiratory Tract Infection',
        complaint: 'Demam, batuk, dan pilek sudah 3 hari',
        medicines: [
          {
            id: 'M001',
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: '3x sehari',
            duration: '5 hari',
            quantity: 15,
            unit: 'tablet',
            instructions: 'Diminum setelah makan',
            route: 'oral'
          },
          {
            id: 'M002',
            name: 'Amoxicillin',
            dosage: '250mg',
            frequency: '3x sehari',
            duration: '7 hari',
            quantity: 21,
            unit: 'kapsul',
            instructions: 'Diminum sebelum makan, habiskan semua obat',
            route: 'oral'
          },
          {
            id: 'M003',
            name: 'OBH Combi',
            dosage: '15ml',
            frequency: '3x sehari',
            duration: '5 hari',
            quantity: 1,
            unit: 'botol',
            instructions: 'Diminum setelah makan',
            route: 'oral'
          }
        ],
        status: 'dispensed',
        doctorName: 'Dr. Sarah Johnson',
        notes: 'Pasien disarankan istirahat cukup dan banyak minum air putih',
        validUntil: '2025-01-12',
        followUpDate: '2025-01-10',
        totalCost: 45000
      },
      {
        id: 'PRX002',
        prescriptionNumber: 'RX-2025-002',
        date: '2025-01-05',
        time: '10:15:00',
        patientId: 'P002',
        patientName: 'Sari Dewi',
        patientAge: 32,
        patientGender: 'female',
        diagnosis: 'Type 2 Diabetes Mellitus',
        complaint: 'Kontrol rutin diabetes',
        medicines: [
          {
            id: 'M004',
            name: 'Metformin',
            dosage: '500mg',
            frequency: '2x sehari',
            duration: '30 hari',
            quantity: 60,
            unit: 'tablet',
            instructions: 'Diminum setelah makan pagi dan malam',
            route: 'oral'
          },
          {
            id: 'M005',
            name: 'Glimepiride',
            dosage: '2mg',
            frequency: '1x sehari',
            duration: '30 hari',
            quantity: 30,
            unit: 'tablet',
            instructions: 'Diminum sebelum makan pagi',
            route: 'oral'
          }
        ],
        status: 'issued',
        doctorName: 'Dr. Sarah Johnson',
        notes: 'Kontrol gula darah setiap 2 minggu, diet rendah gula',
        validUntil: '2025-02-04',
        followUpDate: '2025-01-19',
        totalCost: 78000
      },
      {
        id: 'PRX003',
        prescriptionNumber: 'RX-2025-003',
        date: '2025-01-04',
        time: '14:20:00',
        patientId: 'P003',
        patientName: 'Budi Santoso',
        patientAge: 28,
        patientGender: 'male',
        diagnosis: 'Hypertension',
        complaint: 'Tekanan darah tinggi, pusing, dan mual',
        medicines: [
          {
            id: 'M006',
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: '1x sehari',
            duration: '30 hari',
            quantity: 30,
            unit: 'tablet',
            instructions: 'Diminum setiap pagi setelah makan',
            route: 'oral'
          },
          {
            id: 'M007',
            name: 'Captopril',
            dosage: '25mg',
            frequency: '2x sehari',
            duration: '30 hari',
            quantity: 60,
            unit: 'tablet',
            instructions: 'Diminum sebelum makan pagi dan sore',
            route: 'oral'
          }
        ],
        status: 'completed',
        doctorName: 'Dr. Sarah Johnson',
        notes: 'Monitor tekanan darah harian, kurangi konsumsi garam',
        validUntil: '2025-02-03',
        followUpDate: '2025-01-18',
        totalCost: 52000
      },
      {
        id: 'PRX004',
        prescriptionNumber: 'RX-2025-004',
        date: '2025-01-04',
        time: '16:45:00',
        patientId: 'P004',
        patientName: 'Maria Gonzales',
        patientAge: 55,
        patientGender: 'female',
        diagnosis: 'Gastritis',
        complaint: 'Nyeri ulu hati dan mual setelah makan',
        medicines: [
          {
            id: 'M008',
            name: 'Omeprazole',
            dosage: '20mg',
            frequency: '1x sehari',
            duration: '14 hari',
            quantity: 14,
            unit: 'kapsul',
            instructions: 'Diminum 30 menit sebelum makan pagi',
            route: 'oral'
          },
          {
            id: 'M009',
            name: 'Sucralfate',
            dosage: '1g',
            frequency: '3x sehari',
            duration: '14 hari',
            quantity: 42,
            unit: 'tablet',
            instructions: 'Diminum 1 jam sebelum makan',
            route: 'oral'
          }
        ],
        status: 'draft',
        doctorName: 'Dr. Sarah Johnson',
        notes: 'Hindari makanan pedas dan asam, makan teratur',
        validUntil: '2025-01-18',
        totalCost: 65000
      }
    ];

    setPrescriptions(mockPrescriptions);

    // Calculate stats
    const today = new Date().toDateString();
    const issuedToday = mockPrescriptions.filter(p => new Date(p.date).toDateString() === today).length;
    const pendingDispensing = mockPrescriptions.filter(p => p.status === 'issued').length;
    const totalMedicines = mockPrescriptions.reduce((sum, p) => sum + p.medicines.length, 0);

    setStats({
      totalPrescriptions: mockPrescriptions.length,
      issuedToday,
      pendingDispensing,
      totalMedicines
    });
  }, []);

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const prescriptionDate = new Date(prescription.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return prescriptionDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return prescriptionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return prescriptionDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrescriptions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + recordsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50';
      case 'issued': return 'text-blue-600 bg-blue-50';
      case 'dispensed': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'issued': return <FileText className="h-4 w-4" />;
      case 'dispensed': return <Pill className="h-4 w-4" />;
      case 'completed': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const printPrescription = (prescription: Prescription) => {
    // Implementation for printing prescription
    console.log('Printing prescription:', prescription.prescriptionNumber);
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Doctor Prescriptions">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Prescriptions</h1>
              <p className="text-gray-600 mt-1">Kelola resep obat dan riwayat prescription</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create New Prescription
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPrescriptions}</p>
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
                    <p className="text-sm font-medium text-gray-600">Issued Today</p>
                    <p className="text-2xl font-bold text-green-600">{stats.issuedToday}</p>
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
                    <p className="text-sm font-medium text-gray-600">Pending Dispensing</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingDispensing}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalMedicines}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Pill className="h-6 w-6 text-purple-600" />
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
                      placeholder="Cari berdasarkan nama pasien, nomor resep, atau diagnosis..."
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
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="dispensed">Dispensed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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

          {/* Prescriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription History ({filteredPrescriptions.length} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Prescription #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Diagnosis</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Medicines</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Total Cost</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPrescriptions.map((prescription) => (
                      <tr key={prescription.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-mono text-sm text-blue-600">{prescription.prescriptionNumber}</div>
                          <div className="text-xs text-gray-500">Valid until: {prescription.validUntil}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{prescription.date}</div>
                          <div className="text-gray-500 text-xs">{prescription.time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{prescription.patientName}</div>
                          <div className="text-gray-500 text-xs">
                            {prescription.patientId} • {prescription.patientAge}y • {prescription.patientGender}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">{prescription.diagnosis}</div>
                          <div className="text-gray-500 text-xs">{prescription.complaint}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {prescription.medicines.slice(0, 2).map((med, idx) => (
                              <div key={idx} className="text-gray-600">
                                {med.name} {med.dosage}
                              </div>
                            ))}
                            {prescription.medicines.length > 2 && (
                              <div className="text-gray-500 text-xs">
                                +{prescription.medicines.length - 2} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(prescription.status)}`}>
                            {getStatusIcon(prescription.status)}
                            {prescription.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            Rp {prescription.totalCost.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowPrescriptionModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => printPrescription(prescription)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {prescription.status === 'draft' && (
                              <button className="text-orange-600 hover:text-orange-800 transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
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
                    Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredPrescriptions.length)} of {filteredPrescriptions.length} records
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

          {/* Prescription Detail Modal */}
          {showPrescriptionModal && selectedPrescription && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => printPrescription(selectedPrescription)}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      <Download className="h-4 w-4" />
                      Print
                    </button>
                    <button
                      onClick={() => setShowPrescriptionModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Prescription Header */}
                  <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Prescription Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Number:</strong> {selectedPrescription.prescriptionNumber}</div>
                        <div><strong>Date:</strong> {selectedPrescription.date} {selectedPrescription.time}</div>
                        <div><strong>Valid Until:</strong> {selectedPrescription.validUntil}</div>
                        <div><strong>Doctor:</strong> {selectedPrescription.doctorName}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedPrescription.patientName}</div>
                        <div><strong>ID:</strong> {selectedPrescription.patientId}</div>
                        <div><strong>Age:</strong> {selectedPrescription.patientAge} years</div>
                        <div><strong>Gender:</strong> {selectedPrescription.patientGender}</div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis & Complaint */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
                      <p className="text-gray-700 p-3 bg-blue-50 rounded-lg">{selectedPrescription.diagnosis}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Chief Complaint</h3>
                      <p className="text-gray-700 p-3 bg-yellow-50 rounded-lg">{selectedPrescription.complaint}</p>
                    </div>
                  </div>

                  {/* Medicines */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Prescribed Medicines</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium">Medicine</th>
                            <th className="text-left py-3 px-4 font-medium">Dosage</th>
                            <th className="text-left py-3 px-4 font-medium">Frequency</th>
                            <th className="text-left py-3 px-4 font-medium">Duration</th>
                            <th className="text-left py-3 px-4 font-medium">Quantity</th>
                            <th className="text-left py-3 px-4 font-medium">Instructions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrescription.medicines.map((medicine, index) => (
                            <tr key={medicine.id} className="border-t border-gray-100">
                              <td className="py-3 px-4">
                                <div className="font-medium">{medicine.name}</div>
                                <div className="text-xs text-gray-500">{medicine.route}</div>
                              </td>
                              <td className="py-3 px-4">{medicine.dosage}</td>
                              <td className="py-3 px-4">{medicine.frequency}</td>
                              <td className="py-3 px-4">{medicine.duration}</td>
                              <td className="py-3 px-4">{medicine.quantity} {medicine.unit}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{medicine.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Notes & Follow-up */}
                  <div className="grid grid-cols-1 gap-4">
                    {selectedPrescription.notes && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Doctor's Notes</h3>
                        <p className="text-gray-700 p-3 bg-green-50 rounded-lg">{selectedPrescription.notes}</p>
                      </div>
                    )}
                    {selectedPrescription.followUpDate && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Follow-up Date</h3>
                        <p className="text-gray-700 p-3 bg-purple-50 rounded-lg">{selectedPrescription.followUpDate}</p>
                      </div>
                    )}
                  </div>

                  {/* Total Cost */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Cost:</span>
                      <span className="font-bold text-xl text-green-600">Rp {selectedPrescription.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Prescription Modal Placeholder */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Prescription</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-600">Create Prescription Form</p>
                  <p className="text-sm text-gray-500 mt-2">This feature will be implemented soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default DoctorPrescriptions;