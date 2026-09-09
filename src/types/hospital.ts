export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'pharmacy' | 'lab' | 'management';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AppointmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PriorityLevel = 'routine' | 'urgent' | 'emergency';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Patient {
  id: string; // Permanent Unique Patient ID (e.g. MF-P-1042)
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  nationalId: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string[];
  registeredDate: string;
  primaryDoctorId?: string;
  avatarUrl: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    spo2: number;
  };
}

export interface Doctor {
  id: string; // e.g. DOC-101
  firstName: string;
  lastName: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  roomNumber: string;
  phone: string;
  email: string;
  avatarUrl: string;
  isAvailable: boolean;
  averageConsultationMinutes: number; // Operational metric for prediction engine
}

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  prescriptions: Prescription[];
  labTests: string[];
  createdAt: string;
}

export interface Appointment {
  id: string; // e.g. APT-2025-001
  patientId: string; // Foreign Key -> Patient.id
  doctorId: string;  // Foreign Key -> Doctor.id
  date: string;
  timeSlot: string;
  tokenNumber: number;
  queueCode: string; // e.g. CARDIO-01
  status: AppointmentStatus;
  priority: PriorityLevel;
  reasonForVisit: string;
  department: string;
  checkInTime?: string;
  consultationStartTime?: string;
  completedTime?: string;
  notes?: string;
  createdAt: string;
}

export interface LabOrder {
  id: string; // e.g. LAB-1002
  patientId: string;
  doctorId: string;
  appointmentId: string;
  testName: string;
  status: 'PENDING' | 'COMPLETED';
  resultDetails: string | null;
  createdAt: string;
  completedAt?: string;
}

export interface PharmacyOrder {
  id: string; // e.g. PHARM-901
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medicines: Prescription[];
  status: 'PENDING' | 'DISPENSED';
  createdAt: string;
  dispensedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  category: 'consultation' | 'pharmacy' | 'lab' | 'other';
}

export interface Invoice {
  id: string; // e.g. INV-8821
  patientId: string;
  appointmentId: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'UNPAID' | 'PAID';
  createdAt: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}
