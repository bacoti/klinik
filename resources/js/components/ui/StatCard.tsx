import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "blue" | "green" | "yellow" | "red" | "purple";
    loading?: boolean;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    color = "blue",
    loading = false,
    className,
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        red: "bg-red-50 text-red-600 border-red-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    if (loading) {
        return (
            <div
                className={cn(
                    "bg-white rounded-xl p-6 border border-gray-100 shadow-sm",
                    "animate-pulse",
                    className
                )}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-white rounded-xl p-6 border border-gray-100 shadow-sm",
                "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                        {value}
                    </p>

                    {trend && (
                        <div className="flex items-center space-x-1">
                            <svg
                                className={cn(
                                    "w-4 h-4",
                                    trend.isPositive
                                        ? "text-green-500 rotate-0"
                                        : "text-red-500 rotate-180"
                                )}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    trend.isPositive
                                        ? "text-green-600"
                                        : "text-red-600"
                                )}
                            >
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-sm text-gray-500">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        colorClasses[color]
                    )}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};
