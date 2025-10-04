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
import {
    Form,
    FormGroup,
    FormRow,
    FormActions,
    FormProgress,
} from "@/components/ui/form";
import {
    Activity,
    User,
    Mail,
    Lock,
    Phone,
    MapPin,
    Calendar,
    Eye,
    EyeOff,
} from "lucide-react";

// Register page mengikuti prinsip UI: Progressive disclosure, Chunking, Error prevention
const RegisterPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "nurse", // Default role
        phone: "",
        address: "",
        gender: "" as "male" | "female" | "",
        birth_date: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { register } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();

    // Form steps - prinsip progressive disclosure
    const steps = ["Akun", "Profil", "Konfirmasi"];

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    // Validation functions - prinsip error prevention
    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 0) {
            // Step 1: Account info
            if (!formData.name.trim())
                newErrors.name = "Nama lengkap harus diisi";
            if (!formData.email.trim()) newErrors.email = "Email harus diisi";
            else if (!formData.email.includes("@"))
                newErrors.email = "Format email tidak valid";
            if (!formData.password) newErrors.password = "Password harus diisi";
            else if (formData.password.length < 8)
                newErrors.password = "Password minimal 8 karakter";
            if (!formData.password_confirmation)
                newErrors.password_confirmation =
                    "Konfirmasi password harus diisi";
            else if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Password tidak cocok";
            }
        } else if (step === 1) {
            // Step 2: Profile info (optional but validate format if filled)
            if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
                newErrors.phone = "Format nomor telepon tidak valid";
            }
            if (
                formData.birth_date &&
                new Date(formData.birth_date) > new Date()
            ) {
                newErrors.birth_date = "Tanggal lahir tidak valid";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        setLoading(true);

        try {
            const submitData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role: formData.role,
                phone: formData.phone,
                address: formData.address,
                gender:
                    formData.gender === ""
                        ? undefined
                        : (formData.gender as "male" | "female"),
                birth_date: formData.birth_date,
            };
            await register(submitData);
            success("Pendaftaran berhasil! Selamat datang di Sistem Klinik");
            navigate("/dashboard");
        } catch (err: any) {
            toastError("Pendaftaran gagal", err.message);
            // Handle validation errors from server
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <FormGroup
                        title="Informasi Akun"
                        description="Buat akun untuk mengakses sistem klinik"
                    >
                        <FormRow columns={1}>
                            <Input
                                label="Nama Lengkap"
                                placeholder="Masukkan nama lengkap Anda"
                                value={formData.name}
                                onChange={(e) =>
                                    updateFormData("name", e.target.value)
                                }
                                error={errors.name}
                                required
                                icon={<User className="w-4 h-4" />}
                                disabled={loading}
                            />

                            <Input
                                type="email"
                                label="Email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                    updateFormData("email", e.target.value)
                                }
                                error={errors.email}
                                required
                                icon={<Mail className="w-4 h-4" />}
                                hint="Email akan digunakan untuk login"
                                disabled={loading}
                            />

                            <Input
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                placeholder="Minimal 8 karakter"
                                value={formData.password}
                                onChange={(e) =>
                                    updateFormData("password", e.target.value)
                                }
                                error={errors.password}
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

                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                label="Konfirmasi Password"
                                placeholder="Ulangi password Anda"
                                value={formData.password_confirmation}
                                onChange={(e) =>
                                    updateFormData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                error={errors.password_confirmation}
                                required
                                icon={<Lock className="w-4 h-4" />}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                                disabled={loading}
                            />
                        </FormRow>
                    </FormGroup>
                );

            case 1:
                return (
                    <FormGroup
                        title="Informasi Profil"
                        description="Lengkapi profil Anda (opsional)"
                    >
                        <FormRow columns={1}>
                            <Input
                                label="Nomor Telepon"
                                placeholder="08xxxxxxxxxx"
                                value={formData.phone}
                                onChange={(e) =>
                                    updateFormData("phone", e.target.value)
                                }
                                error={errors.phone}
                                icon={<Phone className="w-4 h-4" />}
                                hint="Nomor telepon untuk komunikasi darurat"
                                disabled={loading}
                            />

                            <Input
                                label="Alamat"
                                placeholder="Alamat lengkap Anda"
                                value={formData.address}
                                onChange={(e) =>
                                    updateFormData("address", e.target.value)
                                }
                                error={errors.address}
                                icon={<MapPin className="w-4 h-4" />}
                                disabled={loading}
                            />

                            <FormRow columns={2}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) =>
                                            updateFormData(
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    >
                                        <option value="">
                                            Pilih jenis kelamin
                                        </option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">
                                            Perempuan
                                        </option>
                                    </select>
                                </div>

                                <Input
                                    type="date"
                                    label="Tanggal Lahir"
                                    value={formData.birth_date}
                                    onChange={(e) =>
                                        updateFormData(
                                            "birth_date",
                                            e.target.value
                                        )
                                    }
                                    error={errors.birth_date}
                                    icon={<Calendar className="w-4 h-4" />}
                                    disabled={loading}
                                />
                            </FormRow>
                        </FormRow>
                    </FormGroup>
                );

            case 2:
                return (
                    <FormGroup
                        title="Konfirmasi Pendaftaran"
                        description="Periksa kembali informasi Anda"
                    >
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                    Ringkasan Informasi:
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Nama:
                                        </span>
                                        <span className="font-medium">
                                            {formData.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email:
                                        </span>
                                        <span className="font-medium">
                                            {formData.email}
                                        </span>
                                    </div>
                                    {formData.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Telepon:
                                            </span>
                                            <span className="font-medium">
                                                {formData.phone}
                                            </span>
                                        </div>
                                    )}
                                    {formData.gender && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Jenis Kelamin:
                                            </span>
                                            <span className="font-medium">
                                                {formData.gender === "male"
                                                    ? "Laki-laki"
                                                    : "Perempuan"}
                                            </span>
                                        </div>
                                    )}
                                    {formData.birth_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Tanggal Lahir:
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    formData.birth_date
                                                ).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Alert variant="info">
                                <AlertDescription>
                                    Dengan mendaftar, Anda setuju dengan syarat
                                    dan ketentuan penggunaan sistem klinik ini.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </FormGroup>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Daftar Sebagai Pasien
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Buat akun baru untuk mengakses layanan klinik
                    </p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-center">
                            Pendaftaran Pasien
                        </CardTitle>
                        <CardDescription className="text-center">
                            Lengkapi formulir berikut untuk membuat akun baru
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Progress indicator */}
                        <FormProgress
                            steps={steps}
                            currentStep={currentStep}
                            completedSteps={Array.from(
                                { length: currentStep },
                                (_, i) => i
                            )}
                        />

                        <Form onSubmit={handleSubmit} loading={loading}>
                            {renderStepContent()}

                            <FormActions
                                align={currentStep === 0 ? "right" : "between"}
                                className="mt-8"
                            >
                                {currentStep > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                        disabled={loading}
                                    >
                                        Kembali
                                    </Button>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={loading}
                                    >
                                        Lanjut
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        loadingText="Mendaftar..."
                                    >
                                        Daftar
                                    </Button>
                                )}
                            </FormActions>
                        </Form>

                        {/* Login link */}
                        <div className="mt-6 text-center border-t border-gray-200 pt-6">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
