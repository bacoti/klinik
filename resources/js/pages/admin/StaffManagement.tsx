import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import StaffManagement from "@/components/tables/StaffManagement";
import { getAdminSidebarItems } from "@/config/adminSidebar";

const StaffManagementPage: React.FC = () => {
    const sidebarItems = getAdminSidebarItems("/admin/staff");

    return (
        <DashboardLayout sidebarItems={sidebarItems} title="Staff Management">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Staff Management
                        </h1>
                        <p className="text-gray-600">
                            Manage hospital staff, roles, and employee
                            information
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Staff
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    --
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Active Doctors
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    --
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-green-600"
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
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Active Nurses
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    --
                                </p>
                            </div>
                            <div className="p-3 bg-pink-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-pink-600"
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
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Support Staff
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    --
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff Management Component */}
                <StaffManagement />
            </div>
        </DashboardLayout>
    );
};

export default StaffManagementPage;
