import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {
    User,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ApiResponse,
} from "../types";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Setup axios defaults
axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add token to requests if available
const token = localStorage.getItem("auth_token");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                // Verify token is still valid
                const response = await axios.get<ApiResponse<User>>("/user");
                if (response.data.success && response.data.data) {
                    setUser(response.data.data);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.data)
                    );
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                delete axios.defaults.headers.common["Authorization"];
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await axios.post<ApiResponse<AuthResponse>>(
                "/login",
                credentials
            );

            if (response.data.success && response.data.data) {
                const { user: userData, token } = response.data.data;

                setUser(userData);
                localStorage.setItem("auth_token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
            } else {
                throw new Error(response.data.message || "Login failed");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await axios.post<ApiResponse<AuthResponse>>(
                "/register",
                data
            );

            if (response.data.success && response.data.data) {
                const { user: userData, token } = response.data.data;

                setUser(userData);
                localStorage.setItem("auth_token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
            } else {
                throw new Error(response.data.message || "Registration failed");
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            throw new Error(
                error.response?.data?.message || "Registration failed"
            );
        }
    };

    const logout = async () => {
        try {
            await axios.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            const response = await axios.put<ApiResponse<User>>(
                "/profile",
                data
            );

            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.data)
                );
            } else {
                throw new Error(
                    response.data.message || "Profile update failed"
                );
            }
        } catch (error: any) {
            console.error("Profile update error:", error);
            throw new Error(
                error.response?.data?.message || "Profile update failed"
            );
        }
    };

    const value = {
        user,
        loading,
        login,
        register: register, // alias for consistency with RegisterPage
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
