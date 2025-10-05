import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, AlertTriangle, Package, TrendingUp, TrendingDown, Calendar, Edit, Eye } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getPharmacistSidebarItems } from '../../config/pharmacistSidebar';

// Types
interface StockMovement {
  id: string;
  date: string;
  time: string;
  medicineId: string;
  medicineName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'expired' | 'damaged';
  quantity: number;
  previousStock: number;
  newStock: number;
  unit: string;
  reason: string;
  referenceNumber?: string;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: string;
  unitCost?: number;
  performedBy: string;
  notes?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minimumStock: number;
  alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  severity: 'low' | 'medium' | 'high' | 'critical';
  expiryDate?: string;
  daysUntilExpiry?: number;
}

interface StockStats {
  totalMovements: number;
  stockIn: number;
  stockOut: number;
  lowStockItems: number;
  totalValue: number;
}

const StockManagement: React.FC = () => {
  const sidebarItems = getPharmacistSidebarItems("/pharmacist/stock");
  
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [stats, setStats] = useState<StockStats>({
    totalMovements: 0,
    stockIn: 0,
    stockOut: 0,
    lowStockItems: 0,
    totalValue: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddMovementModal, setShowAddMovementModal] = useState(false);
  const [showMovementDetail, setShowMovementDetail] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [activeTab, setActiveTab] = useState<'movements' | 'alerts'>('movements');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // Mock data
  useEffect(() => {
    const mockMovements: StockMovement[] = [
      {
        id: 'SM001',
        date: '2025-01-05',
        time: '09:30:00',
        medicineId: 'MED001',
        medicineName: 'Paracetamol 500mg',
        type: 'in',
        quantity: 1000,
        previousStock: 250,
        newStock: 1250,
        unit: 'tablet',
        reason: 'Stock replenishment',
        referenceNumber: 'PO-2025-001',
        supplier: 'PT. Kimia Farma',
        batchNumber: 'PCM2025001',
        expiryDate: '2026-12-31',
        unitCost: 450,
        performedBy: 'Dr. Sari Farmasi',
        notes: 'Regular monthly stock replenishment',
        status: 'completed'
      },
      {
        id: 'SM002',
        date: '2025-01-05',
        time: '11:15:00',
        medicineId: 'MED002',
        medicineName: 'Amoxicillin 250mg',
        type: 'out',
        quantity: 45,
        previousStock: 320,
        newStock: 275,
        unit: 'capsule',
        reason: 'Prescription dispensing',
        referenceNumber: 'RX-001, RX-002, RX-003',
        performedBy: 'Dr. Sari Farmasi',
        status: 'completed'
      },
      {
        id: 'SM003',
        date: '2025-01-04',
        time: '14:20:00',
        medicineId: 'MED003',
        medicineName: 'Vitamin B Complex',
        type: 'adjustment',
        quantity: -10,
        previousStock: 180,
        newStock: 170,
        unit: 'tablet',
        reason: 'Stock count discrepancy',
        performedBy: 'Dr. Sari Farmasi',
        notes: 'Physical count showed 10 tablets less than system record',
        status: 'completed'
      },
      {
        id: 'SM004',
        date: '2025-01-04',
        time: '16:45:00',
        medicineId: 'MED004',
        medicineName: 'Omeprazole 20mg',
        type: 'expired',
        quantity: 30,
        previousStock: 120,
        newStock: 90,
        unit: 'capsule',
        reason: 'Expired medication disposal',
        batchNumber: 'OMP2024001',
        expiryDate: '2025-01-01',
        performedBy: 'Dr. Sari Farmasi',
        notes: 'Expired batch removed from inventory',
        status: 'completed'
      },
      {
        id: 'SM005',
        date: '2025-01-03',
        time: '10:00:00',
        medicineId: 'MED005',
        medicineName: 'Metformin 500mg',
        type: 'transfer',
        quantity: 50,
        previousStock: 200,
        newStock: 150,
        unit: 'tablet',
        reason: 'Transfer to branch pharmacy',
        referenceNumber: 'TR-2025-001',
        performedBy: 'Dr. Sari Farmasi',
        notes: 'Transferred to Jakarta branch',
        status: 'pending'
      }
    ];

    const mockAlerts: StockAlert[] = [
      {
        id: 'AL001',
        medicineId: 'MED006',
        medicineName: 'Insulin Glargine',
        currentStock: 5,
        minimumStock: 20,
        alertType: 'low_stock',
        severity: 'high'
      },
      {
        id: 'AL002',
        medicineId: 'MED007',
        medicineName: 'Aspirin 100mg',
        currentStock: 0,
        minimumStock: 50,
        alertType: 'out_of_stock',
        severity: 'critical'
      },
      {
        id: 'AL003',
        medicineId: 'MED008',
        medicineName: 'Ciprofloxacin 500mg',
        currentStock: 45,
        minimumStock: 30,
        alertType: 'expiring_soon',
        severity: 'medium',
        expiryDate: '2025-01-15',
        daysUntilExpiry: 10
      },
      {
        id: 'AL004',
        medicineId: 'MED009',
        medicineName: 'Prednisolone 5mg',
        currentStock: 25,
        minimumStock: 40,
        alertType: 'expired',
        severity: 'high',
        expiryDate: '2025-01-01',
        daysUntilExpiry: -4
      }
    ];

    setMovements(mockMovements);
    setAlerts(mockAlerts);

    // Calculate stats
    const stockInMovements = mockMovements.filter(m => m.type === 'in' && m.status === 'completed');
    const stockOutMovements = mockMovements.filter(m => m.type === 'out' && m.status === 'completed');
    const stockInTotal = stockInMovements.reduce((sum, m) => sum + m.quantity, 0);
    const stockOutTotal = stockOutMovements.reduce((sum, m) => sum + m.quantity, 0);
    const lowStockCount = mockAlerts.filter(a => a.alertType === 'low_stock' || a.alertType === 'out_of_stock').length;
    const totalValue = stockInMovements.reduce((sum, m) => sum + (m.quantity * (m.unitCost || 0)), 0);

    setStats({
      totalMovements: mockMovements.length,
      stockIn: stockInTotal,
      stockOut: stockOutTotal,
      lowStockItems: lowStockCount,
      totalValue
    });
  }, []);

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = movementTypeFilter === 'all' || movement.type === movementTypeFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const movementDate = new Date(movement.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return movementDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return movementDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return movementDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMovements.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + recordsPerPage);

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'text-green-600 bg-green-50';
      case 'out': return 'text-blue-600 bg-blue-50';
      case 'adjustment': return 'text-yellow-600 bg-yellow-50';
      case 'transfer': return 'text-purple-600 bg-purple-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'damaged': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Stock Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
              <p className="text-gray-600 mt-1">Kelola pergerakan stok dan monitoring inventory</p>
            </div>
            <button
              onClick={() => setShowAddMovementModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Stock Movement
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Movements</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMovements}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock In</p>
                    <p className="text-2xl font-bold text-green-600">{stats.stockIn}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock Out</p>
                    <p className="text-2xl font-bold text-red-600">{stats.stockOut}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock Value</p>
                    <p className="text-2xl font-bold text-purple-600">Rp {stats.totalValue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'movements'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Stock Movements
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === 'alerts'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Stock Alerts
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Movements Tab */}
          {activeTab === 'movements' && (
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
                          placeholder="Cari berdasarkan nama obat, referensi, atau alasan..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <select
                      value={movementTypeFilter}
                      onChange={(e) => setMovementTypeFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Semua Tipe</option>
                      <option value="in">Stock In</option>
                      <option value="out">Stock Out</option>
                      <option value="adjustment">Adjustment</option>
                      <option value="transfer">Transfer</option>
                      <option value="expired">Expired</option>
                      <option value="damaged">Damaged</option>
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

              {/* Movements Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movements ({filteredMovements.length} records)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date/Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Medicine</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Stock Change</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Reason</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMovements.map((movement) => (
                          <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{movement.date}</div>
                                <div className="text-gray-500 text-xs">{movement.time}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{movement.medicineName}</div>
                                <div className="text-gray-500 text-xs">{movement.medicineId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(movement.type)}`}>
                                {movement.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                {movement.type === 'in' ? (
                                  <ArrowUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className="font-medium">
                                  {Math.abs(movement.quantity)} {movement.unit}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">
                                <div>{movement.previousStock} → {movement.newStock}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-gray-600">{movement.reason}</div>
                              {movement.referenceNumber && (
                                <div className="text-xs text-gray-500 font-mono">{movement.referenceNumber}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(movement.status)}`}>
                                {movement.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  setSelectedMovement(movement);
                                  setShowMovementDetail(true);
                                }}
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
                        Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredMovements.length)} of {filteredMovements.length} records
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

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Stock Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-gray-900">{alert.medicineName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {alert.alertType === 'low_stock' && (
                              <p>Low stock: {alert.currentStock} units remaining (minimum: {alert.minimumStock})</p>
                            )}
                            {alert.alertType === 'out_of_stock' && (
                              <p>Out of stock: 0 units remaining (minimum: {alert.minimumStock})</p>
                            )}
                            {alert.alertType === 'expiring_soon' && (
                              <p>Expiring in {alert.daysUntilExpiry} days (Expiry: {alert.expiryDate})</p>
                            )}
                            {alert.alertType === 'expired' && (
                              <p>Expired {Math.abs(alert.daysUntilExpiry!)} days ago (Expiry: {alert.expiryDate})</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Take Action
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movement Detail Modal */}
          {showMovementDetail && selectedMovement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Movement Details</h2>
                  <button
                    onClick={() => setShowMovementDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <div className="text-sm text-gray-900">{selectedMovement.date} {selectedMovement.time}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(selectedMovement.type)}`}>
                        {selectedMovement.type}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                      <div className="text-sm text-gray-900">{selectedMovement.medicineName}</div>
                      <div className="text-xs text-gray-500">{selectedMovement.medicineId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <div className="text-sm text-gray-900">{selectedMovement.quantity} {selectedMovement.unit}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Change</label>
                      <div className="text-sm text-gray-900">{selectedMovement.previousStock} → {selectedMovement.newStock}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performed By</label>
                      <div className="text-sm text-gray-900">{selectedMovement.performedBy}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <div className="text-sm text-gray-900">{selectedMovement.reason}</div>
                  </div>

                  {selectedMovement.referenceNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                      <div className="text-sm text-gray-900 font-mono">{selectedMovement.referenceNumber}</div>
                    </div>
                  )}

                  {selectedMovement.supplier && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                      <div className="text-sm text-gray-900">{selectedMovement.supplier}</div>
                    </div>
                  )}

                  {selectedMovement.batchNumber && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                        <div className="text-sm text-gray-900 font-mono">{selectedMovement.batchNumber}</div>
                      </div>
                      {selectedMovement.expiryDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <div className="text-sm text-gray-900">{selectedMovement.expiryDate}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMovement.unitCost && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                      <div className="text-sm text-gray-900">Rp {selectedMovement.unitCost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Value: Rp {(selectedMovement.quantity * selectedMovement.unitCost).toLocaleString()}</div>
                    </div>
                  )}

                  {selectedMovement.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedMovement.notes}
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

export default StockManagement;