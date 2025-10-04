import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PharmacistDashboard: React.FC = () => {
    const sidebarItems = [
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                    />
                </svg>
            ),
            label: "Dashboard",
            href: "/pharmacist/dashboard",
        },
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                </svg>
            ),
            label: "Prescriptions",
            href: "/pharmacist/prescriptions",
            badge: 12,
        },
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
            label: "Medicine Inventory",
            href: "/pharmacist/inventory",
        },
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            ),
            label: "Dispensing Log",
            href: "/pharmacist/dispensing",
        },
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            label: "Stock Management",
            href: "/pharmacist/stock",
        },
        {
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
            label: "Sales Report",
            href: "/pharmacist/reports",
        },
    ];

    const mockData = {
        pendingPrescriptions: 12,
        dispensedToday: 45,
        lowStockItems: 8,
        totalRevenue: 2850000,
        pendingPrescriptionsList: [
            {
                id: 1,
                patient: "Ahmad Wijaya",
                doctor: "Dr. Sarah Johnson",
                medicines: 3,
                priority: "normal",
                time: "10:30 AM",
            },
            {
                id: 2,
                patient: "Sari Dewi",
                doctor: "Dr. Michael Chen",
                medicines: 2,
                priority: "urgent",
                time: "10:45 AM",
            },
            {
                id: 3,
                patient: "Budi Santoso",
                doctor: "Dr. Emily Davis",
                medicines: 1,
                priority: "normal",
                time: "11:00 AM",
            },
            {
                id: 4,
                patient: "Maya Sari",
                doctor: "Dr. Robert Wilson",
                medicines: 4,
                priority: "normal",
                time: "11:15 AM",
            },
        ],
        lowStockMedicines: [
            {
                id: 1,
                name: "Paracetamol 500mg",
                stock: 25,
                minStock: 50,
                category: "Analgesic",
            },
            {
                id: 2,
                name: "Amoxicillin 250mg",
                stock: 12,
                minStock: 30,
                category: "Antibiotic",
            },
            {
                id: 3,
                name: "Omeprazole 20mg",
                stock: 8,
                minStock: 25,
                category: "PPI",
            },
            {
                id: 4,
                name: "Metformin 500mg",
                stock: 18,
                minStock: 40,
                category: "Antidiabetic",
            },
        ],
    };

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            title="Pharmacist Dashboard"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Pending Prescriptions"
                    value={mockData.pendingPrescriptions}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                        </svg>
                    }
                    color="blue"
                    trend={{ value: 5, isPositive: false }}
                />

                <StatCard
                    title="Dispensed Today"
                    value={mockData.dispensedToday}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                    color="green"
                    trend={{ value: 12, isPositive: true }}
                />

                <StatCard
                    title="Low Stock Items"
                    value={mockData.lowStockItems}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    }
                    color="yellow"
                />

                <StatCard
                    title="Today's Revenue"
                    value={`Rp ${mockData.totalRevenue.toLocaleString(
                        "id-ID"
                    )}`}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                    color="green"
                    trend={{ value: 8, isPositive: true }}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Prescriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockData.pendingPrescriptionsList.map(
                                (prescription) => (
                                    <div
                                        key={prescription.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                    prescription.priority ===
                                                    "urgent"
                                                        ? "bg-orange-100"
                                                        : "bg-blue-100"
                                                }`}
                                            >
                                                <svg
                                                    className={`w-6 h-6 ${
                                                        prescription.priority ===
                                                        "urgent"
                                                            ? "text-orange-600"
                                                            : "text-blue-600"
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {prescription.patient}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {prescription.doctor} •{" "}
                                                    {prescription.medicines}{" "}
                                                    medicines
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {prescription.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    prescription.priority ===
                                                    "urgent"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {prescription.priority}
                                            </span>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-yellow-700">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockData.lowStockMedicines.map((medicine) => (
                                <div
                                    key={medicine.id}
                                    className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-900">
                                            {medicine.name}
                                        </p>
                                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                            {medicine.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-sm">
                                                <span className="text-red-600 font-medium">
                                                    {medicine.stock}
                                                </span>
                                                <span className="text-gray-500">
                                                    {" "}
                                                    / {medicine.minStock} units
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                            Reorder
                                        </button>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    (medicine.stock /
                                                        medicine.minStock) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pharmacy Operations */}
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pharmacy Operations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button className="flex flex-col items-center justify-center px-6 py-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Process Prescription
                                </span>
                            </button>

                            <button className="flex flex-col items-center justify-center px-6 py-8 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105">
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Check Inventory
                                </span>
                            </button>

                            <button className="flex flex-col items-center justify-center px-6 py-8 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105">
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Sales Report
                                </span>
                            </button>

                            <button className="flex flex-col items-center justify-center px-6 py-8 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200 hover:scale-105">
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span className="font-medium">Stock Alert</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PharmacistDashboard;
