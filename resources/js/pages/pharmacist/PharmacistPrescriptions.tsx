import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPharmacistSidebarItems } from "@/config/pharmacistSidebar";

interface Medicine {
    id: number;
    name: string;
    generic_name: string;
    form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops';
    strength: string;
    unit: string;
    stock: number;
    price: number;
    expiry_date: string;
    manufacturer: string;
}

interface PrescriptionItem {
    id: number;
    medicine_id: number;
    medicine_name: string;
    medicine_form: string;
    medicine_strength: string;
    quantity_prescribed: number;
    quantity_dispensed: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    status: 'pending' | 'partial' | 'completed' | 'unavailable';
}

interface Prescription {
    id: number;
    prescription_number: string;
    patient_id: number;
    patient_name: string;
    patient_phone: string;
    doctor_name: string;
    prescribed_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'normal' | 'urgent' | 'emergency';
    total_items: number;
    total_amount: number;
    insurance_coverage: number;
    patient_payment: number;
    items: PrescriptionItem[];
    notes?: string;
    pharmacist_name?: string;
    dispensed_at?: string;
}

const PharmacistPrescriptions: React.FC = () => {
    const sidebarItems = getPharmacistSidebarItems("/pharmacist/prescriptions");
    
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [showDispensingModal, setShowDispensingModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [dispensingItems, setDispensingItems] = useState<PrescriptionItem[]>([]);

    // Mock data - replace with API calls
    useEffect(() => {
        const mockMedicines: Medicine[] = [
            {
                id: 1,
                name: "Paracetamol",
                generic_name: "Acetaminophen",
                form: "tablet",
                strength: "500",
                unit: "mg",
                stock: 1000,
                price: 1500,
                expiry_date: "2026-12-31",
                manufacturer: "Kimia Farma"
            },
            {
                id: 2,
                name: "Amoxicillin",
                generic_name: "Amoxicillin",
                form: "capsule",
                strength: "250",
                unit: "mg",
                stock: 500,
                price: 3000,
                expiry_date: "2025-08-15",
                manufacturer: "Indofarma"
            },
            {
                id: 3,
                name: "OBH Combi",
                generic_name: "Dextromethorphan + Guaifenesin",
                form: "syrup",
                strength: "100",
                unit: "ml",
                stock: 75,
                price: 15000,
                expiry_date: "2025-06-30",
                manufacturer: "OBH"
            }
        ];

        const mockPrescriptions: Prescription[] = [
            {
                id: 1,
                prescription_number: "RX001-2025",
                patient_id: 1,
                patient_name: "John Doe",
                patient_phone: "081234567890",
                doctor_name: "Dr. Budi Santoso",
                prescribed_date: "2025-10-05",
                status: "pending",
                priority: "normal",
                total_items: 2,
                total_amount: 22500,
                insurance_coverage: 15000,
                patient_payment: 7500,
                items: [
                    {
                        id: 1,
                        medicine_id: 1,
                        medicine_name: "Paracetamol 500mg",
                        medicine_form: "tablet",
                        medicine_strength: "500mg",
                        quantity_prescribed: 10,
                        quantity_dispensed: 0,
                        dosage: "1 tablet",
                        frequency: "3 times daily",
                        duration: "3 days",
                        instructions: "Take after meals",
                        status: "pending"
                    },
                    {
                        id: 2,
                        medicine_id: 3,
                        medicine_name: "OBH Combi Syrup",
                        medicine_form: "syrup",
                        medicine_strength: "100ml",
                        quantity_prescribed: 1,
                        quantity_dispensed: 0,
                        dosage: "5ml",
                        frequency: "3 times daily",
                        duration: "5 days",
                        instructions: "Take when coughing",
                        status: "pending"
                    }
                ]
            },
            {
                id: 2,
                prescription_number: "RX002-2025",
                patient_id: 2,
                patient_name: "Jane Smith",
                patient_phone: "081234567891",
                doctor_name: "Dr. Sari Wijaya",
                prescribed_date: "2025-10-05",
                status: "in_progress",
                priority: "urgent",
                total_items: 1,
                total_amount: 21000,
                insurance_coverage: 18000,
                patient_payment: 3000,
                items: [
                    {
                        id: 3,
                        medicine_id: 2,
                        medicine_name: "Amoxicillin 250mg",
                        medicine_form: "capsule",
                        medicine_strength: "250mg",
                        quantity_prescribed: 7,
                        quantity_dispensed: 7,
                        dosage: "1 capsule",
                        frequency: "3 times daily",
                        duration: "7 days",
                        instructions: "Take before meals",
                        status: "completed"
                    }
                ],
                pharmacist_name: "Apt. Dewi Farmasi",
                dispensed_at: "2025-10-05 14:30"
            },
            {
                id: 3,
                prescription_number: "RX003-2025",
                patient_id: 3,
                patient_name: "Bob Johnson",
                patient_phone: "081234567892",
                doctor_name: "Dr. Budi Santoso",
                prescribed_date: "2025-10-04",
                status: "completed",
                priority: "emergency",
                total_items: 3,
                total_amount: 45000,
                insurance_coverage: 35000,
                patient_payment: 10000,
                items: [
                    {
                        id: 4,
                        medicine_id: 1,
                        medicine_name: "Paracetamol 500mg",
                        medicine_form: "tablet",
                        medicine_strength: "500mg",
                        quantity_prescribed: 20,
                        quantity_dispensed: 20,
                        dosage: "1-2 tablets",
                        frequency: "4 times daily",
                        duration: "5 days",
                        instructions: "For fever and pain",
                        status: "completed"
                    },
                    {
                        id: 5,
                        medicine_id: 2,
                        medicine_name: "Amoxicillin 250mg",
                        medicine_form: "capsule",
                        medicine_strength: "250mg",
                        quantity_prescribed: 14,
                        quantity_dispensed: 14,
                        dosage: "2 capsules",
                        frequency: "2 times daily",
                        duration: "7 days",
                        instructions: "Complete the course",
                        status: "completed"
                    },
                    {
                        id: 6,
                        medicine_id: 3,
                        medicine_name: "OBH Combi Syrup",
                        medicine_form: "syrup",
                        medicine_strength: "100ml",
                        quantity_prescribed: 1,
                        quantity_dispensed: 1,
                        dosage: "10ml",
                        frequency: "3 times daily",
                        duration: "7 days",
                        instructions: "Shake well before use",
                        status: "completed"
                    }
                ],
                pharmacist_name: "Apt. Dewi Farmasi",
                dispensed_at: "2025-10-04 16:45"
            }
        ];

        setMedicines(mockMedicines);
        setPrescriptions(mockPrescriptions);
    }, []);

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const matchesSearch = 
            prescription.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || prescription.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleStartDispensing = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setDispensingItems([...prescription.items]);
        setShowDispensingModal(true);
        
        // Update prescription status
        setPrescriptions(prev => 
            prev.map(p => 
                p.id === prescription.id 
                    ? { ...p, status: 'in_progress' }
                    : p
            )
        );
    };

    const handleQuantityChange = (itemId: number, quantity: number) => {
        setDispensingItems(prev => 
            prev.map(item => 
                item.id === itemId 
                    ? { 
                        ...item, 
                        quantity_dispensed: Math.min(quantity, item.quantity_prescribed),
                        status: quantity === item.quantity_prescribed ? 'completed' : 
                               quantity > 0 ? 'partial' : 'pending'
                    }
                    : item
            )
        );
    };

    const handleCompleteDispensing = () => {
        if (!selectedPrescription) return;

        const allCompleted = dispensingItems.every(item => item.status === 'completed');
        const hasPartial = dispensingItems.some(item => item.status === 'partial');
        
        const newStatus = allCompleted ? 'completed' : hasPartial ? 'in_progress' : 'pending';

        // Update prescription
        setPrescriptions(prev => 
            prev.map(p => 
                p.id === selectedPrescription.id 
                    ? { 
                        ...p, 
                        status: newStatus,
                        items: dispensingItems,
                        pharmacist_name: "Apt. Dewi Farmasi", // Would come from auth
                        dispensed_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
                    }
                    : p
            )
        );

        // Update medicine stock
        dispensingItems.forEach(item => {
            if (item.quantity_dispensed > 0) {
                setMedicines(prev => 
                    prev.map(med => 
                        med.id === item.medicine_id 
                            ? { ...med, stock: med.stock - item.quantity_dispensed }
                            : med
                    )
                );
            }
        });

        setShowDispensingModal(false);
        setSelectedPrescription(null);
        setDispensingItems([]);
        alert("Dispensing completed successfully!");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "emergency":
                return "bg-red-500 text-white";
            case "urgent":
                return "bg-orange-500 text-white";
            case "normal":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getItemStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "partial":
                return "bg-orange-100 text-orange-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "unavailable":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalPrescriptions = prescriptions.length;
    const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
    const inProgressPrescriptions = prescriptions.filter(p => p.status === 'in_progress').length;
    const completedToday = prescriptions.filter(p => 
        p.status === 'completed' && 
        p.dispensed_at?.startsWith(new Date().toISOString().slice(0, 10))
    ).length;

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Pharmacist Prescriptions">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Prescription Management
                            </h1>
                            <p className="text-gray-600">
                                Manage and dispense patient prescriptions
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{totalPrescriptions}</p>
                                    <p className="text-sm text-gray-600">Total Prescriptions</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{pendingPrescriptions}</p>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{inProgressPrescriptions}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{completedToday}</p>
                                    <p className="text-sm text-gray-600">Completed Today</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search prescriptions..."
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
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Priority</option>
                                <option value="emergency">Emergency</option>
                                <option value="urgent">Urgent</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>
                    </div>

                    {/* Prescriptions List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prescriptions ({filteredPrescriptions.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredPrescriptions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No prescriptions found</p>
                                    </div>
                                ) : (
                                    filteredPrescriptions.map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4 mb-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {prescription.prescription_number}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                                                            {prescription.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(prescription.priority)}`}>
                                                            {prescription.priority.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Patient:</strong> {prescription.patient_name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Phone:</strong> {prescription.patient_phone}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Doctor:</strong> {prescription.doctor_name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Prescribed:</strong> {prescription.prescribed_date}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Items:</strong> {prescription.total_items}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Total:</strong> Rp {prescription.total_amount.toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Prescription Items */}
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <h4 className="font-medium text-gray-900 mb-2">Prescription Items:</h4>
                                                        <div className="space-y-2">
                                                            {prescription.items.map((item) => (
                                                                <div key={item.id} className="flex items-center justify-between text-sm">
                                                                    <div className="flex-1">
                                                                        <span className="font-medium">{item.medicine_name}</span>
                                                                        <span className="text-gray-600 ml-2">
                                                                            {item.dosage} {item.frequency} for {item.duration}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-600">
                                                                            {item.quantity_dispensed}/{item.quantity_prescribed}
                                                                        </span>
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                                                                            {item.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {prescription.pharmacist_name && (
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            <strong>Dispensed by:</strong> {prescription.pharmacist_name} at {prescription.dispensed_at}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col space-y-2 ml-4">
                                                    {prescription.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStartDispensing(prescription)}
                                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                                        >
                                                            Start Dispensing
                                                        </button>
                                                    )}
                                                    {prescription.status === 'in_progress' && (
                                                        <button
                                                            onClick={() => handleStartDispensing(prescription)}
                                                            className="px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
                                                        >
                                                            Continue Dispensing
                                                        </button>
                                                    )}
                                                    <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                                                        View Details
                                                    </button>
                                                    {prescription.status === 'completed' && (
                                                        <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                                                            Print Receipt
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dispensing Modal */}
                    {showDispensingModal && selectedPrescription && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Dispensing - {selectedPrescription.prescription_number}
                                    </h2>
                                    <button
                                        onClick={() => setShowDispensingModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Patient Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Name:</strong> {selectedPrescription.patient_name}</p>
                                        <p><strong>Phone:</strong> {selectedPrescription.patient_phone}</p>
                                        <p><strong>Doctor:</strong> {selectedPrescription.doctor_name}</p>
                                        <p><strong>Date:</strong> {selectedPrescription.prescribed_date}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Items to Dispense:</h3>
                                    {dispensingItems.map((item) => {
                                        const medicine = medicines.find(m => m.id === item.medicine_id);
                                        return (
                                            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{item.medicine_name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Dosage:</strong> {item.dosage} {item.frequency}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Duration:</strong> {item.duration}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Instructions:</strong> {item.instructions}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Stock Available:</strong> {medicine?.stock || 0}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Quantity to Dispense
                                                        </label>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-sm text-gray-600">
                                                                Prescribed: {item.quantity_prescribed}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={Math.min(item.quantity_prescribed, medicine?.stock || 0)}
                                                                value={item.quantity_dispensed}
                                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                            />
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        {(medicine?.stock || 0) < item.quantity_prescribed && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                Insufficient stock
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => setShowDispensingModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCompleteDispensing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Complete Dispensing
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

export default PharmacistPrescriptions;