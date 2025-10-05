import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNurseSidebarItems } from "@/config/nurseSidebar";

interface Patient {
    id: number;
    name: string;
    registration_number: string;
    phone: string;
    age: number;
    gender: 'male' | 'female';
    registered_at: string;
    appointment_time: string;
    doctor_name: string;
    chief_complaint: string;
    screening_status: 'pending' | 'in_progress' | 'completed';
}

interface ScreeningData {
    patient_id: number;
    chief_complaint: string;
    pain_scale: number;
    symptoms: string[];
    vital_signs: {
        blood_pressure_systolic: string;
        blood_pressure_diastolic: string;
        temperature: string;
        pulse: string;
        respiratory_rate: string;
        oxygen_saturation: string;
        weight: string;
        height: string;
    };
    medical_history: string;
    current_medications: string;
    allergies: string;
    triage_level: 'green' | 'yellow' | 'red';
    notes: string;
}

const PatientScreening: React.FC = () => {
    const sidebarItems = getNurseSidebarItems("/nurse/screening");
    
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showScreeningForm, setShowScreeningForm] = useState(false);
    const [screeningData, setScreeningData] = useState<ScreeningData>({
        patient_id: 0,
        chief_complaint: "",
        pain_scale: 0,
        symptoms: [],
        vital_signs: {
            blood_pressure_systolic: "",
            blood_pressure_diastolic: "",
            temperature: "",
            pulse: "",
            respiratory_rate: "",
            oxygen_saturation: "",
            weight: "",
            height: ""
        },
        medical_history: "",
        current_medications: "",
        allergies: "",
        triage_level: "green",
        notes: ""
    });

    // Mock data - replace with API call
    useEffect(() => {
        const mockPatients: Patient[] = [
            {
                id: 1,
                name: "Alice Brown",
                registration_number: "REG001",
                phone: "081234567890",
                age: 28,
                gender: "female",
                registered_at: "09:30 AM",
                appointment_time: "10:00 AM",
                doctor_name: "Dr. Budi Santoso",
                chief_complaint: "Demam dan batuk sejak 3 hari",
                screening_status: "pending"
            },
            {
                id: 2,
                name: "Charlie Wilson",
                registration_number: "REG002",
                phone: "081234567891",
                age: 45,
                gender: "male",
                registered_at: "09:45 AM",
                appointment_time: "10:15 AM",
                doctor_name: "Dr. Sari Wijaya",
                chief_complaint: "Nyeri dada dan sesak napas",
                screening_status: "pending"
            },
            {
                id: 3,
                name: "Diana Lee",
                registration_number: "REG003",
                phone: "081234567892",
                age: 35,
                gender: "female",
                registered_at: "10:00 AM",
                appointment_time: "10:30 AM",
                doctor_name: "Dr. Budi Santoso",
                chief_complaint: "Sakit kepala berkepanjangan",
                screening_status: "in_progress"
            },
            {
                id: 4,
                name: "Edward Martinez",
                registration_number: "REG004",
                phone: "081234567893",
                age: 52,
                gender: "male",
                registered_at: "10:15 AM",
                appointment_time: "10:45 AM",
                doctor_name: "Dr. Sari Wijaya",
                chief_complaint: "Kontrol diabetes rutin",
                screening_status: "completed"
            }
        ];
        setPatients(mockPatients);
    }, []);

    const commonSymptoms = [
        "Demam", "Batuk", "Pilek", "Sakit kepala", "Mual", "Muntah",
        "Diare", "Nyeri perut", "Nyeri dada", "Sesak napas",
        "Pusing", "Lemas", "Nyeri sendi", "Ruam kulit"
    ];

    const handleStartScreening = (patient: Patient) => {
        setSelectedPatient(patient);
        setScreeningData(prev => ({
            ...prev,
            patient_id: patient.id,
            chief_complaint: patient.chief_complaint
        }));
        setShowScreeningForm(true);
        
        // Update patient status
        setPatients(prev => 
            prev.map(p => 
                p.id === patient.id 
                    ? { ...p, screening_status: 'in_progress' }
                    : p
            )
        );
    };

    const handleSymptomToggle = (symptom: string) => {
        setScreeningData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleVitalSignChange = (field: string, value: string) => {
        setScreeningData(prev => ({
            ...prev,
            vital_signs: {
                ...prev.vital_signs,
                [field]: value
            }
        }));
    };

    const calculateTriageLevel = (): 'green' | 'yellow' | 'red' => {
        const { vital_signs, pain_scale, symptoms } = screeningData;
        
        // Red (Emergency) conditions
        if (
            pain_scale >= 8 ||
            symptoms.includes("Nyeri dada") ||
            symptoms.includes("Sesak napas") ||
            parseFloat(vital_signs.temperature) >= 39 ||
            parseInt(vital_signs.pulse) > 120 ||
            parseInt(vital_signs.oxygen_saturation) < 95
        ) {
            return "red";
        }
        
        // Yellow (Urgent) conditions
        if (
            pain_scale >= 5 ||
            symptoms.includes("Demam") ||
            symptoms.includes("Muntah") ||
            parseFloat(vital_signs.temperature) >= 38 ||
            parseInt(vital_signs.pulse) > 100
        ) {
            return "yellow";
        }
        
        // Green (Non-urgent)
        return "green";
    };

    useEffect(() => {
        const triageLevel = calculateTriageLevel();
        setScreeningData(prev => ({
            ...prev,
            triage_level: triageLevel
        }));
    }, [screeningData.pain_scale, screeningData.symptoms, screeningData.vital_signs]);

    const handleSubmitScreening = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Here you would send data to API
            console.log("Screening data:", screeningData);
            
            // Update patient status
            setPatients(prev => 
                prev.map(p => 
                    p.id === selectedPatient?.id 
                        ? { ...p, screening_status: 'completed' }
                        : p
                )
            );
            
            // Reset form
            setShowScreeningForm(false);
            setSelectedPatient(null);
            setScreeningData({
                patient_id: 0,
                chief_complaint: "",
                pain_scale: 0,
                symptoms: [],
                vital_signs: {
                    blood_pressure_systolic: "",
                    blood_pressure_diastolic: "",
                    temperature: "",
                    pulse: "",
                    respiratory_rate: "",
                    oxygen_saturation: "",
                    weight: "",
                    height: ""
                },
                medical_history: "",
                current_medications: "",
                allergies: "",
                triage_level: "green",
                notes: ""
            });
            
            alert("Screening completed successfully!");
        } catch (error) {
            console.error("Error submitting screening:", error);
            alert("Error submitting screening data");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTriageColor = (level: string) => {
        switch (level) {
            case "red":
                return "bg-red-500 text-white";
            case "yellow":
                return "bg-yellow-500 text-white";
            case "green":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const pendingCount = patients.filter(p => p.screening_status === 'pending').length;
    const inProgressCount = patients.filter(p => p.screening_status === 'in_progress').length;
    const completedCount = patients.filter(p => p.screening_status === 'completed').length;

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Patient Screening Assessment">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Patient Screening Assessment
                            </h1>
                            <p className="text-gray-600">
                                Conduct initial patient screening and triage assessment
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                                    <p className="text-sm text-gray-600">Total Patients</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                                    <p className="text-sm text-gray-600">Pending Screening</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {!showScreeningForm ? (
                        /* Patient List */
                        <Card>
                            <CardHeader>
                                <CardTitle>Patients Awaiting Screening</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {patients.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No patients found</p>
                                        </div>
                                    ) : (
                                        patients.map((patient) => (
                                            <div
                                                key={patient.id}
                                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-4">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">
                                                                    {patient.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {patient.registration_number} • Age: {patient.age} • {patient.gender}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Registered: {patient.registered_at} | Appointment: {patient.appointment_time}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Doctor: {patient.doctor_name}
                                                                </p>
                                                                <p className="text-sm text-blue-600 mt-1">
                                                                    <strong>Chief Complaint:</strong> {patient.chief_complaint}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.screening_status)}`}>
                                                            {patient.screening_status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        
                                                        {patient.screening_status === 'pending' && (
                                                            <button
                                                                onClick={() => handleStartScreening(patient)}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                            >
                                                                Start Screening
                                                            </button>
                                                        )}
                                                        
                                                        {patient.screening_status === 'in_progress' && (
                                                            <button
                                                                onClick={() => handleStartScreening(patient)}
                                                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                                            >
                                                                Continue Screening
                                                            </button>
                                                        )}
                                                        
                                                        {patient.screening_status === 'completed' && (
                                                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
                                                                ✅ Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Screening Form */
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Screening Assessment - {selectedPatient?.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTriageColor(screeningData.triage_level)}`}>
                                            Triage Level: {screeningData.triage_level.toUpperCase()}
                                        </span>
                                        <button
                                            onClick={() => setShowScreeningForm(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Back to List
                                        </button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitScreening} className="space-y-6">
                                    {/* Patient Info Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Patient Information</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <p><strong>Name:</strong> {selectedPatient?.name}</p>
                                            <p><strong>Age:</strong> {selectedPatient?.age}</p>
                                            <p><strong>Registration:</strong> {selectedPatient?.registration_number}</p>
                                            <p><strong>Phone:</strong> {selectedPatient?.phone}</p>
                                        </div>
                                    </div>

                                    {/* Chief Complaint */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chief Complaint *
                                        </label>
                                        <textarea
                                            value={screeningData.chief_complaint}
                                            onChange={(e) => setScreeningData(prev => ({ ...prev, chief_complaint: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    {/* Pain Scale */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pain Scale (0-10) *
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={screeningData.pain_scale}
                                                onChange={(e) => setScreeningData(prev => ({ ...prev, pain_scale: parseInt(e.target.value) }))}
                                                className="flex-1"
                                            />
                                            <span className="w-12 text-center font-bold text-lg">
                                                {screeningData.pain_scale}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>No Pain</span>
                                            <span>Severe Pain</span>
                                        </div>
                                    </div>

                                    {/* Symptoms */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Symptoms (Select all that apply)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {commonSymptoms.map((symptom) => (
                                                <label key={symptom} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={screeningData.symptoms.includes(symptom)}
                                                        onChange={() => handleSymptomToggle(symptom)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm">{symptom}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Vital Signs */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Blood Pressure */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Blood Pressure *
                                                </label>
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Systolic"
                                                        value={screeningData.vital_signs.blood_pressure_systolic}
                                                        onChange={(e) => handleVitalSignChange('blood_pressure_systolic', e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        required
                                                    />
                                                    <span>/</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Diastolic"
                                                        value={screeningData.vital_signs.blood_pressure_diastolic}
                                                        onChange={(e) => handleVitalSignChange('blood_pressure_diastolic', e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Temperature */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Temperature (°C) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={screeningData.vital_signs.temperature}
                                                    onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    required
                                                />
                                            </div>

                                            {/* Pulse */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Pulse (bpm) *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={screeningData.vital_signs.pulse}
                                                    onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    required
                                                />
                                            </div>

                                            {/* Oxygen Saturation */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    O2 Saturation (%) *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="70"
                                                    max="100"
                                                    value={screeningData.vital_signs.oxygen_saturation}
                                                    onChange={(e) => handleVitalSignChange('oxygen_saturation', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medical History & Notes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medical History
                                            </label>
                                            <textarea
                                                value={screeningData.medical_history}
                                                onChange={(e) => setScreeningData(prev => ({ ...prev, medical_history: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Medications
                                            </label>
                                            <textarea
                                                value={screeningData.current_medications}
                                                onChange={(e) => setScreeningData(prev => ({ ...prev, current_medications: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Known Allergies
                                            </label>
                                            <textarea
                                                value={screeningData.allergies}
                                                onChange={(e) => setScreeningData(prev => ({ ...prev, allergies: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Notes
                                            </label>
                                            <textarea
                                                value={screeningData.notes}
                                                onChange={(e) => setScreeningData(prev => ({ ...prev, notes: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex justify-end space-x-4 pt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setShowScreeningForm(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Complete Screening
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default PatientScreening;