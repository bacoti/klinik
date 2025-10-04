import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats, isAdminStats } from "@/hooks/useDashboardStats";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { formatCurrency } from "@/lib/utils";

const AdminDashboard: React.FC = () => {
    const { stats, loading: statsLoading, error: statsError, refetch } = useDashboardStats();
    const { activities, loading: activitiesLoading } = useRecentActivities(4);

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
            href: "/admin/dashboard",
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
            label: "Staff Management",
            href: "/admin/staff",
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
            label: "Patient Management",
            href: "/admin/patients",
            badge: stats && isAdminStats(stats) ? stats.pending_appointments : undefined,
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
            label: "Reports & Analytics",
            href: "/admin/reports",
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                ),
                label: "System Settings",
                href: "/admin/settings",
            },
        ];

    // Error handling
    if (statsError) {
        return (
            <DashboardLayout sidebarItems={sidebarItems} title="Admin Dashboard">
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading dashboard data</p>
                        <button 
                            onClick={refetch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
            <DashboardLayout sidebarItems={sidebarItems} title="Admin Dashboard">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Patients"
                        value={statsLoading ? "..." : (stats && isAdminStats(stats) ? stats.total_patients.toLocaleString() : "0")}
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        }
                        color="blue"
                        loading={statsLoading}
                    />

                    <StatCard
                        title="Active Staff"
                        value={statsLoading ? "..." : (stats && isAdminStats(stats) ? stats.total_staff : "0")}
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
                        loading={statsLoading}
                    />

                    <StatCard
                        title="Today's Appointments"
                        value={statsLoading ? "..." : (stats && isAdminStats(stats) ? stats.todays_appointments : "0")}
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        }
                        color="yellow"
                        loading={statsLoading}
                    />

                    <StatCard
                        title="Monthly Revenue"
                        value={statsLoading ? "..." : (stats && isAdminStats(stats) ? formatCurrency(stats.monthly_revenue) : "Rp 0")}
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        }
                        color="purple"
                        loading={statsLoading}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activitiesLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex items-center space-x-4 p-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : activities.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No recent activities</p>
                                ) : (
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                                                    <svg
                                                        className={`w-5 h-5 text-${activity.color}-600`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(activity.time).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions & Additional Stats */}
                    <div className="space-y-6">
                        {/* Additional Stats */}
                        {stats && isAdminStats(stats) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Pending Appointments</span>
                                            <span className="font-semibold">{stats.pending_appointments}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Active Doctors</span>
                                            <span className="font-semibold">{stats.active_doctors}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Low Stock Medicines</span>
                                            <span className="font-semibold text-red-600">{stats.low_stock_medicines}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Examinations Today</span>
                                            <span className="font-semibold">{stats.completed_examinations_today}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Add New Staff
                                    </button>
                                    <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Generate Report
                                    </button>
                                    <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        System Settings
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        );
    };

export default AdminDashboard;