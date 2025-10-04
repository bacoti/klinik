import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PatientManagement from "@/pages/admin/PatientManagement";
import AppointmentManagement from "@/pages/admin/AppointmentManagement";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import NurseDashboard from "@/pages/nurse/NurseDashboard";
import PharmacistDashboard from "@/pages/pharmacist/PharmacistDashboard";
import ApiTest from "@/components/test/ApiTest";

const DashboardRoutes = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Get default route for user role
    const getDefaultRoute = () => {
        if (!user) return "/admin/dashboard";
        
        console.log('DashboardRoutes - Current user:', user);
        console.log('DashboardRoutes - User role:', user.role);
        console.log('DashboardRoutes - User role name:', user.role.name);
        
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
                console.log('DashboardRoutes - Unknown role, defaulting to admin');
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
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<PatientManagement />} />
            <Route path="/admin/appointments" element={<AppointmentManagement />} />
            <Route
                path="/admin/staff"
                element={<div className="p-6">Staff Management Page</div>}
            />
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
            <Route
                path="/doctor/appointments"
                element={<div className="p-6">Doctor Appointments Page</div>}
            />
            <Route
                path="/doctor/queue"
                element={<div className="p-6">Doctor Queue Page</div>}
            />
            <Route
                path="/doctor/patients"
                element={<div className="p-6">Doctor Patients Page</div>}
            />
            <Route
                path="/doctor/records"
                element={<div className="p-6">Medical Records Page</div>}
            />
            <Route
                path="/doctor/prescriptions"
                element={<div className="p-6">Doctor Prescriptions Page</div>}
            />

            {/* Nurse Dashboard Routes */}
            <Route path="/nurse/dashboard" element={<NurseDashboard />} />
            <Route
                path="/nurse/registration"
                element={<div className="p-6">Patient Registration Page</div>}
            />
            <Route
                path="/nurse/vitals"
                element={<div className="p-6">Vital Signs Page</div>}
            />
            <Route
                path="/nurse/screening"
                element={<div className="p-6">Patient Screening Page</div>}
            />
            <Route
                path="/nurse/triage"
                element={<div className="p-6">Patient Triage Page</div>}
            />
            <Route
                path="/nurse/medication"
                element={
                    <div className="p-6">Medication Administration Page</div>
                }
            />

            {/* Pharmacist Dashboard Routes */}
            <Route
                path="/pharmacist/dashboard"
                element={<PharmacistDashboard />}
            />
            <Route
                path="/pharmacist/prescriptions"
                element={
                    <div className="p-6">Pharmacist Prescriptions Page</div>
                }
            />
            <Route
                path="/pharmacist/inventory"
                element={<div className="p-6">Medicine Inventory Page</div>}
            />
            <Route
                path="/pharmacist/dispensing"
                element={<div className="p-6">Dispensing Log Page</div>}
            />
            <Route
                path="/pharmacist/stock"
                element={<div className="p-6">Stock Management Page</div>}
            />
            <Route
                path="/pharmacist/reports"
                element={<div className="p-6">Sales Report Page</div>}
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
