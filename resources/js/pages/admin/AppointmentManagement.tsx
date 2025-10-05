import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AppointmentManagementTable from "@/components/tables/AppointmentManagementTable";
import { getAdminSidebarItems } from "@/config/adminSidebar";

const AppointmentManagement: React.FC = () => {
    const sidebarItems = getAdminSidebarItems("/admin/appointments");

    return (
        <DashboardLayout
            sidebarItems={sidebarItems}
            title="Appointment Management"
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Appointment Management
                        </h1>
                        <p className="text-gray-600">
                            Manage patient appointments, scheduling, and status
                            updates
                        </p>
                    </div>
                </div>

                <AppointmentManagementTable />
            </div>
        </DashboardLayout>
    );
};

export default AppointmentManagement;
