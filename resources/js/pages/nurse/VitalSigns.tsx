import React, { useState } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNurseSidebarItems } from "@/config/nurseSidebar";

interface VitalSign {
    id: number;
    patient_id: number;
    patient_name: string;
    blood_pressure: string;
    temperature: string;
    pulse: string;
    respiratory_rate: string;
    oxygen_saturation: string;
    weight: string;
    height: string;
    recorded_at: string;
    recorded_by: string;
}

const VitalSigns: React.FC = () => {
    const sidebarItems = getNurseSidebarItems("/nurse/vitals");

    const [activeTab, setActiveTab] = useState<"record" | "history">("record");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [vitalData, setVitalData] = useState({
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        temperature: "",
        pulse: "",
        respiratory_rate: "",
        oxygen_saturation: "",
        weight: "",
        height: "",
    });

    // Mock data untuk daftar pasien
    const patients = [
        { id: 1, name: "John Doe", room: "101" },
        { id: 2, name: "Jane Smith", room: "102" },
        { id: 3, name: "Bob Johnson", room: "103" },
        { id: 4, name: "Alice Brown", room: "104" },
        { id: 5, name: "Charlie Wilson", room: "105" },
    ];

    // Mock data untuk history vital signs
    const vitalHistory: VitalSign[] = [
        {
            id: 1,
            patient_id: 1,
            patient_name: "John Doe",
            blood_pressure: "120/80",
            temperature: "36.5°C",
            pulse: "72 bpm",
            respiratory_rate: "16 /min",
            oxygen_saturation: "98%",
            weight: "70 kg",
            height: "175 cm",
            recorded_at: "2 hours ago",
            recorded_by: "Nurse Mary",
        },
        {
            id: 2,
            patient_id: 2,
            patient_name: "Jane Smith",
            blood_pressure: "130/85",
            temperature: "37.2°C",
            pulse: "85 bpm",
            respiratory_rate: "18 /min",
            oxygen_saturation: "97%",
            weight: "65 kg",
            height: "168 cm",
            recorded_at: "1 hour ago",
            recorded_by: "Nurse Sarah",
        },
        {
            id: 3,
            patient_id: 3,
            patient_name: "Bob Johnson",
            blood_pressure: "110/70",
            temperature: "36.8°C",
            pulse: "68 bpm",
            respiratory_rate: "15 /min",
            oxygen_saturation: "99%",
            weight: "80 kg",
            height: "180 cm",
            recorded_at: "30 minutes ago",
            recorded_by: "Nurse Mary",
        },
    ];

    const handleInputChange = (field: string, value: string) => {
        setVitalData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) {
            alert("Please select a patient first");
            return;
        }

        try {
            const response = await fetch("/nurse/vitals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify({
                    patient_id: selectedPatient,
                    ...vitalData,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Vital signs recorded successfully!");

                // Reset form
                setVitalData({
                    blood_pressure_systolic: "",
                    blood_pressure_diastolic: "",
                    temperature: "",
                    pulse: "",
                    respiratory_rate: "",
                    oxygen_saturation: "",
                    weight: "",
                    height: "",
                });
                setSelectedPatient("");
            } else {
                alert(
                    "Error: " +
                        (result.message || "Failed to record vital signs")
                );
            }
        } catch (error) {
            console.error("Error submitting vital signs:", error);
            alert("Error connecting to server. Please try again.");
        }
    };

    const getVitalStatus = (vital: string, type: string) => {
        // Simple logic to determine if vital signs are normal, warning, or critical
        switch (type) {
            case "temperature":
                const temp = parseFloat(vital);
                if (temp >= 38) return "critical";
                if (temp >= 37.5) return "warning";
                return "normal";
            case "pulse":
                const pulse = parseInt(vital);
                if (pulse > 100 || pulse < 60) return "warning";
                return "normal";
            case "oxygen":
                const oxygen = parseInt(vital);
                if (oxygen < 95) return "critical";
                if (oxygen < 98) return "warning";
                return "normal";
            default:
                return "normal";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical":
                return "text-red-600 bg-red-100";
            case "warning":
                return "text-yellow-600 bg-yellow-100";
            case "normal":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Vital Signs">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Vital Signs Management
                            </h1>
                            <p className="text-gray-600">
                                Record and monitor patient vital signs
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("record")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "record"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Record Vitals
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "history"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Vital Signs History
                            </button>
                        </nav>
                    </div>

                    {/* Record Vitals Tab */}
                    {activeTab === "record" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Record New Vital Signs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Patient Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Patient *
                                        </label>
                                        <select
                                            value={selectedPatient}
                                            onChange={(e) =>
                                                setSelectedPatient(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">
                                                Choose a patient...
                                            </option>
                                            {patients.map((patient) => (
                                                <option
                                                    key={patient.id}
                                                    value={patient.id}
                                                >
                                                    {patient.name} - Room{" "}
                                                    {patient.room}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Vital Signs Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Blood Pressure */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Blood Pressure (mmHg) *
                                            </label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    placeholder="Systolic"
                                                    value={
                                                        vitalData.blood_pressure_systolic
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "blood_pressure_systolic",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <span className="self-center">
                                                    /
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="Diastolic"
                                                    value={
                                                        vitalData.blood_pressure_diastolic
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "blood_pressure_diastolic",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Temperature */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Temperature (°C) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="36.5"
                                                value={vitalData.temperature}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "temperature",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Pulse */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Pulse (bpm) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="72"
                                                value={vitalData.pulse}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "pulse",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Respiratory Rate */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Respiratory Rate (/min) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="16"
                                                value={
                                                    vitalData.respiratory_rate
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "respiratory_rate",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Oxygen Saturation */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Oxygen Saturation (%) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="98"
                                                min="0"
                                                max="100"
                                                value={
                                                    vitalData.oxygen_saturation
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "oxygen_saturation",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Weight */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="70"
                                                value={vitalData.weight}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "weight",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Height */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Height (cm)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="175"
                                                value={vitalData.height}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "height",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVitalData({
                                                    blood_pressure_systolic: "",
                                                    blood_pressure_diastolic:
                                                        "",
                                                    temperature: "",
                                                    pulse: "",
                                                    respiratory_rate: "",
                                                    oxygen_saturation: "",
                                                    weight: "",
                                                    height: "",
                                                });
                                                setSelectedPatient("");
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Record Vital Signs
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Vital Signs History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {vitalHistory.map((vital) => (
                                        <div
                                            key={vital.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {vital.patient_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Recorded by{" "}
                                                        {vital.recorded_by} •{" "}
                                                        {vital.recorded_at}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">
                                                        Blood Pressure
                                                    </p>
                                                    <p className="font-semibold text-red-700">
                                                        {vital.blood_pressure}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`text-center p-3 rounded-lg ${getStatusColor(
                                                        getVitalStatus(
                                                            vital.temperature,
                                                            "temperature"
                                                        )
                                                    )}`}
                                                >
                                                    <p className="text-sm">
                                                        Temperature
                                                    </p>
                                                    <p className="font-semibold">
                                                        {vital.temperature}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`text-center p-3 rounded-lg ${getStatusColor(
                                                        getVitalStatus(
                                                            vital.pulse,
                                                            "pulse"
                                                        )
                                                    )}`}
                                                >
                                                    <p className="text-sm">
                                                        Pulse
                                                    </p>
                                                    <p className="font-semibold">
                                                        {vital.pulse}
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">
                                                        Respiratory
                                                    </p>
                                                    <p className="font-semibold text-blue-700">
                                                        {vital.respiratory_rate}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`text-center p-3 rounded-lg ${getStatusColor(
                                                        getVitalStatus(
                                                            vital.oxygen_saturation,
                                                            "oxygen"
                                                        )
                                                    )}`}
                                                >
                                                    <p className="text-sm">
                                                        O2 Saturation
                                                    </p>
                                                    <p className="font-semibold">
                                                        {
                                                            vital.oxygen_saturation
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">
                                                        Weight
                                                    </p>
                                                    <p className="font-semibold text-purple-700">
                                                        {vital.weight}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default VitalSigns;
