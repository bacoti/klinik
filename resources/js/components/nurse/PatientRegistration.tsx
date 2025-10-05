import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
    User,
    UserPlus,
    Heart,
    Thermometer,
    Activity,
    Scale,
    Ruler,
    Clock,
    AlertCircle,
    CheckCircle,
    Search,
    Plus,
} from "lucide-react";

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    birth_date: string;
    gender: "male" | "female";
    address: string;
    blood_type: string;
    insurance_provider: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    is_active: boolean;
    created_at: string;
}

interface VitalSigns {
    temperature: string;
    blood_pressure_systolic: string;
    blood_pressure_diastolic: string;
    heart_rate: string;
    respiratory_rate: string;
    oxygen_saturation: string;
    weight: string;
    height: string;
    bmi?: string;
}

interface RegistrationData {
    // Patient basic info
    name: string;
    email: string;
    phone: string;
    birth_date: string;
    gender: "male" | "female";
    address: string;
    blood_type: string;
    insurance_provider: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    
    // Nurse specific data
    chief_complaint: string;
    vital_signs: VitalSigns;
    allergies: string;
    current_medications: string;
    medical_history: string;
    triage_level: "non_urgent" | "less_urgent" | "urgent" | "very_urgent" | "resuscitation";
    nurse_notes: string;
}

