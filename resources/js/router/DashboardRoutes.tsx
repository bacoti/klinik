import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PatientManagement from "@/pages/admin/PatientManagement";
import AppointmentManagement from "@/pages/admin/AppointmentManagement";
import StaffManagement from "@/pages/admin/StaffManagement";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorQueue from "@/pages/doctor/DoctorQueue";
import MedicalRecords from "@/pages/doctor/MedicalRecords";
import DoctorPrescriptions from "@/pages/doctor/DoctorPrescriptions";
import MyPatients from "@/pages/doctor/MyPatients";
import NurseDashboard from "@/pages/nurse/NurseDashboard";
import PatientRegistration from "@/pages/nurse/PatientRegistration";
import VitalSigns from "@/pages/nurse/VitalSigns";
import PatientQueue from "@/pages/nurse/PatientQueue";
import PatientScreening from "@/pages/nurse/PatientScreening";
import NursingNotes from "@/pages/nurse/NursingNotes";
import PharmacistDashboard from "@/pages/pharmacist/PharmacistDashboard";
import PharmacistPrescriptions from "@/pages/pharmacist/PharmacistPrescriptions";
import MedicineInventory from "@/pages/pharmacist/MedicineInventory";
import DispensingLog from "@/pages/pharmacist/DispensingLog";
import StockManagement from "@/pages/pharmacist/StockManagement";
import SalesReport from "@/pages/pharmacist/SalesReport";
import ApiTest from "@/components/test/ApiTest";

const DashboardRoutes = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Get default route for user role
    const getDefaultRoute = () => {
        if (!user) return "/admin/dashboard";

        console.log("DashboardRoutes - Current user:", user);
        console.log("DashboardRoutes - User role:", user.role);
        console.log("DashboardRoutes - User role name:", user.role.name);

        switch (user.role.name) {
            case "admin":
                return "/admin/dashboard";
            case "doctor":
                return "/doctor/dashboard";
            case "nurse":
                return "/nurse/dashboard";
            case "pharmacist":
                return "/pharmacist/dashboard";
            default:
                console.log(
                    "DashboardRoutes - Unknown role, defaulting to admin"
                );
                return "/admin/dashboard";
        }
    };

    // Show loading while determining user role
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect root path to user's default dashboard
    if (location.pathname === "/" && user) {
        return <Navigate to={getDefaultRoute()} replace />;
    }

    return (
        <Routes>
            {/* Test Route */}
            <Route path="/test-api" element={<ApiTest />} />

            {/* General Management Routes - Accessible by all authenticated users */}
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/appointments" element={<AppointmentManagement />} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<PatientManagement />} />
            <Route
                path="/admin/appointments"
                element={<AppointmentManagement />}
            />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route
                path="/admin/reports"
                element={<div className="p-6">Reports & Analytics Page</div>}
            />
            <Route
                path="/admin/settings"
                element={<div className="p-6">System Settings Page</div>}
            />

            {/* Doctor Dashboard Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<MyPatients />} />
            <Route
                path="/doctor/appointments"
                element={<AppointmentManagement />}
            />
            <Route
                path="/doctor/queue"
                element={<DoctorQueue />}
            />
            <Route
                path="/doctor/records"
                element={<MedicalRecords />}
            />
            <Route
                path="/doctor/prescriptions"
                element={<DoctorPrescriptions />}
            />

            {/* Nurse Dashboard Routes */}
            <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            <Route path="/nurse/patients" element={<PatientManagement />} />
            <Route
                path="/nurse/appointments"
                element={<AppointmentManagement />}
            />
            <Route
                path="/nurse/registration"
                element={<PatientRegistration />}
            />
            <Route path="/nurse/vitals" element={<VitalSigns />} />
            <Route
                path="/nurse/queue"
                element={<PatientQueue />}
            />
            <Route
                path="/nurse/screening"
                element={<PatientScreening />}
            />
            <Route
                path="/nurse/notes"
                element={<NursingNotes />}
            />

            {/* Pharmacist Dashboard Routes */}
            <Route
                path="/pharmacist/dashboard"
                element={<PharmacistDashboard />}
            />
            <Route
                path="/pharmacist/patients"
                element={<PatientManagement />}
            />
            <Route
                path="/pharmacist/appointments"
                element={<AppointmentManagement />}
            />
            <Route
                path="/pharmacist/prescriptions"
                element={<PharmacistPrescriptions />}
            />
            <Route
                path="/pharmacist/inventory"
                element={<MedicineInventory />}
            />
            <Route
                path="/pharmacist/dispensing"
                element={<DispensingLog />}
            />
            <Route
                path="/pharmacist/stock"
                element={<StockManagement />}
            />
            <Route
                path="/pharmacist/reports"
                element={<SalesReport />}
            />

            {/* Catch all - redirect to user's default dashboard */}
            <Route
                path="*"
                element={<Navigate to={getDefaultRoute()} replace />}
            />
        </Routes>
    );
};

export default DashboardRoutes;
