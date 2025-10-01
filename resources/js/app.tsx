import "./bootstrap";

import { createRoot } from "react-dom/client";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import DashboardRoutes from "@/router/DashboardRoutes";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<DashboardRoutes />} />
            </Routes>
        </Router>
    );
};

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
