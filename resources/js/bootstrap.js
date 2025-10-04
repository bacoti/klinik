import axios from "axios";

// Configure axios defaults
window.axios = axios;

// Set default headers
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers.common["Accept"] = "application/json";
window.axios.defaults.headers.common["Content-Type"] = "application/json";

// Set base URL for API calls
window.axios.defaults.baseURL = "/api";

// Configure CSRF token handling for Sanctum
window.axios.defaults.withCredentials = true;

// Add token from localStorage if available
const token = localStorage.getItem("auth_token");
if (token) {
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Response interceptor to handle auth errors
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            delete window.axios.defaults.headers.common["Authorization"];

            // Redirect to login if not already there
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
