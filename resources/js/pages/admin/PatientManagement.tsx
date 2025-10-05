import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PatientManagement from "@/components/tables/PatientManagement";
import { getAdminSidebarItems } from "@/config/adminSidebar";

const PatientManagementPage: React.FC = () => {
    const sidebarItems = getAdminSidebarItems("/admin/patients");

    return (
        <DashboardLayout sidebarItems={sidebarItems} title="Patient Management">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Patient Management
                        </h1>
                        <p className="text-gray-600">
                            Manage patient records, registration, and
                            information
                        </p>
                    </div>
                </div>

                <PatientManagement />
            </div>
        </DashboardLayout>
    );
};

export default PatientManagementPage;
