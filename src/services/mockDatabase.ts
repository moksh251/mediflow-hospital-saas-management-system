import { Patient, Doctor, Appointment, User, LabOrder, PharmacyOrder, Invoice } from '../types/hospital';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-DOC-01',
    name: 'Dr. Rajesh Sharma',
    email: 'dr.sharma@mediflow.health',
    role: 'doctor',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'USR-REC-01',
    name: 'Sunita Verma (Front Desk)',
    email: 'sunita.verma@mediflow.health',
    role: 'receptionist',
    avatarUrl: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'USR-PHM-01',
    name: 'Ramesh Kumar (Pharmacy)',
    email: 'pharmacy@mediflow.health',
    role: 'pharmacy',
    avatarUrl: 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'USR-LAB-01',
    name: 'Dr. Vikramaditya Sen (Lab Diagnostics)',
    email: 'lab@mediflow.health',
    role: 'lab',
    avatarUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'USR-PAT-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'patient',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-101',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    specialty: 'Interventional Cardiology',
    department: 'Cardiology',
    licenseNumber: 'MCI-MH-993812',
    roomNumber: 'Consultation Suite 302',
    phone: '+91 98200 11001',
    email: 'dr.sharma@mediflow.health',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    isAvailable: true,
    averageConsultationMinutes: 12,
  },
  {
    id: 'DOC-102',
    firstName: 'Priya',
    lastName: 'Patel',
    specialty: 'Internal Medicine & Diabetology',
    department: 'Endocrinology',
    licenseNumber: 'MCI-GJ-881290',
    roomNumber: 'Consultation Suite 204',
    phone: '+91 98200 11002',
    email: 'dr.patel@mediflow.health',
    avatarUrl: 'https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg?auto=compress&cs=tinysrgb&w=300',
    isAvailable: true,
    averageConsultationMinutes: 10,
  },
  {
    id: 'DOC-103',
    firstName: 'Ananya',
    lastName: 'Iyer',
    specialty: 'Neurology & Neurovascular Care',
    department: 'Neurology',
    licenseNumber: 'MCI-KA-449102',
    roomNumber: 'Consultation Suite 410',
    phone: '+91 98200 11003',
    email: 'dr.iyer@mediflow.health',
    avatarUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
    isAvailable: false,
    averageConsultationMinutes: 15,
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'MF-P-1042',
    firstName: 'Aarav',
    lastName: 'Sharma',
    dateOfBirth: '1984-06-14',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    nationalId: 'AADHAAR-4921-8812',
    address: '42 MG Road, Indiranagar, Bengaluru, KA',
    emergencyContact: {
      name: 'Meera Sharma',
      relationship: 'Spouse',
      phone: '+91 98765 43211',
    },
    insuranceProvider: 'Star Health Comprehensive Shield',
    insurancePolicyNumber: 'SH-9923841-A',
    allergies: ['Penicillin', 'Latex'],
    registeredDate: '2024-01-15',
    primaryDoctorId: 'DOC-101',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: 76,
      temperature: '98.6 °F',
      spo2: 99,
    }
  },
  {
    id: 'MF-P-2089',
    firstName: 'Rohan',
    lastName: 'Verma',
    dateOfBirth: '1976-11-28',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 98123 45678',
    email: 'rohan.verma@example.com',
    nationalId: 'AADHAAR-8810-3341',
    address: '12 Bandra West, Mumbai, MH',
    emergencyContact: {
      name: 'Sunita Verma',
      relationship: 'Sister',
      phone: '+91 98123 45679',
    },
    insuranceProvider: 'HDFC ERGO Optima Secure',
    insurancePolicyNumber: 'HDFC-771203',
    allergies: ['Sulfa Drugs'],
    registeredDate: '2024-03-20',
    primaryDoctorId: 'DOC-102',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    vitals: {
      bloodPressure: '135/88 mmHg',
      heartRate: 82,
      temperature: '98.4 °F',
      spo2: 97,
    }
  },
  {
    id: 'MF-P-3315',
    firstName: 'Diya',
    lastName: 'Reddy',
    dateOfBirth: '1992-03-05',
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 99887 76655',
    email: 'diya.reddy@example.com',
    nationalId: 'AADHAAR-3341-9920',
    address: '88 Jubilee Hills, Hyderabad, TS',
    emergencyContact: {
      name: 'Suresh Reddy',
      relationship: 'Brother',
      phone: '+91 99887 76656',
    },
    insuranceProvider: 'Care Health Advantage',
    insurancePolicyNumber: 'CARE-481920',
    allergies: ['Aspirin'],
    registeredDate: '2024-05-10',
    primaryDoctorId: 'DOC-101',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    vitals: {
      bloodPressure: '118/75 mmHg',
      heartRate: 70,
      temperature: '98.7 °F',
      spo2: 99,
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-2025-001',
    patientId: 'MF-P-1042', // Aarav Sharma
    doctorId: 'DOC-101',    // Dr. Rajesh Sharma
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    tokenNumber: 1,
    queueCode: 'CARDIO-01',
    status: 'IN_CONSULTATION',
    priority: 'urgent',
    reasonForVisit: 'Substernal chest tightness & palpitations after exertion',
    department: 'Cardiology',
    notes: 'Prior ECG shows mild ST changes. Transferred directly to consultation suite.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'APT-2025-002',
    patientId: 'MF-P-2089', // Rohan Verma
    doctorId: 'DOC-101',    // Dr. Rajesh Sharma
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:30 AM',
    tokenNumber: 2,
    queueCode: 'CARDIO-02',
    status: 'WAITING',
    priority: 'routine',
    reasonForVisit: 'Routine 6-month cardiovascular and blood pressure review',
    department: 'Cardiology',
    notes: 'Patient checked in at counter. Seated in Waiting Area A.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'APT-2025-003',
    patientId: 'MF-P-3315', // Diya Reddy
    doctorId: 'DOC-101',    // Dr. Rajesh Sharma
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    tokenNumber: 3,
    queueCode: 'CARDIO-03',
    status: 'PENDING',
    priority: 'routine',
    reasonForVisit: 'Post-viral fatigue and occasional dizziness',
    department: 'Cardiology',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'LAB-1001',
    patientId: 'MF-P-1042',
    doctorId: 'DOC-101',
    appointmentId: 'APT-2025-001',
    testName: '12-Lead Electrocardiogram (ECG / EKG)',
    status: 'COMPLETED',
    resultDetails: 'Normal Sinus Rhythm. No acute ST-segment elevation. QTc interval within 420ms normal limits.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'LAB-1002',
    patientId: 'MF-P-1042',
    doctorId: 'DOC-101',
    appointmentId: 'APT-2025-001',
    testName: 'High-Sensitivity Cardiac Troponin T & Lipid Panel',
    status: 'PENDING',
    resultDetails: null,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_PHARMACY_ORDERS: PharmacyOrder[] = [
  {
    id: 'PHARM-901',
    patientId: 'MF-P-1042',
    doctorId: 'DOC-101',
    appointmentId: 'APT-2025-001',
    medicines: [
      {
        id: 'MED-1',
        medicineName: 'Atorvastatin (Lipitor)',
        dosage: '20 mg',
        frequency: 'Once daily at bedtime',
        duration: '30 days',
        instructions: 'Take with or without food.',
      },
      {
        id: 'MED-2',
        medicineName: 'Metoprolol Succinate ER',
        dosage: '50 mg',
        frequency: 'Once daily in morning',
        duration: '30 days',
        instructions: 'Do not crush or chew tablets.',
      }
    ],
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-8821',
    patientId: 'MF-P-1042',
    appointmentId: 'APT-2025-001',
    items: [
      {
        id: 'item-1',
        description: 'Interventional Cardiology Specialist Consultation',
        amount: 500,
        category: 'consultation',
      }
    ],
    totalAmount: 500,
    status: 'UNPAID',
    createdAt: new Date().toISOString(),
  }
];
