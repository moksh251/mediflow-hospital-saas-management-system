import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserRole, 
  Patient, 
  Doctor, 
  Appointment, 
  ConsultationRecord, 
  Prescription,
  LabOrder,
  PharmacyOrder,
  Invoice,
  InvoiceItem,
  ToastMessage
} from '../types/hospital';
import { 
  INITIAL_PATIENTS, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS,
  INITIAL_LAB_ORDERS,
  INITIAL_PHARMACY_ORDERS,
  INITIAL_INVOICES
} from '../services/mockDatabase';

const STORAGE_KEYS = {
  PATIENTS: 'mediflow_v5_patients',
  APPOINTMENTS: 'mediflow_v5_appointments',
  CONSULTATIONS: 'mediflow_v5_consultations',
  LAB_ORDERS: 'mediflow_v5_lab_orders',
  PHARMACY_ORDERS: 'mediflow_v5_pharmacy_orders',
  INVOICES: 'mediflow_v5_invoices',
};

interface HospitalContextType {
  // Role & Navigation State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeNavId: string;
  setActiveNavId: (id: string) => void;

  // Active Focus Contexts
  activePatient: Patient;
  setActivePatient: (patient: Patient) => void;
  selectPatientById: (patientId: string) => boolean;
  activeDoctor: Doctor;
  setActiveDoctor: (doctor: Doctor) => void;

  // Shared Data Repositories
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: ConsultationRecord[];
  labOrders: LabOrder[];
  pharmacyOrders: PharmacyOrder[];
  invoices: Invoice[];

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // System Management
  resetDemoData: () => void;

  // Operational Queue & Workflows
  registerNewPatient: (patientData: Omit<Patient, 'id' | 'registeredDate'>) => Patient;
  scheduleAppointment: (appointmentData: Omit<Appointment, 'id' | 'tokenNumber' | 'queueCode' | 'createdAt'>) => Appointment;
  checkInPatient: (appointmentId: string) => void;
  markNoShow: (appointmentId: string) => void;
  callPatient: (appointmentId: string) => void;
  completeConsultation: (
    appointmentId: string,
    symptoms: string,
    diagnosis: string,
    clinicalNotes: string,
    prescriptions: Prescription[],
    labTests: string[]
  ) => void;

  // Order & Financial Workflows
  dispensePharmacyOrder: (orderId: string) => void;
  completeLabOrder: (orderId: string, resultDetails: string) => void;
  payInvoice: (invoiceId: string, paymentMethod?: string) => void;