const NursePatientRegistration: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationData>({
        name: "",
        email: "",
        phone: "",
        birth_date: "",
        gender: "male",
        address: "",
        blood_type: "",
        insurance_provider: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        chief_complaint: "",
        vital_signs: {
            temperature: "",
            blood_pressure_systolic: "",
            blood_pressure_diastolic: "",
            heart_rate: "",
            respiratory_rate: "",
            oxygen_saturation: "",
            weight: "",
            height: "",
        },
        allergies: "",
        current_medications: "",
        medical_history: "",
        triage_level: "non_urgent",
        nurse_notes: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (searchTerm) {
            searchPatients();
        } else {
            setPatients([]);
        }
    }, [searchTerm]);

    // Calculate BMI when weight and height change
    useEffect(() => {
        const { weight, height } = formData.vital_signs;
        if (weight && height) {
            const weightKg = parseFloat(weight);
            const heightM = parseFloat(height) / 100;
            if (weightKg > 0 && heightM > 0) {
                const bmi = (weightKg / (heightM * heightM)).toFixed(1);
                setFormData(prev => ({
                    ...prev,
                    vital_signs: {
                        ...prev.vital_signs,
                        bmi
                    }
                }));
            }
        }
    }, [formData.vital_signs.weight, formData.vital_signs.height]);

    const searchPatients = async () => {
        if (searchTerm.length < 2) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/patients/search?q=${searchTerm}`);
            setPatients(response.data.data || []);
        } catch (err) {
            console.error("Error searching patients:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        
        if (name.startsWith('vital_')) {
            const vitalField = name.replace('vital_', '');
            setFormData(prev => ({
                ...prev,
                vital_signs: {
                    ...prev.vital_signs,
                    [vitalField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear specific field error
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: []
            }));
        }
    };

    const selectExistingPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setFormData(prev => ({
            ...prev,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            birth_date: patient.birth_date.split('T')[0],
            gender: patient.gender,
            address: patient.address,
            blood_type: patient.blood_type,
            insurance_provider: patient.insurance_provider,
            emergency_contact_name: patient.emergency_contact_name,
            emergency_contact_phone: patient.emergency_contact_phone,
        }));
        setCurrentStep(2); // Skip to vital signs
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const submitData = {
                ...formData,
                patient_id: selectedPatient?.id || null,
                vital_signs: {
                    ...formData.vital_signs,
                    bmi: formData.vital_signs.bmi || null
                }
            };

            await api.post("/nurse/patient-registration", submitData);
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                birth_date: "",
                gender: "male",
                address: "",
                blood_type: "",
                insurance_provider: "",
                emergency_contact_name: "",
                emergency_contact_phone: "",
                chief_complaint: "",
                vital_signs: {
                    temperature: "",
                    blood_pressure_systolic: "",
                    blood_pressure_diastolic: "",
                    heart_rate: "",
                    respiratory_rate: "",
                    oxygen_saturation: "",
                    weight: "",
                    height: "",
                },
                allergies: "",
                current_medications: "",
                medical_history: "",
                triage_level: "non_urgent",
                nurse_notes: "",
            });
            setSelectedPatient(null);
            setCurrentStep(1);
            setShowRegistrationForm(false);
            setSearchTerm("");
            
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const getTriageColor = (level: string) => {
        const colors = {
            non_urgent: "bg-blue-100 text-blue-800",
            less_urgent: "bg-green-100 text-green-800", 
            urgent: "bg-yellow-100 text-yellow-800",
            very_urgent: "bg-orange-100 text-orange-800",
            resuscitation: "bg-red-100 text-red-800",
        };
        return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <UserPlus className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Registration</h2>
                <p className="text-gray-600">Search for existing patient or register new patient</p>
            </div>

            {/* Search Existing Patient */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Existing Patient
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {loading && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        )}

                        {patients.length > 0 && (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {patients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        onClick={() => selectExistingPatient(patient)}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{patient.name}</p>
                                                <p className="text-sm text-gray-600">{patient.phone}</p>
                                                <p className="text-sm text-gray-600">{patient.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(patient.birth_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Register New Patient */}
            <div className="text-center">
                <p className="text-gray-600 mb-4">Or register a new patient</p>
                <button
                    onClick={() => {
                        setSelectedPatient(null);
                        setCurrentStep(2);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                    <Plus className="h-4 w-4" />
                    Register New Patient
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Basic Info (if new patient) */}
            {!selectedPatient && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Patient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blood Type
                                </label>
                                <select
                                    name="blood_type"
                                    value={formData.blood_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Emergency Contact Name *
                                </label>
                                <input
                                    type="text"
                                    name="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Emergency Contact Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="emergency_contact_phone"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chief Complaint */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Chief Complaint & Triage
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chief Complaint *
                            </label>
                            <textarea
                                name="chief_complaint"
                                value={formData.chief_complaint}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Describe the main reason for the visit..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Triage Level *
                            </label>
                            <select
                                name="triage_level"
                                value={formData.triage_level}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="non_urgent">Level 5 - Non Urgent (Green)</option>
                                <option value="less_urgent">Level 4 - Less Urgent (Yellow)</option>
                                <option value="urgent">Level 3 - Urgent (Orange)</option>
                                <option value="very_urgent">Level 2 - Very Urgent (Red)</option>
                                <option value="resuscitation">Level 1 - Resuscitation (Blue)</option>
                            </select>
                            <div className="mt-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTriageColor(formData.triage_level)}`}>
                                    {formData.triage_level.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Vital Signs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Thermometer className="inline h-4 w-4 mr-1" />
                                Temperature (°C)
                            </label>
                            <input
                                type="number"
                                name="vital_temperature"
                                value={formData.vital_signs.temperature}
                                onChange={handleInputChange}
                                step="0.1"
                                placeholder="36.5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Activity className="inline h-4 w-4 mr-1" />
                                Blood Pressure (Systolic)
                            </label>
                            <input
                                type="number"
                                name="vital_blood_pressure_systolic"
                                value={formData.vital_signs.blood_pressure_systolic}
                                onChange={handleInputChange}
                                placeholder="120"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Blood Pressure (Diastolic)
                            </label>
                            <input
                                type="number"
                                name="vital_blood_pressure_diastolic"
                                value={formData.vital_signs.blood_pressure_diastolic}
                                onChange={handleInputChange}
                                placeholder="80"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Heart className="inline h-4 w-4 mr-1" />
                                Heart Rate (bpm)
                            </label>
                            <input
                                type="number"
                                name="vital_heart_rate"
                                value={formData.vital_signs.heart_rate}
                                onChange={handleInputChange}
                                placeholder="72"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Respiratory Rate (breaths/min)
                            </label>
                            <input
                                type="number"
                                name="vital_respiratory_rate"
                                value={formData.vital_signs.respiratory_rate}
                                onChange={handleInputChange}
                                placeholder="16"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Oxygen Saturation (%)
                            </label>
                            <input
                                type="number"
                                name="vital_oxygen_saturation"
                                value={formData.vital_signs.oxygen_saturation}
                                onChange={handleInputChange}
                                placeholder="98"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Scale className="inline h-4 w-4 mr-1" />
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="vital_weight"
                                value={formData.vital_signs.weight}
                                onChange={handleInputChange}
                                step="0.1"
                                placeholder="70"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Ruler className="inline h-4 w-4 mr-1" />
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                name="vital_height"
                                value={formData.vital_signs.height}
                                onChange={handleInputChange}
                                placeholder="170"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {formData.vital_signs.bmi && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    BMI
                                </label>
                                <input
                                    type="text"
                                    value={formData.vital_signs.bmi}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Known Allergies
                            </label>
                            <textarea
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="List any known allergies..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Medications
                            </label>
                            <textarea
                                name="current_medications"
                                value={formData.current_medications}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="List current medications..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medical History
                            </label>
                            <textarea
                                name="medical_history"
                                value={formData.medical_history}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Relevant medical history..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nurse Notes
                            </label>
                            <textarea
                                name="nurse_notes"
                                value={formData.nurse_notes}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Additional notes from nurse assessment..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-between space-x-4">
                <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            Complete Registration
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    if (showRegistrationForm || currentStep > 1) {
        return (
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            {selectedPatient ? `Registration for ${selectedPatient.name}` : "New Patient Registration"}
                        </CardTitle>
                        <button
                            onClick={() => {
                                setShowRegistrationForm(false);
                                setCurrentStep(1);
                                setSelectedPatient(null);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center space-x-4 mt-4">
                        <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 1 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}>
                                1
                            </div>
                            <span className="ml-2 text-sm font-medium">Patient Search</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep >= 2 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}>
                                2
                            </div>
                            <span className="ml-2 text-sm font-medium">Registration & Vitals</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Patient Registration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <UserPlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Patient Registration</h3>
                    <p className="text-gray-600 mb-6">Register new patients or update existing patient information</p>
                    <button
                        onClick={() => setShowRegistrationForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Start Registration
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};

export default NursePatientRegistration;