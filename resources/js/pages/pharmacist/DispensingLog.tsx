import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Calendar, User, Pill, DollarSign } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getPharmacistSidebarItems } from '../../config/pharmacistSidebar';

// Types
interface DispensingRecord {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  prescriptionId: string;
  medicines: {
    name: string;
    quantity: number;
    unit: string;
    batchNumber: string;
    expiryDate: string;
    unitPrice: number;
  }[];
  totalAmount: number;
  pharmacistName: string;
  status: 'completed' | 'partial' | 'cancelled';
  paymentMethod: 'cash' | 'insurance' | 'credit';
  notes?: string;
}

interface DispensingStats {
  totalDispensed: number;
  totalRevenue: number;
  medicinesDispensed: number;
  averageValue: number;
}

const DispensingLog: React.FC = () => {
  const sidebarItems = getPharmacistSidebarItems("/pharmacist/dispensing");
  
  const [records, setRecords] = useState<DispensingRecord[]>([]);
  const [stats, setStats] = useState<DispensingStats>({
    totalDispensed: 0,
    totalRevenue: 0,
    medicinesDispensed: 0,
    averageValue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<DispensingRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockRecords: DispensingRecord[] = [
      {
        id: 'DL001',
        date: '2025-01-05',
        time: '09:15:00',
        patientName: 'Budi Santoso',
        patientId: 'P001',
        prescriptionId: 'RX001',
        medicines: [
          {
            name: 'Paracetamol 500mg',
            quantity: 20,
            unit: 'tablet',
            batchNumber: 'PCM2025001',
            expiryDate: '2026-12-31',
            unitPrice: 500
          },
          {
            name: 'Amoxicillin 250mg',
            quantity: 15,
            unit: 'capsule',
            batchNumber: 'AMX2025001',
            expiryDate: '2026-10-15',
            unitPrice: 1200
          }
        ],
        totalAmount: 28000,
        pharmacistName: 'Dr. Sari Farmasi',
        status: 'completed',
        paymentMethod: 'cash',
        notes: 'Pasien sudah dijelaskan cara konsumsi obat'
      },
      {
        id: 'DL002',
        date: '2025-01-05',
        time: '10:30:00',
        patientName: 'Siti Aminah',
        patientId: 'P002',
        prescriptionId: 'RX002',
        medicines: [
          {
            name: 'Vitamin B Complex',
            quantity: 30,
            unit: 'tablet',
            batchNumber: 'VBC2025001',
            expiryDate: '2027-06-30',
            unitPrice: 800
          }
        ],
        totalAmount: 24000,
        pharmacistName: 'Dr. Sari Farmasi',
        status: 'completed',
        paymentMethod: 'insurance'
      },
      {
        id: 'DL003',
        date: '2025-01-04',
        time: '14:45:00',
        patientName: 'Ahmad Rahman',
        patientId: 'P003',
        prescriptionId: 'RX003',
        medicines: [
          {
            name: 'Omeprazole 20mg',
            quantity: 14,
            unit: 'capsule',
            batchNumber: 'OMP2025001',
            expiryDate: '2026-08-20',
            unitPrice: 2500
          },
          {
            name: 'Antasida Tablet',
            quantity: 20,
            unit: 'tablet',
            batchNumber: 'ANT2025001',
            expiryDate: '2026-12-31',
            unitPrice: 300
          }
        ],
        totalAmount: 41000,
        pharmacistName: 'Dr. Sari Farmasi',
        status: 'partial',
        paymentMethod: 'cash',
        notes: 'Omeprazole stok terbatas, diberikan 14 tablet dari 28 yang diresepkan'
      },
      {
        id: 'DL004',
        date: '2025-01-04',
        time: '16:20:00',
        patientName: 'Maria Gonzales',
        patientId: 'P004',
        prescriptionId: 'RX004',
        medicines: [
          {
            name: 'Metformin 500mg',
            quantity: 60,
            unit: 'tablet',
            batchNumber: 'MET2025001',
            expiryDate: '2026-11-30',
            unitPrice: 750
          }
        ],
        totalAmount: 45000,
        pharmacistName: 'Dr. Sari Farmasi',
        status: 'completed',
        paymentMethod: 'insurance'
      },
      {
        id: 'DL005',
        date: '2025-01-03',
        time: '11:10:00',
        patientName: 'Robert Johnson',
        patientId: 'P005',
        prescriptionId: 'RX005',
        medicines: [
          {
            name: 'Simvastatin 20mg',
            quantity: 30,
            unit: 'tablet',
            batchNumber: 'SIM2025001',
            expiryDate: '2026-09-15',
            unitPrice: 1500
          }
        ],
        totalAmount: 45000,
        pharmacistName: 'Dr. Sari Farmasi',
        status: 'cancelled',
        paymentMethod: 'cash',
        notes: 'Pasien membatalkan karena alergi yang baru diketahui'
      }
    ];

    setRecords(mockRecords);

    // Calculate stats
    const completedRecords = mockRecords.filter(r => r.status === 'completed');
    const totalRevenue = completedRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const totalMedicines = completedRecords.reduce((sum, record) => 
      sum + record.medicines.reduce((medSum, med) => medSum + med.quantity, 0), 0
    );

    setStats({
      totalDispensed: completedRecords.length,
      totalRevenue,
      medicinesDispensed: totalMedicines,
      averageValue: completedRecords.length > 0 ? totalRevenue / completedRecords.length : 0
    });
  }, []);

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.medicines.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const recordDate = new Date(record.date);
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

  const handleViewDetails = (record: DispensingRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'text-green-600 bg-green-50';
      case 'insurance': return 'text-blue-600 bg-blue-50';
      case 'credit': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Patient Name', 'Prescription ID', 'Medicines', 'Total Amount', 'Status', 'Payment Method'],
      ...filteredRecords.map(record => [
        record.date,
        record.patientName,
        record.prescriptionId,
        record.medicines.map(med => `${med.name} (${med.quantity})`).join('; '),
        record.totalAmount.toString(),
        record.status,
        record.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispensing-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Dispensing Log">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispensing Log</h1>
            <p className="text-gray-600 mt-1">Riwayat dan tracking dispensing obat</p>
          </div>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Dispensed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDispensed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Pill className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rp {stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medicines Dispensed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.medicinesDispensed}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Pill className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Value</p>
                  <p className="text-2xl font-bold text-gray-900">Rp {Math.round(stats.averageValue).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-orange-600" />
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
                    placeholder="Cari berdasarkan nama pasien, ID resep, atau obat..."
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
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
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

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Dispensing ({filteredRecords.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date/Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Prescription ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Medicines</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.date}</div>
                          <div className="text-gray-500 text-xs">{record.time}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.patientName}</div>
                          <div className="text-gray-500 text-xs">{record.patientId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{record.prescriptionId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {record.medicines.slice(0, 2).map((med, idx) => (
                            <div key={idx} className="text-gray-600">
                              {med.name} ({med.quantity} {med.unit})
                            </div>
                          ))}
                          {record.medicines.length > 2 && (
                            <div className="text-gray-500 text-xs">
                              +{record.medicines.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          Rp {record.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(record.paymentMethod)}`}>
                          {record.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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

        {/* Detail Modal */}
        {showDetailModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Dispensing Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <div className="text-sm text-gray-900">{selectedRecord.date} {selectedRecord.time}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescription ID</label>
                    <div className="text-sm text-gray-900 font-mono">{selectedRecord.prescriptionId}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <div className="text-sm text-gray-900">{selectedRecord.patientName} ({selectedRecord.patientId})</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacist</label>
                    <div className="text-sm text-gray-900">{selectedRecord.pharmacistName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(selectedRecord.paymentMethod)}`}>
                      {selectedRecord.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Medicines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Medicines Dispensed</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Medicine</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Quantity</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Batch</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Expiry</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Unit Price</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.medicines.map((medicine, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-2 px-3">{medicine.name}</td>
                            <td className="py-2 px-3">{medicine.quantity} {medicine.unit}</td>
                            <td className="py-2 px-3 font-mono text-xs">{medicine.batchNumber}</td>
                            <td className="py-2 px-3">{medicine.expiryDate}</td>
                            <td className="py-2 px-3">Rp {medicine.unitPrice.toLocaleString()}</td>
                            <td className="py-2 px-3 font-semibold">Rp {(medicine.quantity * medicine.unitPrice).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={5} className="py-2 px-3 font-semibold text-right">Total Amount:</td>
                          <td className="py-2 px-3 font-bold text-lg">Rp {selectedRecord.totalAmount.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selectedRecord.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedRecord.notes}
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

export default DispensingLog;