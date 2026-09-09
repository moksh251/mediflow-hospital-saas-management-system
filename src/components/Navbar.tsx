import React from 'react';
import { 
  Stethoscope, 
  Building2, 
  User, 
  Pill, 
  FlaskConical, 
  BarChart3,
  RotateCcw,
  Activity
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types/hospital';

export const Navbar: React.FC = () => {
  const { currentRole, setCurrentRole, activePatient, resetDemoData } = useHospital();

  const roleConfigs: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'doctor',
      label: 'Doctor Portal',
      icon: <Stethoscope className="w-4 h-4" />,
      color: 'bg-purple-500/20 text-[#9E7FFF] border-[#9E7FFF]/40',
    },
    {
      role: 'receptionist',
      label: 'Reception & Queue',
      icon: <Building2 className="w-4 h-4" />,
      color: 'bg-sky-500/20 text-[#38bdf8] border-[#38bdf8]/40',
    },
    {
      role: 'pharmacy',
      label: 'Pharmacy',
      icon: <Pill className="w-4 h-4" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      role: 'lab',
      label: 'Laboratory',
      icon: <FlaskConical className="w-4 h-4" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      role: 'patient',
      label: 'Patient Hub',
      icon: <User className="w-4 h-4" />,
      color: 'bg-pink-500/20 text-[#f472b6] border-[#f472b6]/40',
    },
    {
      role: 'management',
      label: 'Owner Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
  ];

  return (
    <header className="bg-[#171717]/95 backdrop-blur-md border-b border-[#2F2F2F] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9E7FFF] via-[#38bdf8] to-[#f472b6] p-0.5 shadow-lg shadow-purple-950/40 flex items-center justify-center">
            <div className="w-full h-full bg-[#171717] rounded-[10px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#9E7FFF] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">MEDIFLOW</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] font-bold border border-[#9E7FFF]/30">
                PRO v5
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono hidden sm:block">Unified Patient Record SaaS</p>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          {roleConfigs.map((cfg) => {
            const isActive = currentRole === cfg.role;
            return (
              <button
                key={cfg.role}
                onClick={() => setCurrentRole(cfg.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                  isActive
                    ? `${cfg.color} shadow-md`
                    : 'bg-[#262626] text-neutral-400 border-[#2F2F2F] hover:text-white hover:bg-[#2F2F2F]'
                }`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Controls & Active Context */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={resetDemoData}
            title="Reset storage to initial mock state"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#262626] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-[#2F2F2F] hover:border-rose-500/30 text-xs font-mono font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Storage</span>
          </button>

          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-[#2F2F2F]">
            <img
              src={activePatient.avatarUrl}
              alt={activePatient.firstName}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-700"
            />
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-none">
                {activePatient.firstName} {activePatient.lastName}
              </div>
              <div className="text-[10px] font-mono text-[#38bdf8] mt-1">
                {activePatient.id}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
