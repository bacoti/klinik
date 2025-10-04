import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: Array<{
        icon: React.ReactNode;
        label: string;
        href: string;
        badge?: string | number;
    }>;
    title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    sidebarItems,
    title = "Dashboard",
}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user } = useAuth();

    // Get role display name
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "admin":
                return "Administrator";
            case "doctor":
                return "Doctor";
            case "nurse":
                return "Nurse";
            case "pharmacist":
                return "Pharmacist";
            default:
                return "User";
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                items={sidebarItems}
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                userRole={user ? getRoleDisplayName(user.role.name) : "User"}
                userName={user?.name || "Unknown User"}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date().toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            {/* User info */}
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user
                                        ? getRoleDisplayName(user.role.name)
                                        : "User"}
                                </p>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
                                        d="M15 17h5l-5 5v-5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Settings */}
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
};
