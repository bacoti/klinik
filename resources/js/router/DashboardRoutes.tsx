import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import NurseDashboard from '@/pages/nurse/NurseDashboard';
import PharmacistDashboard from '@/pages/pharmacist/PharmacistDashboard';

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Real Dashboard Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/nurse/dashboard" element={<NurseDashboard />} />
      <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
      
      {/* Placeholder routes */}
      <Route path="/doctor/appointments" element={<div className="p-6">Doctor Appointments Page</div>} />
      <Route path="/doctor/queue" element={<div className="p-6">Doctor Queue Page</div>} />
      <Route path="/doctor/patients" element={<div className="p-6">Doctor Patients Page</div>} />
      <Route path="/doctor/records" element={<div className="p-6">Medical Records Page</div>} />
      <Route path="/doctor/prescriptions" element={<div className="p-6">Doctor Prescriptions Page</div>} />
      
      <Route path="/nurse/registration" element={<div className="p-6">Patient Registration Page</div>} />
      <Route path="/nurse/vitals" element={<div className="p-6">Vital Signs Page</div>} />
      <Route path="/nurse/screening" element={<div className="p-6">Patient Screening Page</div>} />
      <Route path="/nurse/triage" element={<div className="p-6">Patient Triage Page</div>} />
      <Route path="/nurse/medication" element={<div className="p-6">Medication Administration Page</div>} />
      
      <Route path="/pharmacist/prescriptions" element={<div className="p-6">Pharmacist Prescriptions Page</div>} />
      <Route path="/pharmacist/inventory" element={<div className="p-6">Medicine Inventory Page</div>} />
      <Route path="/pharmacist/dispensing" element={<div className="p-6">Dispensing Log Page</div>} />
      <Route path="/pharmacist/stock" element={<div className="p-6">Stock Management Page</div>} />
      <Route path="/pharmacist/reports" element={<div className="p-6">Sales Report Page</div>} />
      
      {/* Error Routes */}
      <Route path="/unauthorized" element={<div className="p-6 text-center">Unauthorized Access</div>} />
      <Route path="/login" element={<div className="p-6 text-center">Login Page</div>} />
      <Route path="*" element={<div className="p-6 text-center">Page Not Found - Route: {window.location.pathname}</div>} />
    </Routes>
  );
};

export default DashboardRoutes;