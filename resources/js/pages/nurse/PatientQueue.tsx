import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNurseSidebarItems } from "@/config/nurseSidebar";

interface Patient {
    id: number;
    name: string;
    registration_number: string;
    phone: string;
    appointment_time: string;
    doctor_name: string;
    status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'normal' | 'urgent' | 'emergency';
    queue_number: number;
    estimated_wait_time: string;
    symptoms?: string;
}

const PatientQueue: React.FC = () => {
    const sidebarItems = getNurseSidebarItems("/nurse/queue");
    
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    // Mock data - replace with API call
    useEffect(() => {
        const mockPatients: Patient[] = [
            {
                id: 1,
                name: "John Doe",
                registration_number: "REG001",
                phone: "081234567890",
                appointment_time: "09:00",
                doctor_name: "Dr. Budi Santoso",
                status: "waiting",
                priority: "normal",
                queue_number: 1,
                estimated_wait_time: "15 mins",
                symptoms: "Demam dan batuk"
            },
            {
                id: 2,
                name: "Jane Smith",
                registration_number: "REG002",
                phone: "081234567891",
                appointment_time: "09:15",
                doctor_name: "Dr. Budi Santoso",
                status: "in_progress",
                priority: "urgent",
                queue_number: 2,
                estimated_wait_time: "0 mins",
                symptoms: "Nyeri dada"
            },
            {
                id: 3,
                name: "Bob Johnson",
                registration_number: "REG003",
                phone: "081234567892",
                appointment_time: "09:30",
                doctor_name: "Dr. Sari Wijaya",
                status: "waiting",
                priority: "emergency",
                queue_number: 3,
                estimated_wait_time: "30 mins",
                symptoms: "Sesak napas akut"
            },
            {
                id: 4,
                name: "Alice Brown",
                registration_number: "REG004",
                phone: "081234567893",
                appointment_time: "09:45",
                doctor_name: "Dr. Budi Santoso",
                status: "completed",
                priority: "normal",
                queue_number: 4,
                estimated_wait_time: "0 mins",
                symptoms: "Kontrol rutin"
            },
            {
                id: 5,
                name: "Charlie Wilson",
                registration_number: "REG005",
                phone: "081234567894",
                appointment_time: "10:00",
                doctor_name: "Dr. Sari Wijaya",
                status: "waiting",
                priority: "normal",
                queue_number: 5,
                estimated_wait_time: "45 mins",
                symptoms: "Sakit kepala"
            }
        ];
        setPatients(mockPatients);
    }, []);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const filteredPatients = patients.filter(patient => {
        const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus;
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "waiting":
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "waiting":
                return "⏳";
            case "in_progress":
                return "👨‍⚕️";
            case "completed":
                return "✅";
            case "cancelled":
                return "❌";
            default:
                return "❓";
        }
    };

    const handleStatusUpdate = (patientId: number, newStatus: Patient['status']) => {
        setPatients(prev => 
            prev.map(patient => 
                patient.id === patientId 
                    ? { ...patient, status: newStatus }
                    : patient
            )
        );
    };

    const handleCallNext = () => {
        const nextPatient = patients.find(p => p.status === "waiting");
        if (nextPatient) {
            handleStatusUpdate(nextPatient.id, "in_progress");
        }
    };

    const queueStats = {
        total: patients.length,
        waiting: patients.filter(p => p.status === "waiting").length,
        inProgress: patients.filter(p => p.status === "in_progress").length,
        completed: patients.filter(p => p.status === "completed").length,
        emergency: patients.filter(p => p.priority === "emergency").length
    };

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Patient Queue Management">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Patient Queue Management
                            </h1>
                            <p className="text-gray-600">
                                Manage patient queue and appointment flow
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Time</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {currentTime.toLocaleTimeString('id-ID', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{queueStats.total}</p>
                                    <p className="text-sm text-gray-600">Total Patients</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</p>
                                    <p className="text-sm text-gray-600">Waiting</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{queueStats.inProgress}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{queueStats.completed}</p>
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">{queueStats.emergency}</p>
                                    <p className="text-sm text-gray-600">Emergency</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search patients..."
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

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="waiting">Waiting</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Call Next Button */}
                        <button
                            onClick={handleCallNext}
                            disabled={queueStats.waiting === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            📢 Call Next Patient
                        </button>
                    </div>

                    {/* Queue List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Queue ({filteredPatients.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredPatients.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No patients found</p>
                                    </div>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {/* Queue Number */}
                                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                                        {patient.queue_number}
                                                    </div>

                                                    {/* Patient Info */}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {patient.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {patient.registration_number} • {patient.phone}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Appointment: {patient.appointment_time} with {patient.doctor_name}
                                                        </p>
                                                        {patient.symptoms && (
                                                            <p className="text-sm text-blue-600">
                                                                Symptoms: {patient.symptoms}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    {/* Priority */}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                                                        {patient.priority.toUpperCase()}
                                                    </span>

                                                    {/* Status */}
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                                                        {getStatusIcon(patient.status)} {patient.status.replace('_', ' ').toUpperCase()}
                                                    </span>

                                                    {/* Wait Time */}
                                                    {patient.status === "waiting" && (
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">Est. Wait</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {patient.estimated_wait_time}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex space-x-2">
                                                        {patient.status === "waiting" && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(patient.id, "in_progress")}
                                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                            >
                                                                Call
                                                            </button>
                                                        )}
                                                        {patient.status === "in_progress" && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(patient.id, "completed")}
                                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                        {(patient.status === "waiting" || patient.status === "in_progress") && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(patient.id, "cancelled")}
                                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default PatientQueue;