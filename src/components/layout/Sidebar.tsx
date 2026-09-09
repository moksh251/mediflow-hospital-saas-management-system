import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileHeart, 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Layers,
  Database
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Sidebar: React.FC = () => {
  const { currentRole, activeNavId, setActiveNavId, appointments, patients } = useHospital();

  const doctorNav = [
    { id: 'overview', label: 'Doctor EMR Overview', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'queue', label: 'Live Consult Queue', icon: <Users className="w-4 h-4" />, badge: `${appointments.length} Total` },
    { id: 'patient-record', label: 'Patient Record View', icon: <FileHeart className="w-4 h-4" />, badge: 'Active MRN' },
  ];

  const receptionistNav = [
    { id: 'overview', label: 'Admissions & Triage', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'intake', label: 'New Patient Intake', icon: <Users className="w-4 h-4" />, badge: '+ New ID' },
    { id: 'schedule', label: 'Hospital Scheduling', icon: <CalendarCheck className="w-4 h-4" />, badge: `${appointments.length}` },
  ];

  const patientNav = [
    { id: 'overview', label: 'Health Passport', icon: <LayoutDashboard className="w-4 h-4" />, badge: null },
    { id: 'my-visits', label: 'My Appointments', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Token #1' },
    { id: 'my-records', label: 'Unified Medical Record', icon: <FileHeart className="w-4 h-4" />, badge: 'Linked' },
  ];

  const navItems = currentRole === 'doctor' 
    ? doctorNav 
    : currentRole === 'receptionist' 
    ? receptionistNav 
    : patientNav;

  return (
    <aside className="w-full lg:w-64 bg-[#171717] border-r border-[#2F2F2F] flex flex-col shrink-0 p-4 space-y-4">
      {/* Current Workspace Scope Pill */}
      <div className="p-3 rounded-xl bg-[#262626] border border-[#2F2F2F]">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#A3A3A3] uppercase font-bold">
          <span>Active Portal</span>
          <span className="px-1.5 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF]">
            {currentRole}
          </span>
        </div>
        <div className="text-xs font-semibold text-white mt-1 capitalize">
          {currentRole === 'doctor' && 'Doctor Consultation EMR'}
          {currentRole === 'receptionist' && 'Reception & Front Desk'}
          {currentRole === 'patient' && 'Patient Health Passport'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavId(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#262626] text-white border border-[#38bdf8]/40 shadow-sm font-semibold'
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

      {/* Core Architectural Rule Callout */}
      <div className="p-3.5 rounded-xl bg-[#1e1e1e] border border-[#2F2F2F] text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-white font-medium">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Single Record Core</span>
        </div>
        <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
          One Patient ID connects Doctors, Reception, and Patients in real-time.
        </p>
      </div>
    </aside>
  );
};
