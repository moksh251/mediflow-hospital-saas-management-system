import React from 'react';
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Search, 
  Bell, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types/hospital';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentDoctor, 
    currentReceptionist, 
    currentPatient, 
    setIsSearchModalOpen,
    stats
  } = useHospital();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; badge: string; color: string }[] = [
    {
      role: 'doctor',
      label: 'Doctor EMR',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: 'Clinical',
      color: 'from-violet-600 to-indigo-600 border-violet-500/40 text-violet-200',
    },
    {
      role: 'receptionist',
      label: 'Reception & Triage',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'Front Desk',
      color: 'from-sky-600 to-cyan-600 border-sky-500/40 text-sky-200',
    },
    {
      role: 'patient',
      label: 'Patient Passport',
      icon: <UserCheck className="w-4 h-4" />,
      badge: 'Health Portal',
      color: 'from-emerald-600 to-teal-600 border-emerald-500/40 text-emerald-200',
    }
  ];

  // Dynamic profile depending on active portal
  const activeUserProfile = {
    doctor: {
      name: `Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
      roleTitle: `${currentDoctor.department} Specialist`,
      idTag: currentDoctor.id,
      avatar: currentDoctor.avatarUrl,
    },
    receptionist: {
      name: `${currentReceptionist.firstName} ${currentReceptionist.lastName}`,
      roleTitle: currentReceptionist.deskNumber,
      idTag: currentReceptionist.id,
      avatar: currentReceptionist.avatarUrl,
    },
    patient: {
      name: `${currentPatient.firstName} ${currentPatient.lastName}`,
      roleTitle: `Patient ID: ${currentPatient.id}`,
      idTag: currentPatient.id,
      avatar: currentPatient.avatarUrl,
    }
  }[currentRole];

  return (
    <header className="sticky top-0 z-40 bg-[#171717]/95 backdrop-blur-md border-b border-[#2F2F2F] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand & Hospital Campus */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] via-indigo-600 to-[#38bdf8] p-0.5 shadow-lg shadow-purple-900/30">
                <div className="w-full h-full bg-[#171717] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#9E7FFF] animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#171717]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  MEDI<span className="text-[#9E7FFF]">FLOW</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  SaaS Core
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></span>
                Metro General Hospital • Wing 4B
              </p>
            </div>
          </div>

          {/* Quick MRN Search Launcher Button (Mobile/Tablet visible) */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs text-neutral-300 active:scale-95 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>MRN</span>
          </button>
        </div>

        {/* Center: Triple-Portal Role Switcher Bar */}
        <div className="flex items-center bg-[#262626] p-1.5 rounded-2xl border border-[#2F2F2F] shadow-inner shadow-black/40 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max mx-auto">
            {roles.map((item) => {
              const isActive = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => setCurrentRole(item.role)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} shadow-md shadow-black/40 border border-white/20 text-white font-medium`
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Patient Search, Status & Profile */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Universal Patient ID / MRN Search Trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-[#262626] hover:bg-[#2F2F2F] border border-[#2F2F2F] hover:border-[#38bdf8]/50 rounded-xl text-xs text-neutral-400 hover:text-neutral-200 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#38bdf8] group-hover:scale-110 transition-transform" />
              <span>Lookup Patient ID / MRN...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-neutral-700 rounded text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Stats Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#262626]/80 border border-[#2F2F2F] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-neutral-400">Queue:</span>
            <span className="font-mono font-bold text-white">{stats.currentlyWaitingInQueue} waiting</span>
          </div>

          {/* Notification Icon */}
          <button 
            title="Hospital System Notifications" 
            className="relative p-2 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] border border-[#2F2F2F] text-neutral-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f472b6]"></span>
          </button>

          {/* User Profile Mini Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#2F2F2F]">
            <img
              src={activeUserProfile.avatar}
              alt={activeUserProfile.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#9E7FFF]/40 shadow-sm"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {activeUserProfile.name}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono leading-tight">
                {activeUserProfile.idTag}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
