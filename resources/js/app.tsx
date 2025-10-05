import "./bootstrap";

import { createRoot } from "react-dom/client";
import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import DashboardRoutes from "@/router/DashboardRoutes";

// Inertia App
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

// React Router App (fallback)
const ReactApp: React.FC = () => {
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

// Fallback mount for non-Inertia routes
const appElement = document.getElementById("app");
if (appElement && !appElement.hasAttribute("data-page")) {
    const root = createRoot(appElement);
    root.render(<ReactApp />);
}
