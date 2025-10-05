import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, Eye, CheckCircle, AlertCircle, Users, UserCheck, Timer } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getDoctorSidebarItems } from '../../config/doctorSidebar';

// Types
interface QueuePatient {
  id: string;
  queueNumber: number;
  patientName: string;
  patientId: string;
  age: number;
  gender: 'male' | 'female';
  phoneNumber: string;
  appointmentTime: string;
  registrationTime: string;
  priority: 'normal' | 'urgent' | 'emergency';
  chiefComplaint: string;
  vitalSigns?: {
    bloodPressure: string;
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
    weight: number;
    height: number;
  };
  status: 'waiting' | 'screening' | 'ready' | 'in_progress' | 'completed';
  estimatedDuration: number; // in minutes
  notes?: string;
}

interface QueueStats {
  totalPatients: number;
  waiting: number;
  inProgress: number;
  completed: number;
  averageWaitTime: number;
}

const DoctorQueue: React.FC = () => {
  const sidebarItems = getDoctorSidebarItems("/doctor/queue");
  
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalPatients: 0,
    waiting: 0,
    inProgress: 0,
    completed: 0,
    averageWaitTime: 0
  });
  
  const [currentPatient, setCurrentPatient] = useState<QueuePatient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockPatients: QueuePatient[] = [
      {
        id: 'Q001',
        queueNumber: 1,
        patientName: 'Ahmad Wijaya',
        patientId: 'P001',
        age: 45,
        gender: 'male',
        phoneNumber: '081234567890',
        appointmentTime: '09:00',
        registrationTime: '08:45',
        priority: 'normal',
        chiefComplaint: 'Demam dan batuk sudah 3 hari',
        vitalSigns: {
          bloodPressure: '120/80',
          temperature: 38.2,
          heartRate: 88,
          respiratoryRate: 20,
          weight: 70,
          height: 170
        },
        status: 'in_progress',
        estimatedDuration: 15,
        notes: 'Pasien komplain demam tinggi disertai batuk berdahak'
      },
      {
        id: 'Q002',
        queueNumber: 2,
        patientName: 'Sari Dewi',
        patientId: 'P002',
        age: 32,
        gender: 'female',
        phoneNumber: '081234567891',
        appointmentTime: '09:30',
        registrationTime: '09:15',
        priority: 'normal',
        chiefComplaint: 'Kontrol diabetes rutin',
        vitalSigns: {
          bloodPressure: '110/70',
          temperature: 36.5,
          heartRate: 76,
          respiratoryRate: 18,
          weight: 58,
          height: 155
        },
        status: 'ready',
        estimatedDuration: 10
      },
      {
        id: 'Q003',
        queueNumber: 3,
        patientName: 'Budi Santoso',
        patientId: 'P003',
        age: 28,
        gender: 'male',
        phoneNumber: '081234567892',
        appointmentTime: '10:00',
        registrationTime: '09:45',
        priority: 'urgent',
        chiefComplaint: 'Nyeri dada dan sesak napas',
        vitalSigns: {
          bloodPressure: '140/90',
          temperature: 36.8,
          heartRate: 95,
          respiratoryRate: 24,
          weight: 75,
          height: 175
        },
        status: 'ready',
        estimatedDuration: 20,
        notes: 'Pasien mengeluh nyeri dada sejak pagi, perlu pemeriksaan segera'
      },
      {
        id: 'Q004',
        queueNumber: 4,
        patientName: 'Maria Gonzales',
        patientId: 'P004',
        age: 55,
        gender: 'female',
        phoneNumber: '081234567893',
        appointmentTime: '10:30',
        registrationTime: '10:15',
        priority: 'normal',
        chiefComplaint: 'Kontrol hipertensi',
        status: 'screening',
        estimatedDuration: 10
      },
      {
        id: 'Q005',
        queueNumber: 5,
        patientName: 'Robert Johnson',
        patientId: 'P005',
        age: 40,
        gender: 'male',
        phoneNumber: '081234567894',
        appointmentTime: '11:00',
        registrationTime: '10:45',
        priority: 'normal',
        chiefComplaint: 'Sakit kepala dan pusing',
        status: 'waiting',
        estimatedDuration: 15
      },
      {
        id: 'Q006',
        queueNumber: 6,
        patientName: 'Lisa Anderson',
        patientId: 'P006',
        age: 29,
        gender: 'female',
        phoneNumber: '081234567895',
        appointmentTime: '11:30',
        registrationTime: '11:20',
        priority: 'emergency',
        chiefComplaint: 'Kecelakaan motor, luka di kaki',
        status: 'ready',
        estimatedDuration: 25,
        notes: 'Pasien mengalami kecelakaan, luka robek di kaki kanan'
      }
    ];

    setPatients(mockPatients);
    setCurrentPatient(mockPatients.find(p => p.status === 'in_progress') || null);

    // Calculate stats
    const waitingCount = mockPatients.filter(p => p.status === 'waiting').length;
    const inProgressCount = mockPatients.filter(p => p.status === 'in_progress').length;
    const completedCount = mockPatients.filter(p => p.status === 'completed').length;
    const readyCount = mockPatients.filter(p => p.status === 'ready').length;

    setStats({
      totalPatients: mockPatients.length,
      waiting: waitingCount + readyCount,
      inProgress: inProgressCount,
      completed: completedCount,
      averageWaitTime: 25 // mock average wait time in minutes
    });
  }, []);

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCallNext = () => {
    const nextPatient = patients.find(p => p.status === 'ready' && p.priority === 'emergency') ||
                       patients.find(p => p.status === 'ready' && p.priority === 'urgent') ||
                       patients.find(p => p.status === 'ready');

    if (nextPatient) {
      // Mark current patient as completed if exists
      if (currentPatient) {
        setPatients(prev => prev.map(p => 
          p.id === currentPatient.id ? { ...p, status: 'completed' as const } : p
        ));
      }

      // Set next patient as in_progress
      setPatients(prev => prev.map(p => 
        p.id === nextPatient.id ? { ...p, status: 'in_progress' as const } : p
      ));
      
      setCurrentPatient(nextPatient);
    }
  };

  const handleCompletePatient = () => {
    if (currentPatient) {
      setPatients(prev => prev.map(p => 
        p.id === currentPatient.id ? { ...p, status: 'completed' as const } : p
      ));
      setCurrentPatient(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-gray-600 bg-gray-50';
      case 'screening': return 'text-blue-600 bg-blue-50';
      case 'ready': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-purple-600 bg-purple-50';
      case 'completed': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Clock className="h-4 w-4" />;
      case 'screening': return <User className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <DashboardLayout sidebarItems={sidebarItems} title="Doctor Queue">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
              <p className="text-gray-600 mt-1">Kelola antrian pasien dan panggil pasien berikutnya</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCallNext}
                disabled={!patients.some(p => p.status === 'ready')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheck className="h-4 w-4" />
                Call Next Patient
              </button>
              {currentPatient && (
                <button
                  onClick={handleCompletePatient}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete Patient
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Waiting</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.waiting}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-green-600">{stats.averageWaitTime}m</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Timer className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Patient */}
          {currentPatient && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <AlertCircle className="h-5 w-5" />
                  Current Patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      #{currentPatient.queueNumber} - {currentPatient.patientName}
                    </h3>
                    <p className="text-gray-600">{currentPatient.patientId} • {currentPatient.age} years old • {currentPatient.gender}</p>
                    <p className="text-sm text-gray-500 mt-1">Appointment: {currentPatient.appointmentTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Chief Complaint</p>
                    <p className="text-gray-600">{currentPatient.chiefComplaint}</p>
                    {currentPatient.notes && (
                      <p className="text-sm text-orange-600 mt-2 italic">{currentPatient.notes}</p>
                    )}
                  </div>
                  {currentPatient.vitalSigns && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Vital Signs</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>BP: {currentPatient.vitalSigns.bloodPressure} mmHg</div>
                        <div>Temp: {currentPatient.vitalSigns.temperature}°C</div>
                        <div>HR: {currentPatient.vitalSigns.heartRate} bpm</div>
                        <div>Weight: {currentPatient.vitalSigns.weight} kg</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama, ID pasien, atau keluhan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="waiting">Waiting</option>
                  <option value="screening">Screening</option>
                  <option value="ready">Ready</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Patient Queue List */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Queue ({filteredPatients.length} patients)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                      patient.id === currentPatient?.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">#{patient.queueNumber}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                            {patient.priority}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-gray-900">{patient.patientName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(patient.status)}`}>
                              {getStatusIcon(patient.status)}
                              {patient.status}
                            </span>
                          </div>
                          <p className="text-gray-600">{patient.patientId} • {patient.age} years • {patient.gender}</p>
                          <p className="text-sm text-gray-500">Appointment: {patient.appointmentTime} | Registered: {patient.registrationTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700 mb-1">Chief Complaint</p>
                        <p className="text-gray-600 mb-2">{patient.chiefComplaint}</p>
                        <p className="text-xs text-gray-500">Est. Duration: {patient.estimatedDuration} min</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowPatientModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {patient.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-sm text-yellow-800">{patient.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Detail Modal */}
          {showPatientModal && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                  <button
                    onClick={() => setShowPatientModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Queue Number</label>
                      <div className="text-2xl font-bold text-gray-900">#{selectedPatient.queueNumber}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedPatient.priority)}`}>
                        {selectedPatient.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <div className="text-sm text-gray-900">{selectedPatient.patientName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <div className="text-sm text-gray-900">{selectedPatient.patientId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age & Gender</label>
                      <div className="text-sm text-gray-900">{selectedPatient.age} years • {selectedPatient.gender}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="text-sm text-gray-900">{selectedPatient.phoneNumber}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                      <div className="text-sm text-gray-900">{selectedPatient.appointmentTime}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Time</label>
                      <div className="text-sm text-gray-900">{selectedPatient.registrationTime}</div>
                    </div>
                  </div>

                  {/* Chief Complaint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {selectedPatient.chiefComplaint}
                    </div>
                  </div>

                  {/* Vital Signs */}
                  {selectedPatient.vitalSigns && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Vital Signs</label>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-900">Blood Pressure</div>
                          <div className="text-blue-700">{selectedPatient.vitalSigns.bloodPressure} mmHg</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="font-medium text-red-900">Temperature</div>
                          <div className="text-red-700">{selectedPatient.vitalSigns.temperature}°C</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-900">Heart Rate</div>
                          <div className="text-green-700">{selectedPatient.vitalSigns.heartRate} bpm</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-medium text-purple-900">Respiratory Rate</div>
                          <div className="text-purple-700">{selectedPatient.vitalSigns.respiratoryRate} /min</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="font-medium text-orange-900">Weight</div>
                          <div className="text-orange-700">{selectedPatient.vitalSigns.weight} kg</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">Height</div>
                          <div className="text-gray-700">{selectedPatient.vitalSigns.height} cm</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedPatient.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                        {selectedPatient.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default DoctorQueue;