import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPharmacistSidebarItems } from "@/config/pharmacistSidebar";

interface Medicine {
    id: number;
    name: string;
    generic_name: string;
    brand: string;
    form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'ointment';
    strength: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    maximum_stock: number;
    unit_price: number;
    selling_price: number;
    supplier: string;
    batch_number: string;
    manufacturing_date: string;
    expiry_date: string;
    storage_condition: 'room_temperature' | 'refrigerated' | 'frozen' | 'controlled';
    category: 'prescription' | 'otc' | 'controlled' | 'supplement';
    location: string;
    barcode: string;
    last_updated: string;
    status: 'active' | 'inactive' | 'discontinued';
}

interface StockMovement {
    id: number;
    medicine_id: number;
    medicine_name: string;
    type: 'in' | 'out' | 'adjustment' | 'expired' | 'damaged';
    quantity: number;
    reason: string;
    reference_number?: string;
    performed_by: string;
    date: string;
    notes?: string;
}

const MedicineInventory: React.FC = () => {
    const sidebarItems = getPharmacistSidebarItems("/pharmacist/inventory");
    
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
    const [showStockAdjustmentModal, setShowStockAdjustmentModal] = useState(false);
    const [showMovementHistory, setShowMovementHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [expiringOnly, setExpiringOnly] = useState(false);

    const [newMedicine, setNewMedicine] = useState({
        name: "",
        generic_name: "",
        brand: "",
        form: "tablet" as const,
        strength: "",
        unit: "",
        current_stock: 0,
        minimum_stock: 0,
        maximum_stock: 0,
        unit_price: 0,
        selling_price: 0,
        supplier: "",
        batch_number: "",
        manufacturing_date: "",
        expiry_date: "",
        storage_condition: "room_temperature" as const,
        category: "prescription" as const,
        location: "",
        barcode: ""
    });

    const [stockAdjustment, setStockAdjustment] = useState({
        type: "adjustment" as const,
        quantity: 0,
        reason: "",
        notes: ""
    });

    // Mock data - replace with API calls
    useEffect(() => {
        const mockMedicines: Medicine[] = [
            {
                id: 1,
                name: "Paracetamol",
                generic_name: "Acetaminophen",
                brand: "Panadol",
                form: "tablet",
                strength: "500",
                unit: "mg",
                current_stock: 1500,
                minimum_stock: 100,
                maximum_stock: 2000,
                unit_price: 500,
                selling_price: 1500,
                supplier: "Kimia Farma",
                batch_number: "KF2024001",
                manufacturing_date: "2024-01-15",
                expiry_date: "2026-12-31",
                storage_condition: "room_temperature",
                category: "otc",
                location: "A1-01",
                barcode: "8999999123456",
                last_updated: "2025-10-05",
                status: "active"
            },
            {
                id: 2,
                name: "Amoxicillin",
                generic_name: "Amoxicillin",
                brand: "Amoxsan",
                form: "capsule",
                strength: "250",
                unit: "mg",
                current_stock: 50,
                minimum_stock: 100,
                maximum_stock: 500,
                unit_price: 1500,
                selling_price: 3000,
                supplier: "Indofarma",
                batch_number: "IF2024002",
                manufacturing_date: "2024-03-10",
                expiry_date: "2025-12-15",
                storage_condition: "room_temperature",
                category: "prescription",
                location: "B2-05",
                barcode: "8999999234567",
                last_updated: "2025-10-04",
                status: "active"
            },
            {
                id: 3,
                name: "Insulin NPH",
                generic_name: "Insulin Isophane",
                brand: "Humulin N",
                form: "injection",
                strength: "100",
                unit: "IU/ml",
                current_stock: 25,
                minimum_stock: 10,
                maximum_stock: 50,
                unit_price: 75000,
                selling_price: 120000,
                supplier: "Sanofi",
                batch_number: "SN2024003",
                manufacturing_date: "2024-02-20",
                expiry_date: "2025-11-30",
                storage_condition: "refrigerated",
                category: "prescription",
                location: "COLD-01",
                barcode: "8999999345678",
                last_updated: "2025-10-03",
                status: "active"
            },
            {
                id: 4,
                name: "Vitamin D3",
                generic_name: "Cholecalciferol",
                brand: "Nature's Plus",
                form: "capsule",
                strength: "1000",
                unit: "IU",
                current_stock: 200,
                minimum_stock: 50,
                maximum_stock: 300,
                unit_price: 2000,
                selling_price: 5000,
                supplier: "Kalbe Farma",
                batch_number: "KL2024004",
                manufacturing_date: "2024-05-01",
                expiry_date: "2025-11-15",
                storage_condition: "room_temperature",
                category: "supplement",
                location: "C3-10",
                barcode: "8999999456789",
                last_updated: "2025-10-02",
                status: "active"
            }
        ];

        const mockMovements: StockMovement[] = [
            {
                id: 1,
                medicine_id: 1,
                medicine_name: "Paracetamol 500mg",
                type: "out",
                quantity: 10,
                reason: "Prescription dispensing",
                reference_number: "RX001-2025",
                performed_by: "Apt. Dewi Farmasi",
                date: "2025-10-05 14:30",
                notes: "Dispensed to John Doe"
            },
            {
                id: 2,
                medicine_id: 2,
                medicine_name: "Amoxicillin 250mg",
                type: "in",
                quantity: 100,
                reason: "Stock replenishment",
                reference_number: "PO2024001",
                performed_by: "Apt. Dewi Farmasi",
                date: "2025-10-04 09:15",
                notes: "New batch from supplier"
            },
            {
                id: 3,
                medicine_id: 3,
                medicine_name: "Insulin NPH",
                type: "adjustment",
                quantity: -5,
                reason: "Expired items removal",
                performed_by: "Apt. Dewi Farmasi",
                date: "2025-10-03 16:45",
                notes: "Removed expired batch"
            }
        ];

        setMedicines(mockMedicines);
        setStockMovements(mockMovements);
    }, []);

    const isLowStock = (medicine: Medicine) => {
        return medicine.current_stock <= medicine.minimum_stock;
    };

    const isExpiringSoon = (medicine: Medicine) => {
        const expiryDate = new Date(medicine.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysUntilExpiry <= 90; // Expiring within 3 months
    };

    const filteredMedicines = medicines.filter(medicine => {
        const matchesSearch = 
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.barcode.includes(searchTerm);
        
        const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || medicine.status === statusFilter;
        const matchesLowStock = !lowStockOnly || isLowStock(medicine);
        const matchesExpiring = !expiringOnly || isExpiringSoon(medicine);

        return matchesSearch && matchesCategory && matchesStatus && matchesLowStock && matchesExpiring;
    });

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const medicineData: Medicine = {
                ...newMedicine,
                id: Date.now(),
                last_updated: new Date().toISOString().slice(0, 10),
                status: "active"
            };

            setMedicines(prev => [medicineData, ...prev]);
            setShowAddMedicineModal(false);
            
            // Reset form
            setNewMedicine({
                name: "",
                generic_name: "",
                brand: "",
                form: "tablet",
                strength: "",
                unit: "",
                current_stock: 0,
                minimum_stock: 0,
                maximum_stock: 0,
                unit_price: 0,
                selling_price: 0,
                supplier: "",
                batch_number: "",
                manufacturing_date: "",
                expiry_date: "",
                storage_condition: "room_temperature",
                category: "prescription",
                location: "",
                barcode: ""
            });

            alert("Medicine added successfully!");
        } catch (error) {
            console.error("Error adding medicine:", error);
            alert("Error adding medicine");
        }
    };

    const handleStockAdjustment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedMedicine) return;

        try {
            const movement: StockMovement = {
                id: Date.now(),
                medicine_id: selectedMedicine.id,
                medicine_name: selectedMedicine.name,
                type: stockAdjustment.type,
                quantity: stockAdjustment.quantity,
                reason: stockAdjustment.reason,
                performed_by: "Apt. Dewi Farmasi", // Would come from auth
                date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                notes: stockAdjustment.notes
            };

            // Update medicine stock
            setMedicines(prev => 
                prev.map(med => 
                    med.id === selectedMedicine.id 
                        ? { 
                            ...med, 
                            current_stock: stockAdjustment.type === 'out' || stockAdjustment.type === 'expired' || stockAdjustment.type === 'damaged'
                                ? Math.max(0, med.current_stock - Math.abs(stockAdjustment.quantity))
                                : med.current_stock + Math.abs(stockAdjustment.quantity),
                            last_updated: new Date().toISOString().slice(0, 10)
                        }
                        : med
                )
            );

            // Add stock movement record
            setStockMovements(prev => [movement, ...prev]);

            setShowStockAdjustmentModal(false);
            setSelectedMedicine(null);
            setStockAdjustment({
                type: "adjustment",
                quantity: 0,
                reason: "",
                notes: ""
            });

            alert("Stock adjustment completed successfully!");
        } catch (error) {
            console.error("Error adjusting stock:", error);
            alert("Error adjusting stock");
        }
    };

    const getStockStatusColor = (medicine: Medicine) => {
        if (isLowStock(medicine)) return "text-red-600 bg-red-100";
        if (medicine.current_stock >= medicine.maximum_stock * 0.8) return "text-green-600 bg-green-100";
        return "text-yellow-600 bg-yellow-100";
    };

    const getExpiryStatusColor = (medicine: Medicine) => {
        if (isExpiringSoon(medicine)) return "text-red-600 bg-red-100";
        return "text-green-600 bg-green-100";
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "prescription":
                return "bg-blue-100 text-blue-800";
            case "otc":
                return "bg-green-100 text-green-800";
            case "controlled":
                return "bg-red-100 text-red-800";
            case "supplement":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStorageIcon = (condition: string) => {
        switch (condition) {
            case "refrigerated":
                return "❄️";
            case "frozen":
                return "🧊";
            case "controlled":
                return "🌡️";
            default:
                return "🏠";
        }
    };

    const totalItems = medicines.length;
    const lowStockItems = medicines.filter(isLowStock).length;
    const expiringItems = medicines.filter(isExpiringSoon).length;
    const totalValue = medicines.reduce((sum, med) => sum + (med.current_stock * med.unit_price), 0);

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Medicine Inventory">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Medicine Inventory Management
                            </h1>
                            <p className="text-gray-600">
                                Manage medicine stock, expiry dates, and inventory levels
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowMovementHistory(true)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                📊 Movement History
                            </button>
                            <button
                                onClick={() => setShowAddMedicineModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                ➕ Add Medicine
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                                    <p className="text-sm text-gray-600">Total Items</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">{expiringItems}</p>
                                    <p className="text-sm text-gray-600">Expiring Soon</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        Rp {(totalValue / 1000000).toFixed(1)}M
                                    </p>
                                    <p className="text-sm text-gray-600">Total Value</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center flex-wrap">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search medicines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="prescription">Prescription</option>
                                <option value="otc">OTC</option>
                                <option value="controlled">Controlled</option>
                                <option value="supplement">Supplement</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="discontinued">Discontinued</option>
                            </select>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={lowStockOnly}
                                    onChange={(e) => setLowStockOnly(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Low Stock Only</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={expiringOnly}
                                    onChange={(e) => setExpiringOnly(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Expiring Soon</span>
                            </label>
                        </div>
                    </div>

                    {/* Medicine List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medicine Inventory ({filteredMedicines.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4">Medicine</th>
                                            <th className="text-left py-3 px-4">Stock</th>
                                            <th className="text-left py-3 px-4">Price</th>
                                            <th className="text-left py-3 px-4">Expiry</th>
                                            <th className="text-left py-3 px-4">Location</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMedicines.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                                    No medicines found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMedicines.map((medicine) => (
                                                <tr key={medicine.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                                                            <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {medicine.brand} • {medicine.strength}{medicine.unit} {medicine.form}
                                                            </p>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                                                                    {medicine.category}
                                                                </span>
                                                                <span className="text-lg">
                                                                    {getStorageIcon(medicine.storage_condition)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {medicine.current_stock}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Min: {medicine.minimum_stock} / Max: {medicine.maximum_stock}
                                                            </p>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(medicine)}`}>
                                                                {isLowStock(medicine) ? "Low Stock" : "In Stock"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Rp {medicine.selling_price.toLocaleString('id-ID')}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Cost: Rp {medicine.unit_price.toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="text-sm text-gray-900">{medicine.expiry_date}</p>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryStatusColor(medicine)}`}>
                                                                {isExpiringSoon(medicine) ? "Expiring Soon" : "Valid"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="text-sm text-gray-900">{medicine.location}</p>
                                                            <p className="text-sm text-gray-600">Batch: {medicine.batch_number}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-col space-y-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedMedicine(medicine);
                                                                    setShowStockAdjustmentModal(true);
                                                                }}
                                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                            >
                                                                Adjust Stock
                                                            </button>
                                                            <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Medicine Modal */}
                    {showAddMedicineModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Add New Medicine</h2>
                                    <button
                                        onClick={() => setShowAddMedicineModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleAddMedicine} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Medicine Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newMedicine.name}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Generic Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newMedicine.generic_name}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, generic_name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Brand
                                            </label>
                                            <input
                                                type="text"
                                                value={newMedicine.brand}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, brand: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Form *
                                            </label>
                                            <select
                                                value={newMedicine.form}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, form: e.target.value as any }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="tablet">Tablet</option>
                                                <option value="capsule">Capsule</option>
                                                <option value="syrup">Syrup</option>
                                                <option value="injection">Injection</option>
                                                <option value="cream">Cream</option>
                                                <option value="drops">Drops</option>
                                                <option value="ointment">Ointment</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Strength
                                            </label>
                                            <input
                                                type="text"
                                                value={newMedicine.strength}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, strength: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                value={newMedicine.unit}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, unit: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="mg, ml, IU, etc."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Current Stock
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.current_stock}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, current_stock: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Minimum Stock
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.minimum_stock}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, minimum_stock: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit Price (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.unit_price}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, unit_price: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Selling Price (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.selling_price}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, selling_price: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="date"
                                                value={newMedicine.expiry_date}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, expiry_date: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                value={newMedicine.category}
                                                onChange={(e) => setNewMedicine(prev => ({ ...prev, category: e.target.value as any }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="prescription">Prescription</option>
                                                <option value="otc">OTC</option>
                                                <option value="controlled">Controlled</option>
                                                <option value="supplement">Supplement</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddMedicineModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add Medicine
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Stock Adjustment Modal */}
                    {showStockAdjustmentModal && selectedMedicine && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Stock Adjustment - {selectedMedicine.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowStockAdjustmentModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Current Stock Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Current Stock:</strong> {selectedMedicine.current_stock}</p>
                                        <p><strong>Minimum Stock:</strong> {selectedMedicine.minimum_stock}</p>
                                        <p><strong>Location:</strong> {selectedMedicine.location}</p>
                                        <p><strong>Batch:</strong> {selectedMedicine.batch_number}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleStockAdjustment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adjustment Type *
                                        </label>
                                        <select
                                            value={stockAdjustment.type}
                                            onChange={(e) => setStockAdjustment(prev => ({ ...prev, type: e.target.value as any }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="in">Stock In (Add)</option>
                                            <option value="out">Stock Out (Reduce)</option>
                                            <option value="adjustment">Adjustment</option>
                                            <option value="expired">Expired Removal</option>
                                            <option value="damaged">Damaged Removal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            value={stockAdjustment.quantity}
                                            onChange={(e) => setStockAdjustment(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason *
                                        </label>
                                        <input
                                            type="text"
                                            value={stockAdjustment.reason}
                                            onChange={(e) => setStockAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter reason for adjustment"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            value={stockAdjustment.notes}
                                            onChange={(e) => setStockAdjustment(prev => ({ ...prev, notes: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Additional notes..."
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowStockAdjustmentModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Apply Adjustment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default MedicineInventory;