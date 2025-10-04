import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: string | number;
    active?: boolean;
}

interface SidebarProps {
    items: SidebarItem[];
    isCollapsed?: boolean;
    onToggle?: () => void;
    userRole?: string;
    userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    items,
    isCollapsed = false,
    onToggle,
    userRole = "User",
    userName = "John Doe",
}) => {
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (confirm("Are you sure you want to logout?")) {
            await logout();
        }
    };

    return (
        <div
            className={cn(
                "bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out flex flex-col",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Klinik
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {userRole}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            className={cn(
                                "w-4 h-4 text-gray-600 transition-transform",
                                isCollapsed && "rotate-180"
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 flex-1">
                {items.map((item, index) => {
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={index}
                            to={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                "hover:bg-gray-50 hover:translate-x-1",
                                isActive
                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                    : "text-gray-700 hover:text-gray-900"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex-shrink-0 w-5 h-5",
                                    isActive ? "text-blue-600" : "text-gray-500"
                                )}
                            >
                                {item.icon}
                            </div>

                            {!isCollapsed && (
                                <>
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200">
                {!isCollapsed && (
                    <div className="space-y-3">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {userName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {userName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {userRole}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}

                {/* Collapsed logout */}
                {isCollapsed && (
                    <button
                        onClick={handleLogout}
                        className="w-full p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Logout"
                    >
                        <svg
                            className="w-5 h-5 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
