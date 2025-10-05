import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, TrendingUp, TrendingDown, DollarSign, Package, Users, BarChart3, PieChart } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getPharmacistSidebarItems } from '../../config/pharmacistSidebar';

// Types
interface SalesData {
  id: string;
  date: string;
  prescriptionId: string;
  patientName: string;
  medicines: {
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  totalAmount: number;
  paymentMethod: 'cash' | 'insurance' | 'credit';
  pharmacistName: string;
  profit: number;
  cost: number;
}

interface DailySummary {
  date: string;
  totalSales: number;
  totalTransactions: number;
  totalProfit: number;
  averageTransaction: number;
}

interface MedicineAnalytics {
  medicineName: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
  transactionCount: number;
}

interface SalesStats {
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  averageTransaction: number;
  profitMargin: number;
  topMedicine: string;
  growthRate: number;
}

const SalesReport: React.FC = () => {
  const sidebarItems = getPharmacistSidebarItems("/pharmacist/reports");
  
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary[]>([]);
  const [medicineAnalytics, setMedicineAnalytics] = useState<MedicineAnalytics[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalProfit: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    profitMargin: 0,
    topMedicine: '',
    growthRate: 0
  });
  
  const [dateRange, setDateRange] = useState<string>('week');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'medicines' | 'payments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockSalesData: SalesData[] = [
      {
        id: 'S001',
        date: '2025-01-05',
        prescriptionId: 'RX001',
        patientName: 'Budi Santoso',
        medicines: [
          { name: 'Paracetamol 500mg', quantity: 20, unitPrice: 500, subtotal: 10000 },
          { name: 'Amoxicillin 250mg', quantity: 15, unitPrice: 1200, subtotal: 18000 }
        ],
        totalAmount: 28000,
        paymentMethod: 'cash',
        pharmacistName: 'Dr. Sari Farmasi',
        cost: 20000,
        profit: 8000
      },
      {
        id: 'S002',
        date: '2025-01-05',
        prescriptionId: 'RX002',
        patientName: 'Siti Aminah',
        medicines: [
          { name: 'Vitamin B Complex', quantity: 30, unitPrice: 800, subtotal: 24000 }
        ],
        totalAmount: 24000,
        paymentMethod: 'insurance',
        pharmacistName: 'Dr. Sari Farmasi',
        cost: 18000,
        profit: 6000
      },
      {
        id: 'S003',
        date: '2025-01-04',
        prescriptionId: 'RX003',
        patientName: 'Ahmad Rahman',
        medicines: [
          { name: 'Omeprazole 20mg', quantity: 14, unitPrice: 2500, subtotal: 35000 },
          { name: 'Antasida Tablet', quantity: 20, unitPrice: 300, subtotal: 6000 }
        ],
        totalAmount: 41000,
        paymentMethod: 'cash',
        pharmacistName: 'Dr. Sari Farmasi',
        cost: 28000,
        profit: 13000
      },
      {
        id: 'S004',
        date: '2025-01-04',
        prescriptionId: 'RX004',
        patientName: 'Maria Gonzales',
        medicines: [
          { name: 'Metformin 500mg', quantity: 60, unitPrice: 750, subtotal: 45000 }
        ],
        totalAmount: 45000,
        paymentMethod: 'insurance',
        pharmacistName: 'Dr. Sari Farmasi',
        cost: 36000,
        profit: 9000
      },
      {
        id: 'S005',
        date: '2025-01-03',
        prescriptionId: 'RX005',
        patientName: 'Robert Johnson',
        medicines: [
          { name: 'Simvastatin 20mg', quantity: 30, unitPrice: 1500, subtotal: 45000 }
        ],
        totalAmount: 45000,
        paymentMethod: 'cash',
        pharmacistName: 'Dr. Sari Farmasi',
        cost: 33000,
        profit: 12000
      }
    ];

    setSalesData(mockSalesData);

    // Generate daily summary
    const dailyData: DailySummary[] = [
      {
        date: '2025-01-05',
        totalSales: 52000,
        totalTransactions: 2,
        totalProfit: 14000,
        averageTransaction: 26000
      },
      {
        date: '2025-01-04',
        totalSales: 86000,
        totalTransactions: 2,
        totalProfit: 22000,
        averageTransaction: 43000
      },
      {
        date: '2025-01-03',
        totalSales: 45000,
        totalTransactions: 1,
        totalProfit: 12000,
        averageTransaction: 45000
      }
    ];

    setDailySummary(dailyData);

    // Generate medicine analytics
    const medicineData: MedicineAnalytics[] = [
      {
        medicineName: 'Paracetamol 500mg',
        totalQuantity: 20,
        totalRevenue: 10000,
        totalProfit: 3000,
        transactionCount: 1
      },
      {
        medicineName: 'Metformin 500mg',
        totalQuantity: 60,
        totalRevenue: 45000,
        totalProfit: 9000,
        transactionCount: 1
      },
      {
        medicineName: 'Simvastatin 20mg',
        totalQuantity: 30,
        totalRevenue: 45000,
        totalProfit: 12000,
        transactionCount: 1
      },
      {
        medicineName: 'Omeprazole 20mg',
        totalQuantity: 14,
        totalRevenue: 35000,
        totalProfit: 8000,
        transactionCount: 1
      },
      {
        medicineName: 'Vitamin B Complex',
        totalQuantity: 30,
        totalRevenue: 24000,
        totalProfit: 6000,
        transactionCount: 1
      }
    ];

    setMedicineAnalytics(medicineData);

    // Calculate stats
    const totalRevenue = mockSalesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = mockSalesData.reduce((sum, sale) => sum + sale.profit, 0);
    const totalTransactions = mockSalesData.length;
    const averageTransaction = totalRevenue / totalTransactions;
    const profitMargin = (totalProfit / totalRevenue) * 100;
    const topMedicine = medicineData.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.medicineName || '';

    setStats({
      totalRevenue,
      totalProfit,
      totalTransactions,
      averageTransaction,
      profitMargin,
      topMedicine,
      growthRate: 12.5 // Mock growth rate
    });
  }, []);

  const filteredSalesData = salesData.filter(sale =>
    sale.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.medicines.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportData = () => {
    const csvContent = [
      ['Date', 'Prescription ID', 'Patient Name', 'Total Amount', 'Profit', 'Payment Method'],
      ...filteredSalesData.map(sale => [
        sale.date,
        sale.prescriptionId,
        sale.patientName,
        sale.totalAmount.toString(),
        sale.profit.toString(),
        sale.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'text-green-600 bg-green-50';
      case 'insurance': return 'text-blue-600 bg-blue-50';
      case 'credit': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Sales Report">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
              <p className="text-gray-600 mt-1">Analisis penjualan dan performance farmasi</p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hari Ini</option>
                <option value="week">7 Hari Terakhir</option>
                <option value="month">30 Hari Terakhir</option>
                <option value="custom">Custom Range</option>
              </select>
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">Rp {stats.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+{stats.growthRate}%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Profit</p>
                    <p className="text-2xl font-bold text-gray-900">Rp {stats.totalProfit.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.profitMargin.toFixed(1)}% margin</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                    <p className="text-sm text-gray-500 mt-1">Avg: Rp {Math.round(stats.averageTransaction).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Medicine</p>
                    <p className="text-lg font-bold text-gray-900">{stats.topMedicine}</p>
                    <p className="text-sm text-gray-500 mt-1">Best seller</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily Summary
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'medicines'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Medicine Analytics
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Payment Methods
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Search */}
              <Card>
                <CardContent className="p-6">
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
                </CardContent>
              </Card>

              {/* Sales Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Transactions ({filteredSalesData.length} records)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Prescription ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Medicines</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Total Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Profit</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSalesData.map((sale) => (
                          <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{sale.date}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{sale.prescriptionId}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{sale.patientName}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">
                                {sale.medicines.slice(0, 2).map((med, idx) => (
                                  <div key={idx} className="text-gray-600">
                                    {med.name} ({med.quantity})
                                  </div>
                                ))}
                                {sale.medicines.length > 2 && (
                                  <div className="text-gray-500 text-xs">
                                    +{sale.medicines.length - 2} more
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-gray-900">
                                Rp {sale.totalAmount.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-green-600">
                                Rp {sale.profit.toLocaleString()}
                              </span>
                              <div className="text-xs text-gray-500">
                                {((sale.profit / sale.totalAmount) * 100).toFixed(1)}%
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(sale.paymentMethod)}`}>
                                {sale.paymentMethod}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Daily Summary Tab */}
          {activeTab === 'daily' && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Sales</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Transactions</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Profit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Transaction</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailySummary.map((day) => (
                        <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{day.date}</td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            Rp {day.totalSales.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">{day.totalTransactions}</td>
                          <td className="py-3 px-4 font-semibold text-blue-600">
                            Rp {day.totalProfit.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            Rp {day.averageTransaction.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-purple-600 font-medium">
                              {((day.totalProfit / day.totalSales) * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medicine Analytics Tab */}
          {activeTab === 'medicines' && (
            <Card>
              <CardHeader>
                <CardTitle>Medicine Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Medicine Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity Sold</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Profit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Transactions</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineAnalytics.map((medicine) => (
                        <tr key={medicine.medicineName} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{medicine.medicineName}</td>
                          <td className="py-3 px-4">{medicine.totalQuantity}</td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            Rp {medicine.totalRevenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-blue-600">
                            Rp {medicine.totalProfit.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">{medicine.transactionCount}</td>
                          <td className="py-3 px-4">
                            Rp {Math.round(medicine.totalRevenue / medicine.totalQuantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    Cash Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">Rp {salesData.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-semibold">{salesData.filter(s => s.paymentMethod === 'cash').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-semibold text-green-600">
                        {((salesData.filter(s => s.paymentMethod === 'cash').length / salesData.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    Insurance Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">Rp {salesData.filter(s => s.paymentMethod === 'insurance').reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-semibold">{salesData.filter(s => s.paymentMethod === 'insurance').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-semibold text-blue-600">
                        {((salesData.filter(s => s.paymentMethod === 'insurance').length / salesData.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <PieChart className="h-4 w-4 text-purple-600" />
                    </div>
                    Credit Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">Rp {salesData.filter(s => s.paymentMethod === 'credit').reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-semibold">{salesData.filter(s => s.paymentMethod === 'credit').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-semibold text-purple-600">
                        {((salesData.filter(s => s.paymentMethod === 'credit').length / salesData.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default SalesReport;