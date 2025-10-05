import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User, Mail, Briefcase } from "lucide-react";

interface Role {
    id: number;
    name: string;
    display_name: string;
}

interface Staff {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: {
        id: number;
        name: string;
        display_name: string;
    };
    specialization?: string;
    license_number?: string;
    hire_date: string;
    birth_date: string;
    gender: "male" | "female";
    address: string;
    status: "active" | "inactive" | "suspended";
    department?: string;
    shift?: "morning" | "afternoon" | "night" | "on_call";
    salary?: number;
}

interface StaffRegistrationFormProps {
    staff?: Staff | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const StaffRegistrationForm: React.FC<StaffRegistrationFormProps> = ({
    staff,
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role_id: "",
        specialization: "",
        license_number: "",
        hire_date: "",
        birth_date: "",
        gender: "male" as "male" | "female",
        address: "",
        status: "active" as "active" | "inactive" | "suspended",
        department: "",
        shift: "morning" as "morning" | "afternoon" | "night" | "on_call",
        salary: "",
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        fetchRoles();
        if (staff) {
            setFormData({
                name: staff.name,
                email: staff.email,
                phone: staff.phone,
                password: "",
                password_confirmation: "",
                role_id: staff.role.id.toString(),
                specialization: staff.specialization || "",
                license_number: staff.license_number || "",
                hire_date: staff.hire_date.split("T")[0], // Extract date part
                birth_date: staff.birth_date.split("T")[0], // Extract date part
                gender: staff.gender,
                address: staff.address,
                status: staff.status,
                department: staff.department || "",
                shift: staff.shift || "morning",
                salary: staff.salary?.toString() || "",
            });
        }
    }, [staff]);

    const fetchRoles = async () => {
        try {
            const response = await api.get("/roles");
            setRoles(response.data.data || []);
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

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

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrors({});

        try {
            const submitData: any = {
                ...formData,
                salary: formData.salary
                    ? parseFloat(formData.salary)
                    : undefined,
            };

            // Don't send password fields if editing and passwords are empty
            if (staff && !submitData.password) {
                delete (submitData as any).password;
                delete (submitData as any).password_confirmation;
            }

            if (staff) {
                await api.put(`/staff/${staff.id}`, submitData);
            } else {
                await api.post("/staff", submitData);
            }

            onSuccess();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setError(
                    err.response?.data?.message ||
                        `Failed to ${staff ? "update" : "create"} staff member`
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const getDepartmentOptions = (roleName: string) => {
        const departmentMap: Record<string, string[]> = {
            doctor: [
                "Emergency",
                "Cardiology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "General Medicine",
            ],
            nurse: [
                "Emergency",
                "ICU",
                "General Ward",
                "Pediatrics",
                "Surgery",
                "Maternity",
            ],
            pharmacist: [
                "Inpatient Pharmacy",
                "Outpatient Pharmacy",
                "Clinical Pharmacy",
            ],
            admin: ["Administration", "Finance", "HR", "IT"],
            receptionist: ["Front Desk", "Registration", "Billing"],
        };
        return departmentMap[roleName] || [];
    };

    const selectedRole = roles.find(
        (role) => role.id.toString() === formData.role_id
    );
    const departmentOptions = selectedRole
        ? getDepartmentOptions(selectedRole.name)
        : [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender *
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.gender[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Birth Date *
                        </label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.birth_date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.birth_date[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone[0]}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.address[0]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.status[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {!staff && "*"}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={!staff}
                        />
                        {staff && (
                            <p className="text-xs text-gray-500 mt-1">
                                Leave blank to keep current password
                            </p>
                        )}
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password {!staff && "*"}
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={!staff}
                        />
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.display_name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.role_id[0]}
                            </p>
                        )}
                    </div>

                    {departmentOptions.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Department</option>
                                {departmentOptions.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hire Date *
                        </label>
                        <input
                            type="date"
                            name="hire_date"
                            value={formData.hire_date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.hire_date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.hire_date[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shift
                        </label>
                        <select
                            name="shift"
                            value={formData.shift}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="morning">
                                Morning (07:00 - 15:00)
                            </option>
                            <option value="afternoon">
                                Afternoon (15:00 - 23:00)
                            </option>
                            <option value="night">Night (23:00 - 07:00)</option>
                            <option value="on_call">On Call</option>
                        </select>
                    </div>

                    {selectedRole?.name === "doctor" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Cardiology, Neurology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Medical license number"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary (IDR)
                        </label>
                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Monthly salary in IDR"
                            min="0"
                            step="100000"
                        />
                        {errors.salary && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.salary[0]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : staff
                        ? "Update Staff"
                        : "Create Staff"}
                </button>
            </div>
        </form>
    );
};

export default StaffRegistrationForm;
