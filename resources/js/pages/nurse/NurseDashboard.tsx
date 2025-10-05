import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNurseSidebarItems } from "@/config/nurseSidebar";

const NurseDashboard: React.FC = () => {
    const sidebarItems = getNurseSidebarItems("/nurse/dashboard");

    const mockData = {
        screeningsToday: 24,
        triageComplete: 18,
        vitalSigns: 12,
        pendingRegistration: 6,
        pendingScreenings: [
            {
                id: 1,
                patient: "Maria Garcia",
                registeredAt: "09:15 AM",
                priority: "normal",
            },
            {
                id: 2,
                patient: "Robert Chen",
                registeredAt: "09:30 AM",
                priority: "urgent",
            },
            {
                id: 3,
                patient: "Anna Kowalski",
                registeredAt: "09:45 AM",
                priority: "normal",
            },
            {
                id: 4,
                patient: "James Wilson",
                registeredAt: "10:00 AM",
                priority: "emergency",
            },
        ],
        recentVitals: [
            {
                id: 1,
                patient: "Emily Davis",
                bp: "120/80",
                temp: "36.5°C",
                pulse: "72",
                time: "10 mins ago",
            },
            {
                id: 2,
                patient: "Michael Brown",
                bp: "130/85",
                temp: "37.2°C",
                pulse: "85",
                time: "25 mins ago",
            },
            {
                id: 3,
                patient: "Susan Johnson",
                bp: "110/70",
                temp: "36.8°C",
                pulse: "68",
                time: "40 mins ago",
            },
        ],
    };

    return (
        <DashboardLayout sidebarItems={sidebarItems} title="Nurse Dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Screenings Today"
                    value={mockData.screeningsToday}
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    }
                    color="blue"
                    trend={{ value: 15, isPositive: true }}
                />

                <StatCard
                    title="Triage Complete"
                    value={mockData.triageComplete}
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
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                        </svg>
                    }
                    color="green"
                    trend={{ value: 8, isPositive: true }}
                />

                <StatCard
                    title="Vital Signs Recorded"
                    value={mockData.vitalSigns}
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    }
                    color="red"
                    trend={{ value: 3, isPositive: true }}
                />

                <StatCard
                    title="Pending Registration"
                    value={mockData.pendingRegistration}
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                    color="yellow"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Screenings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Screenings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockData.pendingScreenings.map((screening) => (
                                <div
                                    key={screening.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                screening.priority ===
                                                "emergency"
                                                    ? "bg-red-100"
                                                    : screening.priority ===
                                                      "urgent"
                                                    ? "bg-orange-100"
                                                    : "bg-blue-100"
                                            }`}
                                        >
                                            <svg
                                                className={`w-6 h-6 ${
                                                    screening.priority ===
                                                    "emergency"
                                                        ? "text-red-600"
                                                        : screening.priority ===
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
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {screening.patient}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Registered at{" "}
                                                {screening.registeredAt}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            screening.priority === "emergency"
                                                ? "bg-red-100 text-red-800"
                                                : screening.priority ===
                                                  "urgent"
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {screening.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Vital Signs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Vital Signs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockData.recentVitals.map((vital) => (
                                <div
                                    key={vital.id}
                                    className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-900">
                                            {vital.patient}
                                        </p>
                                        <span className="text-xs text-gray-400">
                                            {vital.time}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="text-center p-2 bg-red-50 rounded">
                                            <p className="text-red-600 font-medium">
                                                {vital.bp}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                BP
                                            </p>
                                        </div>
                                        <div className="text-center p-2 bg-orange-50 rounded">
                                            <p className="text-orange-600 font-medium">
                                                {vital.temp}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Temp
                                            </p>
                                        </div>
                                        <div className="text-center p-2 bg-green-50 rounded">
                                            <p className="text-green-600 font-medium">
                                                {vital.pulse}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Pulse
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow Actions */}
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nursing Workflow</CardTitle>
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
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Register Patient
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
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Start Screening
                                </span>
                            </button>

                            <button className="flex flex-col items-center justify-center px-6 py-8 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105">
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
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Record Vitals
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Patient Triage
                                </span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default NurseDashboard;
