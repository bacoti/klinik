import "./bootstrap";

import { createRoot } from "react-dom/client";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import DashboardRoutes from "@/router/DashboardRoutes";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected dashboard routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <DashboardRoutes />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
