import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormActions } from "@/components/ui/form";
import { Activity, Eye, EyeOff, Mail, Lock } from "lucide-react";

// Login page mengikuti prinsip UI: Simplicity, Error prevention, Recognition rather than recall
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();

    // Demo accounts info - prinsip help and documentation
    const demoAccounts = [
        { role: "Admin", email: "admin@klinik.com", password: "password123" },
        { role: "Dokter", email: "dokter@klinik.com", password: "password123" },
        {
            role: "Perawat",
            email: "perawat@klinik.com",
            password: "password123",
        },
        {
            role: "Apoteker",
            email: "apoteker@klinik.com",
            password: "password123",
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Client-side validation - prinsip error prevention
        if (!email || !password) {
            setError("Email dan password harus diisi");
            setLoading(false);
            return;
        }

        if (!email.includes("@")) {
            setError("Format email tidak valid");
            setLoading(false);
            return;
        }

        try {
            await login({ email, password });
            success("Login berhasil! Selamat datang di Sistem Klinik");
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login gagal. Silakan coba lagi.");
            toastError("Login gagal", err.message);
        } finally {
            setLoading(false);
        }
    };

    const fillDemoAccount = (account: (typeof demoAccounts)[0]) => {
        setEmail(account.email);
        setPassword(account.password);
        setError("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header dengan branding - prinsip recognition */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Sistem Informasi Klinik
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl font-semibold text-center">
                            Masuk
                        </CardTitle>
                        <CardDescription className="text-center">
                            Gunakan email dan password untuk mengakses sistem
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Error alert - prinsip feedback */}
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit} loading={loading}>
                            <div className="space-y-4">
                                {/* Email input dengan icon - prinsip affordance */}
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="nama@klinik.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    icon={<Mail className="w-4 h-4" />}
                                    hint="Masukkan alamat email yang terdaftar"
                                    disabled={loading}
                                />

                                {/* Password input dengan show/hide - prinsip user control */}
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    placeholder="Masukkan password Anda"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                    suffix={
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    }
                                    disabled={loading}
                                />
                            </div>

                            <FormActions className="mt-6">
                                <Button
                                    type="submit"
                                    loading={loading}
                                    loadingText="Memproses..."
                                    className="w-full"
                                    size="lg"
                                >
                                    Masuk
                                </Button>
                            </FormActions>
                        </Form>

                        {/* Demo accounts - prinsip help and documentation */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 text-center mb-3">
                                Akun Demo:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {demoAccounts.map((account, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fillDemoAccount(account)}
                                        disabled={loading}
                                        className="text-xs"
                                    >
                                        {account.role}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Register link - prinsip navigation */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Daftar sebagai pasien
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer info */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 Sistem Informasi Klinik. Semua hak dilindungi.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
