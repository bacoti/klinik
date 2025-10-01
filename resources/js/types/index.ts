// User types
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    gender?: "male" | "female";
    birth_date?: string;
    employee_id?: string;
    is_active: boolean;
    role: Role;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;
}

// Patient types
export interface Patient {
    id: number;
    patient_number: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    gender: "male" | "female";
    birth_date: string;
    birth_place?: string;
    occupation?: string;
    marital_status?: "single" | "married" | "divorced" | "widowed";
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    blood_type?: string;
    allergies?: string;
    medical_history?: string;
    status: "active" | "inactive";
    is_verified: boolean;
    verified_at?: string;
    registered_by?: User;
    verified_by?: User;
    created_at: string;
    updated_at: string;
}

// Appointment types
export interface Appointment {
    id: number;
    appointment_number: string;
    patient: Patient;
    appointment_date: string;
    appointment_time?: string;
    type: "regular" | "emergency" | "follow_up";
    chief_complaint?: string;
    status:
        | "registered"
        | "waiting"
        | "screening"
        | "examination"
        | "completed"
        | "cancelled";
    queue_number?: number;
    created_by: User;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// Screening types
export interface Screening {
    id: number;
    appointment: Appointment;
    patient: Patient;
    nurse: User;
    height?: number;
    weight?: number;
    temperature?: number;
    blood_pressure?: string;
    heart_rate?: number;
    respiratory_rate?: number;
    chief_complaint?: string;
    additional_symptoms?: string;
    nurse_notes?: string;
    priority: "low" | "normal" | "high" | "emergency";
    screened_at: string;
    created_at: string;
    updated_at: string;
}

// Examination types
export interface Examination {
    id: number;
    appointment: Appointment;
    patient: Patient;
    doctor: User;
    screening?: Screening;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    diagnosis_primary?: string;
    diagnosis_secondary?: string;
    treatment_notes?: string;
    doctor_notes?: string;
    follow_up_required: boolean;
    follow_up_date?: string;
    follow_up_notes?: string;
    sick_leave_required: boolean;
    sick_leave_days?: number;
    sick_leave_start_date?: string;
    sick_leave_end_date?: string;
    sick_leave_notes?: string;
    examined_at: string;
    created_at: string;
    updated_at: string;
}

// Medicine types
export interface Medicine {
    id: number;
    code: string;
    name: string;
    generic_name?: string;
    description?: string;
    manufacturer?: string;
    form:
        | "tablet"
        | "capsule"
        | "syrup"
        | "injection"
        | "ointment"
        | "drops"
        | "inhaler"
        | "patch"
        | "other";
    strength?: string;
    unit: string;
    stock_quantity: number;
    minimum_stock: number;
    unit_price: number;
    expiry_date?: string;
    batch_number?: string;
    is_active: boolean;
    usage_instructions?: string;
    side_effects?: string;
    contraindications?: string;
    created_at: string;
    updated_at: string;
}

// Prescription types
export interface Prescription {
    id: number;
    prescription_number: string;
    examination: Examination;
    patient: Patient;
    doctor: User;
    prescribed_date: string;
    notes?: string;
    status: "pending" | "dispensed" | "partially_dispensed" | "cancelled";
    dispensed_by?: User;
    dispensed_at?: string;
    total_amount: number;
    medicines: PrescriptionMedicine[];
    created_at: string;
    updated_at: string;
}

export interface PrescriptionMedicine {
    id: number;
    medicine: Medicine;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    unit_price: number;
    total_price: number;
    dispensed_quantity: number;
    status: "pending" | "dispensed" | "partially_dispensed";
}

// Medical Record types
export interface MedicalRecord {
    id: number;
    record_number: string;
    patient: Patient;
    appointment?: Appointment;
    screening?: Screening;
    examination?: Examination;
    prescription?: Prescription;
    type:
        | "registration"
        | "screening"
        | "examination"
        | "prescription"
        | "pharmacy"
        | "follow_up";
    summary?: string;
    vital_signs?: any;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    attachments?: string[];
    created_by: User;
    record_date: string;
    created_at: string;
    updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    address?: string;
    gender?: "male" | "female";
    birth_date?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
