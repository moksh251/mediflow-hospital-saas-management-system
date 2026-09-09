import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileHeart,
  Pill,
  TestTube2,
  Receipt,
  Bed,
  Settings,
  ShieldCheck,
  Stethoscope,
  Activity,
  History,
  QrCode,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Sidebar: React.FC = () => {
  const { currentRole, activeNavTab, setActiveNavTab, appointments, patients, labOrders } = useHospital();

  const doctorNav = [
    { id: 'overview', label: 'Clinical EMR Desk', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'live-queue', label: 'Today Consultation Queue', icon: <ClipboardList className="w-4 h-4" />, badge: `${appointments.filter(a => a.status === 'checked-in' || a.status === 'in-consultation').length} Waiting` },
    { id: 'patient-chart', label: 'Patient Longitudinal Chart', icon: <FileHeart className="w-4 h-4" />, badge: null },
    { id: 'prescriptions', label: 'E-Prescription Studio', icon: <Pill className="w-4 h-4" />, badge: null },
    { id: 'lab-orders', label: 'Diagnostics & Labs', icon: <TestTube2 className="w-4 h-4" />, badge: `${labOrders.filter(l => l.status === 'analyzing').length} STAT` },
    { id: 'history', label: 'Consultation Archive', icon: <History className="w-4 h-4" />, badge: null },
  ];

  const receptionistNav = [
    { id: 'overview', label: 'Triage & Front Desk', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'patient-intake', label: 'New Patient Intake & MRN', icon: <Users className="w-4 h-4" />, badge: '+ Fast' },
    { id: 'appointments-desk', label: 'Appointment Scheduling', icon: <CalendarCheck className="w-4 h-4" />, badge: `${appointments.length} Total` },
    { id: 'queue-management', label: 'Live Department Queue', icon: <Activity className="w-4 h-4" />, badge: 'Active' },
    { id: 'billing-cashier', label: 'Billing & Copay Clearance', icon: <Receipt className="w-4 h-4" />, badge: '2 Pending' },
    { id: 'bed-ward', label: 'Ward & Bed Management', icon: <Bed className="w-4 h-4" />, badge: '78% Full' },
  ];

  const patientNav = [
    { id: 'overview', label: 'Health Passport', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'my-appointments', label: 'My Visits & Queue Token', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Token #1' },
    { id: 'medical-records', label: 'Unified Medical History', icon: <FileHeart className="w-4 h-4" />, badge: 'Updated' },
    { id: 'my-prescriptions', label: 'Digital Prescriptions', icon: <Pill className="w-4 h-4" />, badge: '1 Refill' },
    { id: 'lab-reports', label: 'Lab & Imaging Results', icon: <TestTube2 className="w-4 h-4" />, badge: 'New Result' },
    { id: 'billing-history', label: 'Invoices & Insurance', icon: <Receipt className="w-4 h-4" />, badge: null },
  ];

  const navItems = currentRole === 'doctor' 
    ? doctorNav 
    : currentRole === 'receptionist' 
    ? receptionistNav 
    : patientNav;

  return (
    <aside className="w-full lg:w-64 bg-[#171717] border-r border-[#2F2F2F] flex flex-col shrink-0">
      {/* Current Mode Banner */}
      <div className="p-4 border-b border-[#2F2F2F]">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#262626] to-[#1e1e1e] border border-[#2F2F2F]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3]">
              Active Scope
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
              {currentRole.toUpperCase()}
            </span>
          </div>
          <div className="text-xs font-semibold text-white mt-1">
            {currentRole === 'doctor' && 'Clinical Diagnostics EMR'}
            {currentRole === 'receptionist' && 'Hospital Triage & Reception'}
            {currentRole === 'patient' && 'Personal Health Passport'}
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#262626] text-white border border-[#38bdf8]/40 shadow-sm shadow-black/40 font-semibold'
                  : 'text-[#A3A3A3] hover:text-white hover:bg-[#262626]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#38bdf8]' : 'text-neutral-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Unified MRN Architecture Badge */}
      <div className="p-4 border-t border-[#2F2F2F]">
        <div className="p-3 rounded-xl bg-[#262626]/60 border border-[#2F2F2F] text-xs space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Unified Architecture</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            All clinical actions sync instantly across Doctor, Reception, and Patient views via MRN.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9E7FFF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E7FFF]"></span>
            <span>Single Patient ID Pipeline</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
