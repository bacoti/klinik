import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface PatientFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    birth_date: string;
    gender: "male" | "female" | "";
    emergency_contact_name: string;
    emergency_contact_phone: string;
    blood_type: string;
    allergies: string;
    medical_history: string;
    insurance_number: string;
    insurance_provider: string;
}

interface PatientRegistrationFormProps {
    onSuccess?: (patient: any) => void;
    onCancel?: () => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<PatientFormData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        birth_date: "",
        gender: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        blood_type: "",
        allergies: "",
        medical_history: "",
        insurance_number: "",
        insurance_provider: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string[]> = {};

        // Required fields validation
        if (!formData.name.trim()) {
            newErrors.name = ["Name is required"];
        }

        if (!formData.phone.trim()) {
            newErrors.phone = ["Phone number is required"];
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = ["Invalid phone number format"];
        }

        if (!formData.address.trim()) {
            newErrors.address = ["Address is required"];
        }

        if (!formData.birth_date) {
            newErrors.birth_date = ["Birth date is required"];
        }

        if (!formData.gender) {
            newErrors.gender = ["Gender is required"];
        }

        // Email validation (optional but must be valid if provided)
        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = ["Invalid email format"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/patients", formData);

            if (response.data.success) {
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    birth_date: "",
                    gender: "",
                    emergency_contact_name: "",
                    emergency_contact_phone: "",
                    blood_type: "",
                    allergies: "",
                    medical_history: "",
                    insurance_number: "",
                    insurance_provider: "",
                });

                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: [
                        error.response?.data?.message || "Registration failed",
                    ],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (fieldName: string): string => {
        return errors[fieldName]?.[0] || "";
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Patient Registration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-red-800 text-sm">
                                {errors.general[0]}
                            </p>
                        </div>
                    )}

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Personal Information
                            </h3>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("name")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter full name"
                            />
                            {getFieldError("name") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("name")}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("email")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter email address"
                            />
                            {getFieldError("email") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("email")}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("phone")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter phone number"
                            />
                            {getFieldError("phone") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("phone")}
                                </p>
                            )}
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label
                                htmlFor="birth_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Birth Date *
                            </label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("birth_date")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {getFieldError("birth_date") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("birth_date")}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Gender *
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("gender")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {getFieldError("gender") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("gender")}
                                </p>
                            )}
                        </div>

                        {/* Blood Type */}
                        <div>
                            <label
                                htmlFor="blood_type"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Blood Type
                            </label>
                            <select
                                id="blood_type"
                                name="blood_type"
                                value={formData.blood_type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Blood Type</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("address")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter complete address"
                            />
                            {getFieldError("address") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("address")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Emergency Contact
                            </h3>
                        </div>

                        <div>
                            <label
                                htmlFor="emergency_contact_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Emergency Contact Name
                            </label>
                            <input
                                type="text"
                                id="emergency_contact_name"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter emergency contact name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="emergency_contact_phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Emergency Contact Phone
                            </label>
                            <input
                                type="tel"
                                id="emergency_contact_phone"
                                name="emergency_contact_phone"
                                value={formData.emergency_contact_phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter emergency contact phone"
                            />
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Medical Information
                        </h3>

                        <div>
                            <label
                                htmlFor="allergies"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Allergies
                            </label>
                            <textarea
                                id="allergies"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="List any known allergies"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="medical_history"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Medical History
                            </label>
                            <textarea
                                id="medical_history"
                                name="medical_history"
                                value={formData.medical_history}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter relevant medical history"
                            />
                        </div>
                    </div>

                    {/* Insurance Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Insurance Information
                            </h3>
                        </div>

                        <div>
                            <label
                                htmlFor="insurance_provider"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Insurance Provider
                            </label>
                            <input
                                type="text"
                                id="insurance_provider"
                                name="insurance_provider"
                                value={formData.insurance_provider}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter insurance provider"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="insurance_number"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Insurance Number
                            </label>
                            <input
                                type="text"
                                id="insurance_number"
                                name="insurance_number"
                                value={formData.insurance_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter insurance number"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registering..." : "Register Patient"}
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default PatientRegistrationForm;
