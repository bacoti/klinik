import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import StaffRegistrationForm from "@/components/forms/StaffRegistrationForm";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit,
    Trash2,
    Plus,
    Search,
    UserCheck,
    UserX,
    Briefcase,
} from "lucide-react";

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
    created_at: string;
    updated_at: string;
}

interface StaffManagementProps {
    roleFilter?: string; // Filter by specific role
    departmentFilter?: string; // Filter by department
    showActions?: boolean;
}

const StaffManagement: React.FC<StaffManagementProps> = ({
    roleFilter,
    departmentFilter,
    showActions = true,
}) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleFilterLocal, setRoleFilterLocal] = useState<string>(
        roleFilter || "all"
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchStaff();
    }, [
        currentPage,
        searchTerm,
        statusFilter,
        roleFilterLocal,
        departmentFilter,
    ]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: currentPage.toString(),
                per_page: itemsPerPage.toString(),
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                role: roleFilterLocal !== "all" ? roleFilterLocal : "",
                department: departmentFilter || "",
            });

            const response = await api.get(`/staff?${params}`);
            setStaff(response.data.data || []);
            setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch staff");
            console.error("Error fetching staff:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (staffId: number) => {
        if (!confirm("Are you sure you want to delete this staff member?")) {
            return;
        }

        try {
            await api.delete(`/staff/${staffId}`);
            fetchStaff();
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to delete staff member"
            );
        }
    };

    const handleStatusChange = async (staffId: number, newStatus: string) => {
        try {
            await api.patch(`/staff/${staffId}/status`, { status: newStatus });
            fetchStaff();
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to update staff status"
            );
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingStaff(null);
        fetchStaff();
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            suspended: "bg-red-100 text-red-800",
        };
        return (
            colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        );
    };

    const getRoleColor = (roleName: string) => {
        const colors = {
            admin: "bg-purple-100 text-purple-800",
            doctor: "bg-blue-100 text-blue-800",
            nurse: "bg-pink-100 text-pink-800",
            pharmacist: "bg-yellow-100 text-yellow-800",
            receptionist: "bg-indigo-100 text-indigo-800",
        };
        return (
            colors[roleName as keyof typeof colors] ||
            "bg-gray-100 text-gray-800"
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading && staff.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Staff Management
                    </CardTitle>
                    {showActions && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Staff
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    {!roleFilter && (
                        <select
                            value={roleFilterLocal}
                            onChange={(e) => setRoleFilterLocal(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="doctor">Doctor</option>
                            <option value="nurse">Nurse</option>
                            <option value="pharmacist">Pharmacist</option>
                            <option value="admin">Admin</option>
                            <option value="receptionist">Receptionist</option>
                        </select>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Staff Registration Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {editingStaff
                                            ? "Edit Staff"
                                            : "Add New Staff"}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingStaff(null);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <StaffRegistrationForm
                                    staff={editingStaff}
                                    onSuccess={handleFormSuccess}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingStaff(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Staff Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Staff Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role & Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Work Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                {showActions && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staff.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {member.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {member.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center gap-1">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {member.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            {member.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                                member.role.name
                                            )}`}
                                        >
                                            {member.role.display_name}
                                        </span>
                                        {member.specialization && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {member.specialization}
                                            </div>
                                        )}
                                        {member.department && (
                                            <div className="text-xs text-gray-500">
                                                {member.department}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(member.hire_date)}
                                        </div>
                                        {member.shift && (
                                            <div className="text-xs capitalize">
                                                Shift: {member.shift}
                                            </div>
                                        )}
                                        {member.license_number && (
                                            <div className="text-xs">
                                                License: {member.license_number}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                member.status
                                            )}`}
                                        >
                                            {member.status}
                                        </span>
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingStaff(member);
                                                        setShowForm(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit Staff"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                {member.status === "active" ? (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                member.id,
                                                                "inactive"
                                                            )
                                                        }
                                                        className="text-orange-600 hover:text-orange-900"
                                                        title="Deactivate"
                                                    >
                                                        <UserX className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                member.id,
                                                                "active"
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Activate"
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(member.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Staff"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {staff.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No staff members found.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() =>
                                    setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(totalPages, currentPage + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StaffManagement;