  // Query Selectors
  getPatientById: (patientId: string) => Patient | undefined;
  getDoctorById: (doctorId: string) => Doctor | undefined;
  getAppointmentsForPatient: (patientId: string) => Appointment[];
  getAppointmentsForDoctor: (doctorId: string) => Appointment[];
  getConsultationsForPatient: (patientId: string) => ConsultationRecord[];
  getLabOrdersForPatient: (patientId: string) => LabOrder[];
  getPharmacyOrdersForPatient: (patientId: string) => PharmacyOrder[];
  getInvoicesForPatient: (patientId: string) => Invoice[];
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// Helper to load or initialize LocalStorage
function getStoredData<T>(key: string, initialFallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
  }
  return initialFallback;
}

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('doctor');
  const [activeNavId, setActiveNavId] = useState<string>('overview');

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };
    setToasts((prev) => [newToast, ...prev]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Central Database Entities (Initialized with LocalStorage)
  const [patients, setPatients] = useState<Patient[]>(() =>
    getStoredData(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS)
  );
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getStoredData(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() =>
    getStoredData(STORAGE_KEYS.CONSULTATIONS, [])
  );
  const [labOrders, setLabOrders] = useState<LabOrder[]>(() =>
    getStoredData(STORAGE_KEYS.LAB_ORDERS, INITIAL_LAB_ORDERS)
  );
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>(() =>
    getStoredData(STORAGE_KEYS.PHARMACY_ORDERS, INITIAL_PHARMACY_ORDERS)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    getStoredData(STORAGE_KEYS.INVOICES, INITIAL_INVOICES)
  );

  // Active Focus Entities
  const [activePatient, setActivePatient] = useState<Patient>(() => patients[0] || INITIAL_PATIENTS[0]);
  const [activeDoctor, setActiveDoctor] = useState<Doctor>(INITIAL_DOCTORS[0]);

  // Sync to LocalStorage on modifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) { console.error(e); }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) { console.error(e); }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
    } catch (e) { console.error(e); }
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAB_ORDERS, JSON.stringify(labOrders));
    } catch (e) { console.error(e); }
  }, [labOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHARMACY_ORDERS, JSON.stringify(pharmacyOrders));
    } catch (e) { console.error(e); }
  }, [pharmacyOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) { console.error(e); }
  }, [invoices]);

  // Reset Demo Data Function
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS);
    localStorage.removeItem(STORAGE_KEYS.LAB_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PHARMACY_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);

    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setConsultations([]);
    setLabOrders(INITIAL_LAB_ORDERS);
    setPharmacyOrders(INITIAL_PHARMACY_ORDERS);
    setInvoices(INITIAL_INVOICES);
    setActivePatient(INITIAL_PATIENTS[0]);

    addToast('Demo System Restored', 'All database tables restored to initial state.', 'warning');
  };

  // Select patient by Unique ID / MRN
  const selectPatientById = (patientId: string): boolean => {
    const found = patients.find(p => p.id.toUpperCase() === patientId.trim().toUpperCase());
    if (found) {
      setActivePatient(found);
      addToast('Patient Profile Active', `Loaded patient ${found.firstName} ${found.lastName} (${found.id})`, 'info');
      return true;
    }
    addToast('Patient Not Found', `No patient record matching "${patientId}"`, 'error');
    return false;
  };

  // Register New Patient
  const registerNewPatient = (patientData: Omit<Patient, 'id' | 'registeredDate'>): Patient => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newPatientId = `MF-P-${randomCode}`;
    const newPatient: Patient = {
      ...patientData,
      id: newPatientId,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    setPatients(prev => [newPatient, ...prev]);
    setActivePatient(newPatient);
    addToast('Patient Registered', `MRN ${newPatientId} created for ${newPatient.firstName} ${newPatient.lastName}`, 'success');
    return newPatient;
  };

  // Schedule Appointment
  const scheduleAppointment = (
    data: Omit<Appointment, 'id' | 'tokenNumber' | 'queueCode' | 'createdAt'>
  ): Appointment => {
    const countForDoc = appointments.filter(a => a.doctorId === data.doctorId).length + 1;
    const deptPrefix = (data.department || 'GEN').substring(0, 4).toUpperCase();
    
    const newAppointment: Appointment = {
      ...data,
      id: `APT-${Date.now().toString().slice(-6)}`,
      tokenNumber: countForDoc,
      queueCode: `${deptPrefix}-0${countForDoc}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);
    addToast('Appointment Scheduled', `Token ${newAppointment.queueCode} assigned for ${newAppointment.timeSlot}`, 'info');
    return newAppointment;
  };

  // Phase 3 Queue Actions
  const checkInPatient = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId
          ? { ...a, status: 'WAITING', checkInTime: new Date().toISOString() }
          : a
      )
    );
    if (apt) {
      addToast('Patient Checked In', `Token ${apt.queueCode} status updated to WAITING.`, 'success');
    }
  };

  const markNoShow = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId ? { ...a, status: 'NO_SHOW' } : a
      )
    );
    if (apt) {
      addToast('Marked No-Show', `Token ${apt.queueCode} flagged as absent.`, 'warning');
    }
  };

  const callPatient = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId
          ? { ...a, status: 'IN_CONSULTATION', consultationStartTime: new Date().toISOString() }
          : a
      )
    );
    if (apt) {
      addToast('Patient Called to Suite', `Token ${apt.queueCode} is now IN CONSULTATION.`, 'info');
    }
  };

  // Complete Consultation Action
  const completeConsultation = (
    appointmentId: string,
    symptoms: string,
    diagnosis: string,
    clinicalNotes: string,
    prescriptions: Prescription[],
    labTests: string[]
  ) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    const doc = doctors.find(d => d.id === apt.doctorId);
    const doctorName = doc ? `Dr. ${doc.firstName} ${doc.lastName}` : 'Consulting Doctor';
    const patientObj = patients.find(p => p.id === apt.patientId);
    const patientName = patientObj ? `${patientObj.firstName} ${patientObj.lastName}` : 'Patient';

    // 1. Save Consultation History Record
    const consultRecord: ConsultationRecord = {
      id: `CONSULT-${Date.now().toString().slice(-6)}`,
      appointmentId,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      doctorName,
      date: new Date().toISOString().split('T')[0],
      symptoms,
      diagnosis,
      clinicalNotes,
      prescriptions,
      labTests,
      createdAt: new Date().toISOString(),
    };

    setConsultations(prev => [consultRecord, ...prev]);

    // 2. Update Appointment status
    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId
          ? { ...a, status: 'COMPLETED', completedTime: new Date().toISOString() }
          : a
      )
    );

    // 3. Auto-generate Pharmacy Order
    if (prescriptions.length > 0) {
      const newPharmOrder: PharmacyOrder = {
        id: `PHARM-${Date.now().toString().slice(-5)}`,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId,
        medicines: prescriptions,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      setPharmacyOrders(prev => [newPharmOrder, ...prev]);
    }

    // 4. Auto-generate Lab Orders
    if (labTests.length > 0) {
      const newLabOrders: LabOrder[] = labTests.map((test, index) => ({
        id: `LAB-${Date.now().toString().slice(-5)}-0${index + 1}`,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId,
        testName: test,
        status: 'PENDING',
        resultDetails: null,
        createdAt: new Date().toISOString(),
      }));
      setLabOrders(prev => [...newLabOrders, ...prev]);
    }

    // 5. Generate Base Invoice
    setInvoices(prev => {
      const existing = prev.find(inv => inv.appointmentId === appointmentId);
      if (existing) return prev;

      const baseItem: InvoiceItem = {
        id: `item-consult-${Date.now()}`,
        description: `${doc?.department || 'Specialist'} Consultation Fee`,
        amount: 500,
        category: 'consultation',
      };

      const newInvoice: Invoice = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: apt.patientId,
        appointmentId,
        items: [baseItem],
        totalAmount: 500,
        status: 'UNPAID',
        createdAt: new Date().toISOString(),
      };

      return [newInvoice, ...prev];
    });

    addToast(
      'Consultation Complete',
      `Saved notes for ${patientName}. Orders dispatched to Pharmacy & Lab.`,
      'success'
    );
  };

  // Pharmacy Action
  const dispensePharmacyOrder = (orderId: string) => {
    const order = pharmacyOrders.find(p => p.id === orderId);
    if (!order) return;

    setPharmacyOrders(prev =>
      prev.map(p => (p.id === orderId ? { ...p, status: 'DISPENSED', dispensedAt: new Date().toISOString() } : p))
    );

    const pharmacyChargeAmount = 1250;
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.appointmentId === order.appointmentId) {
          const newItem: InvoiceItem = {
            id: `item-pharm-${Date.now()}`,
            description: `Pharmacy Prescriptions (${order.medicines.length} items)`,
            amount: pharmacyChargeAmount,
            category: 'pharmacy',
          };
          const updatedItems = [...inv.items, newItem];
          return {
            ...inv,
            items: updatedItems,
            totalAmount: updatedItems.reduce((s, i) => s + i.amount, 0),
          };
        }
        return inv;
      })
    );

    addToast('Medications Dispensed', `Order ${orderId} fulfilled. Bill appended with ₹1,250.`, 'success');
  };

  // Lab Action
  const completeLabOrder = (orderId: string, resultDetails: string) => {
    const order = labOrders.find(l => l.id === orderId);
    if (!order) return;

    setLabOrders(prev =>
      prev.map(l =>
        l.id === orderId
          ? { ...l, status: 'COMPLETED', resultDetails, completedAt: new Date().toISOString() }
          : l
      )
    );

    const labChargeAmount = 800;
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.appointmentId === order.appointmentId) {
          const newItem: InvoiceItem = {
            id: `item-lab-${Date.now()}`,
            description: `Lab Diagnostic: ${order.testName}`,
            amount: labChargeAmount,
            category: 'lab',
          };
          const updatedItems = [...inv.items, newItem];
          return {
            ...inv,
            items: updatedItems,
            totalAmount: updatedItems.reduce((s, i) => s + i.amount, 0),
          };
        }
        return inv;
      })
    );

    addToast('Lab Report Published', `Diagnostic results generated. Bill updated with ₹800.`, 'success');
  };

  // Payment Action
  const payInvoice = (invoiceId: string, paymentMethod = 'UPI / Card Online') => {
    const inv = invoices.find(i => i.id === invoiceId);
    setInvoices(prev =>
      prev.map(i =>
        i.id === invoiceId
          ? { ...i, status: 'PAID', paidAt: new Date().toISOString(), paymentMethod }
          : i
      )
    );
    if (inv) {
      addToast('Invoice Paid', `Receipt issued for ₹${inv.totalAmount.toLocaleString()} via ${paymentMethod}`, 'success');
    }
  };

  // Query Selectors
  const getPatientById = (patientId: string) => patients.find(p => p.id === patientId);
  const getDoctorById = (doctorId: string) => doctors.find(d => d.id === doctorId);
  const getAppointmentsForPatient = (patientId: string) => 
    appointments.filter(a => a.patientId === patientId);
  const getAppointmentsForDoctor = (doctorId: string) => 
    appointments.filter(a => a.doctorId === doctorId);
  const getConsultationsForPatient = (patientId: string) => 
    consultations.filter(c => c.patientId === patientId);
  const getLabOrdersForPatient = (patientId: string) => 
    labOrders.filter(l => l.patientId === patientId);
  const getPharmacyOrdersForPatient = (patientId: string) => 
    pharmacyOrders.filter(p => p.patientId === patientId);
  const getInvoicesForPatient = (patientId: string) => 
    invoices.filter(i => i.patientId === patientId);

  const contextValue = useMemo(
    () => ({
      currentRole,
      setCurrentRole,
      activeNavId,
      setActiveNavId,
      activePatient,
      setActivePatient,
      selectPatientById,
      activeDoctor,
      setActiveDoctor,
      patients,
      doctors,
      appointments,
      consultations,
      labOrders,
      pharmacyOrders,
      invoices,
      toasts,
      addToast,
      removeToast,
      resetDemoData,
      registerNewPatient,
      scheduleAppointment,
      checkInPatient,
      markNoShow,
      callPatient,
      completeConsultation,
      dispensePharmacyOrder,
      completeLabOrder,
      payInvoice,
      getPatientById,
      getDoctorById,
      getAppointmentsForPatient,
      getAppointmentsForDoctor,
      getConsultationsForPatient,
      getLabOrdersForPatient,
      getPharmacyOrdersForPatient,
      getInvoicesForPatient,
    }),
    [
      currentRole,
      activeNavId,
      activePatient,
      activeDoctor,
      patients,
      doctors,
      appointments,
      consultations,
      labOrders,
      pharmacyOrders,
      invoices,
      toasts,
    ]
  );

  return (
    <HospitalContext.Provider value={contextValue}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
