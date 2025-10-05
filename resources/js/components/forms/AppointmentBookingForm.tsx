import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    phone: string;
}

interface Patient {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface AppointmentFormData {
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    chief_complaint: string;
    notes: string;
    priority: "normal" | "urgent" | "emergency";
}

interface AppointmentBookingFormProps {
    onSuccess?: (appointment: any) => void;
    onCancel?: () => void;
    preselectedPatient?: Patient;
}

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
    onSuccess,
    onCancel,
    preselectedPatient,
}) => {
    const [formData, setFormData] = useState<AppointmentFormData>({
        patient_id: preselectedPatient?.id.toString() || "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        chief_complaint: "",
        notes: "",
        priority: "normal",
    });

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [patientSearch, setPatientSearch] = useState("");

    // Load doctors and patients
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                const [doctorsRes, patientsRes] = await Promise.all([
                    api.get("/doctors/available"),
                    api.get("/patients"),
                ]);

                if (doctorsRes.data.success) {
                    setDoctors(doctorsRes.data.data);
                }

                if (patientsRes.data.success) {
                    setPatients(patientsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

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

        if (!formData.patient_id) {
            newErrors.patient_id = ["Patient is required"];
        }

        if (!formData.doctor_id) {
            newErrors.doctor_id = ["Doctor is required"];
        }

        if (!formData.appointment_date) {
            newErrors.appointment_date = ["Appointment date is required"];
        } else {
            const selectedDate = new Date(formData.appointment_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.appointment_date = [
                    "Appointment date cannot be in the past",
                ];
            }
        }

        if (!formData.appointment_time) {
            newErrors.appointment_time = ["Appointment time is required"];
        }

        if (!formData.chief_complaint.trim()) {
            newErrors.chief_complaint = ["Chief complaint is required"];
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
            const response = await api.post("/appointments", {
                ...formData,
                patient_id: parseInt(formData.patient_id),
                doctor_id: parseInt(formData.doctor_id),
            });

            if (response.data.success) {
                // Reset form
                setFormData({
                    patient_id: preselectedPatient?.id.toString() || "",
                    doctor_id: "",
                    appointment_date: "",
                    appointment_time: "",
                    chief_complaint: "",
                    notes: "",
                    priority: "normal",
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
                        error.response?.data?.message || "Booking failed",
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

    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
            patient.phone.includes(patientSearch) ||
            patient.email.toLowerCase().includes(patientSearch.toLowerCase())
    );

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    if (loadingData) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading appointment data...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Book Appointment
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

                    {/* Patient Selection */}
                    <div>
                        <label
                            htmlFor="patient_id"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Patient *
                        </label>
                        {!preselectedPatient ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Search patient by name, phone, or email..."
                                    value={patientSearch}
                                    onChange={(e) =>
                                        setPatientSearch(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    id="patient_id"
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        getFieldError("patient_id")
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select Patient</option>
                                    {filteredPatients.map((patient) => (
                                        <option
                                            key={patient.id}
                                            value={patient.id}
                                        >
                                            {patient.name} - {patient.phone}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                <p className="font-medium">
                                    {preselectedPatient.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {preselectedPatient.phone}
                                </p>
                            </div>
                        )}
                        {getFieldError("patient_id") && (
                            <p className="mt-1 text-sm text-red-600">
                                {getFieldError("patient_id")}
                            </p>
                        )}
                    </div>

                    {/* Doctor Selection */}
                    <div>
                        <label
                            htmlFor="doctor_id"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Doctor *
                        </label>
                        <select
                            id="doctor_id"
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                getFieldError("doctor_id")
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                        {getFieldError("doctor_id") && (
                            <p className="mt-1 text-sm text-red-600">
                                {getFieldError("doctor_id")}
                            </p>
                        )}
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="appointment_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Appointment Date *
                            </label>
                            <input
                                type="date"
                                id="appointment_date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split("T")[0]}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("appointment_date")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {getFieldError("appointment_date") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("appointment_date")}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="appointment_time"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Appointment Time *
                            </label>
                            <select
                                id="appointment_time"
                                name="appointment_time"
                                value={formData.appointment_time}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    getFieldError("appointment_time")
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select Time</option>
                                {generateTimeSlots().map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            {getFieldError("appointment_time") && (
                                <p className="mt-1 text-sm text-red-600">
                                    {getFieldError("appointment_time")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    {/* Chief Complaint */}
                    <div>
                        <label
                            htmlFor="chief_complaint"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Chief Complaint *
                        </label>
                        <textarea
                            id="chief_complaint"
                            name="chief_complaint"
                            value={formData.chief_complaint}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                getFieldError("chief_complaint")
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                            placeholder="Describe the main reason for this appointment"
                        />
                        {getFieldError("chief_complaint") && (
                            <p className="mt-1 text-sm text-red-600">
                                {getFieldError("chief_complaint")}
                            </p>
                        )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label
                            htmlFor="notes"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Additional Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Any additional information or special requests"
                        />
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
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AppointmentBookingForm;
