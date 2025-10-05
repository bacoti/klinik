import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Layout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNurseSidebarItems } from "@/config/nurseSidebar";

interface Patient {
    id: number;
    name: string;
    registration_number: string;
    room_number: string;
    age: number;
    gender: 'male' | 'female';
    admission_date: string;
    condition: 'stable' | 'improving' | 'deteriorating' | 'critical';
    primary_diagnosis: string;
    attending_doctor: string;
}

interface NursingNote {
    id: number;
    patient_id: number;
    patient_name: string;
    note_type: 'general' | 'medication' | 'vital_signs' | 'procedure' | 'observation' | 'discharge';
    shift: 'morning' | 'afternoon' | 'night';
    datetime: string;
    title: string;
    content: string;
    nurse_name: string;
    nurse_id: number;
    priority: 'low' | 'medium' | 'high';
    follow_up_required: boolean;
    attachments?: string[];
}

const NursingNotes: React.FC = () => {
    const sidebarItems = getNurseSidebarItems("/nurse/notes");
    
    const [patients, setPatients] = useState<Patient[]>([]);
    const [nursingNotes, setNursingNotes] = useState<NursingNote[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNote, setEditingNote] = useState<NursingNote | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterShift, setFilterShift] = useState<string>("all");
    const [newNote, setNewNote] = useState({
        note_type: "general" as const,
        shift: "morning" as const,
        title: "",
        content: "",
        priority: "medium" as const,
        follow_up_required: false
    });

    // Mock data - replace with API calls
    useEffect(() => {
        const mockPatients: Patient[] = [
            {
                id: 1,
                name: "John Doe",
                registration_number: "REG001",
                room_number: "101",
                age: 45,
                gender: "male",
                admission_date: "2025-10-03",
                condition: "stable",
                primary_diagnosis: "Hypertension",
                attending_doctor: "Dr. Budi Santoso"
            },
            {
                id: 2,
                name: "Jane Smith",
                registration_number: "REG002",
                room_number: "102",
                age: 32,
                gender: "female",
                admission_date: "2025-10-04",
                condition: "improving",
                primary_diagnosis: "Pneumonia",
                attending_doctor: "Dr. Sari Wijaya"
            },
            {
                id: 3,
                name: "Bob Johnson",
                registration_number: "REG003",
                room_number: "103",
                age: 68,
                gender: "male",
                admission_date: "2025-10-02",
                condition: "critical",
                primary_diagnosis: "Post-operative care",
                attending_doctor: "Dr. Budi Santoso"
            }
        ];

        const mockNotes: NursingNote[] = [
            {
                id: 1,
                patient_id: 1,
                patient_name: "John Doe",
                note_type: "vital_signs",
                shift: "morning",
                datetime: "2025-10-05 08:30",
                title: "Morning Vital Signs Check",
                content: "BP: 140/90, Temp: 36.5°C, Pulse: 78 bpm, RR: 16/min. Patient reports feeling well. Blood pressure slightly elevated, medication timing adjusted.",
                nurse_name: "Nurse Sarah",
                nurse_id: 1,
                priority: "medium",
                follow_up_required: true
            },
            {
                id: 2,
                patient_id: 2,
                patient_name: "Jane Smith",
                note_type: "medication",
                shift: "afternoon",
                datetime: "2025-10-05 14:15",
                title: "Antibiotic Administration",
                content: "Administered Amoxicillin 500mg PO as prescribed. Patient tolerated medication well. No adverse reactions observed. Next dose scheduled for 22:00.",
                nurse_name: "Nurse Mary",
                nurse_id: 2,
                priority: "low",
                follow_up_required: false
            },
            {
                id: 3,
                patient_id: 3,
                patient_name: "Bob Johnson",
                note_type: "observation",
                shift: "night",
                datetime: "2025-10-05 02:45",
                title: "Pain Assessment",
                content: "Patient reports pain level 6/10 at surgical site. Pain medication (Morphine 5mg IV) administered as per order. Patient more comfortable after 30 minutes. Wound dressing dry and intact.",
                nurse_name: "Nurse Linda",
                nurse_id: 3,
                priority: "high",
                follow_up_required: true
            },
            {
                id: 4,
                patient_id: 1,
                patient_name: "John Doe",
                note_type: "general",
                shift: "afternoon",
                datetime: "2025-10-05 16:20",
                title: "Patient Education",
                content: "Provided education on dietary modifications for hypertension management. Patient demonstrates understanding of low-sodium diet requirements. Wife present during education session.",
                nurse_name: "Nurse Sarah",
                nurse_id: 1,
                priority: "low",
                follow_up_required: false
            }
        ];

        setPatients(mockPatients);
        setNursingNotes(mockNotes);
    }, []);

    const noteTypes = [
        { value: "general", label: "General Note" },
        { value: "medication", label: "Medication" },
        { value: "vital_signs", label: "Vital Signs" },
        { value: "procedure", label: "Procedure" },
        { value: "observation", label: "Observation" },
        { value: "discharge", label: "Discharge" }
    ];

    const shifts = [
        { value: "morning", label: "Morning (07:00-15:00)" },
        { value: "afternoon", label: "Afternoon (15:00-23:00)" },
        { value: "night", label: "Night (23:00-07:00)" }
    ];

    const getCurrentShift = (): 'morning' | 'afternoon' | 'night' => {
        const hour = new Date().getHours();
        if (hour >= 7 && hour < 15) return 'morning';
        if (hour >= 15 && hour < 23) return 'afternoon';
        return 'night';
    };

    const filteredNotes = nursingNotes.filter(note => {
        const matchesSearch = 
            note.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.nurse_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === "all" || note.note_type === filterType;
        const matchesShift = filterShift === "all" || note.shift === filterShift;
        const matchesPatient = !selectedPatient || note.patient_id === selectedPatient.id;

        return matchesSearch && matchesType && matchesShift && matchesPatient;
    });

    const handleCreateNote = () => {
        setEditingNote(null);
        setNewNote({
            note_type: "general",
            shift: getCurrentShift(),
            title: "",
            content: "",
            priority: "medium",
            follow_up_required: false
        });
        setShowNoteForm(true);
    };

    const handleEditNote = (note: NursingNote) => {
        setEditingNote(note);
        setNewNote({
            note_type: note.note_type,
            shift: note.shift,
            title: note.title,
            content: note.content,
            priority: note.priority,
            follow_up_required: note.follow_up_required
        });
        setShowNoteForm(true);
    };

    const handleSubmitNote = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPatient) {
            alert("Please select a patient first");
            return;
        }

        try {
            const noteData = {
                ...newNote,
                patient_id: selectedPatient.id,
                patient_name: selectedPatient.name,
                datetime: new Date().toISOString().slice(0, 16).replace('T', ' '),
                nurse_name: "Current Nurse", // Would come from auth context
                nurse_id: 1 // Would come from auth context
            };

            if (editingNote) {
                // Update existing note
                setNursingNotes(prev => 
                    prev.map(note => 
                        note.id === editingNote.id 
                            ? { ...note, ...noteData }
                            : note
                    )
                );
            } else {
                // Create new note
                const newNoteWithId: NursingNote = {
                    ...noteData,
                    id: Date.now() // In real app, this would come from API
                };
                setNursingNotes(prev => [newNoteWithId, ...prev]);
            }

            // Reset form
            setShowNoteForm(false);
            setEditingNote(null);
            setNewNote({
                note_type: "general",
                shift: getCurrentShift(),
                title: "",
                content: "",
                priority: "medium",
                follow_up_required: false
            });

            alert(editingNote ? "Note updated successfully!" : "Note created successfully!");
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Error saving note");
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "stable":
                return "bg-green-100 text-green-800";
            case "improving":
                return "bg-blue-100 text-blue-800";
            case "deteriorating":
                return "bg-yellow-100 text-yellow-800";
            case "critical":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-500 text-white";
            case "medium":
                return "bg-yellow-500 text-white";
            case "low":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getNoteTypeColor = (type: string) => {
        switch (type) {
            case "medication":
                return "bg-purple-100 text-purple-800";
            case "vital_signs":
                return "bg-blue-100 text-blue-800";
            case "procedure":
                return "bg-orange-100 text-orange-800";
            case "observation":
                return "bg-teal-100 text-teal-800";
            case "discharge":
                return "bg-pink-100 text-pink-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const todayNotes = nursingNotes.filter(note => 
        note.datetime.startsWith(new Date().toISOString().slice(0, 10))
    ).length;

    const followUpNotes = nursingNotes.filter(note => note.follow_up_required).length;
    const highPriorityNotes = nursingNotes.filter(note => note.priority === 'high').length;

    return (
        <Layout>
            <DashboardLayout sidebarItems={sidebarItems} title="Nursing Notes Documentation">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Nursing Notes Documentation
                            </h1>
                            <p className="text-gray-600">
                                Document and manage patient care notes
                            </p>
                        </div>
                        <button
                            onClick={handleCreateNote}
                            disabled={!selectedPatient}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            📝 New Note
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{nursingNotes.length}</p>
                                    <p className="text-sm text-gray-600">Total Notes</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{todayNotes}</p>
                                    <p className="text-sm text-gray-600">Today's Notes</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">{followUpNotes}</p>
                                    <p className="text-sm text-gray-600">Follow-up Required</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">{highPriorityNotes}</p>
                                    <p className="text-sm text-gray-600">High Priority</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Patient</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {patients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            onClick={() => setSelectedPatient(patient)}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedPatient?.id === patient.id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {patient.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Room {patient.room_number} • {patient.registration_number}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {patient.age}y {patient.gender} • {patient.primary_diagnosis}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Dr. {patient.attending_doctor}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(patient.condition)}`}>
                                                    {patient.condition}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes List */}
                        <div className="lg:col-span-2">
                            {!showNoteForm ? (
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>
                                                Nursing Notes 
                                                {selectedPatient && (
                                                    <span className="text-blue-600"> - {selectedPatient.name}</span>
                                                )}
                                            </CardTitle>
                                            <div className="flex space-x-2">
                                                <select
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="all">All Types</option>
                                                    {noteTypes.map(type => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={filterShift}
                                                    onChange={(e) => setFilterShift(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="all">All Shifts</option>
                                                    {shifts.map(shift => (
                                                        <option key={shift.value} value={shift.value}>
                                                            {shift.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                placeholder="Search notes..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {filteredNotes.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">
                                                        {selectedPatient 
                                                            ? "No notes found for this patient" 
                                                            : "Select a patient to view notes"
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                filteredNotes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <h3 className="font-semibold text-gray-900">
                                                                        {note.title}
                                                                    </h3>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.note_type)}`}>
                                                                        {noteTypes.find(t => t.value === note.note_type)?.label}
                                                                    </span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                                                                        {note.priority}
                                                                    </span>
                                                                    {note.follow_up_required && (
                                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                            Follow-up
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {note.patient_name} • {note.datetime} • {note.shift} shift • {note.nurse_name}
                                                                </p>
                                                                <p className="text-sm text-gray-700">
                                                                    {note.content}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleEditNote(note)}
                                                                className="ml-4 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                /* Note Form */
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>
                                                {editingNote ? "Edit Note" : "New Nursing Note"}
                                                {selectedPatient && (
                                                    <span className="text-blue-600"> - {selectedPatient.name}</span>
                                                )}
                                            </CardTitle>
                                            <button
                                                onClick={() => setShowNoteForm(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitNote} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Note Type *
                                                    </label>
                                                    <select
                                                        value={newNote.note_type}
                                                        onChange={(e) => setNewNote(prev => ({ ...prev, note_type: e.target.value as any }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        {noteTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Shift *
                                                    </label>
                                                    <select
                                                        value={newNote.shift}
                                                        onChange={(e) => setNewNote(prev => ({ ...prev, shift: e.target.value as any }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        {shifts.map(shift => (
                                                            <option key={shift.value} value={shift.value}>
                                                                {shift.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Priority *
                                                    </label>
                                                    <select
                                                        value={newNote.priority}
                                                        onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value as any }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={newNote.follow_up_required}
                                                            onChange={(e) => setNewNote(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Follow-up Required
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newNote.title}
                                                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Brief description of the note..."
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Content *
                                                </label>
                                                <textarea
                                                    value={newNote.content}
                                                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    rows={6}
                                                    placeholder="Detailed nursing notes..."
                                                    required
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNoteForm(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    {editingNote ? "Update Note" : "Save Note"}
                                                </button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default NursingNotes;