import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  ChevronDown, 
  Stethoscope, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Search,
  Sparkles,
  Database
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types/hospital';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    activePatient, 
    patients, 
    selectPatientById,
    activeDoctor 
  } = useHospital();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchMrn, setSearchMrn] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfigs: Record<UserRole, { label: string; icon: React.ReactNode; color: string; badge: string; desc: string }> = {
    doctor: {
      label: 'Doctor Portal (EMR)',
      icon: <Stethoscope className="w-4 h-4 text-violet-400" />,
      color: 'from-violet-600 to-indigo-600 border-violet-500/30',
      badge: 'Clinical Care Desk',
      desc: 'Diagnostics, EMR Charting & Queue',
    },
    receptionist: {
      label: 'Reception Portal (Triage)',
      icon: <Building2 className="w-4 h-4 text-sky-400" />,
      color: 'from-sky-600 to-cyan-600 border-sky-500/30',
      badge: 'Front Desk & Admissions',
      desc: 'Patient Intake, MRN & Check-in',
    },
    patient: {
      label: 'Patient Portal (Passport)',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-600 border-emerald-500/30',
      badge: 'Health Passport',
      desc: 'Personal Records & Token View',
    }
  };

  const handleQuickMrnSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMrn.trim()) {
      selectPatientById(searchMrn.trim());
      setSearchMrn('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#171717] border-b border-[#2F2F2F] px-4 lg:px-8 py-3">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Unified DB Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] via-indigo-600 to-[#38bdf8] p-0.5 shadow-lg shadow-purple-900/20">
              <div className="w-full h-full bg-[#171717] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#9E7FFF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  MEDI<span className="text-[#9E7FFF]">FLOW</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9E7FFF]/10 text-[#9E7FFF] border border-[#9E7FFF]/20">
                  Phase 1 Core
                </span>
              </div>
              <p className="text-[11px] text-[#A3A3A3] flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>One Patient • One Connected Record</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick MRN Direct Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleQuickMrnSearch} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or Switch MRN (e.g. MF-P-1042)..."
              value={searchMrn}
              onChange={(e) => setSearchMrn(e.target.value)}
              className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-[#262626] border border-[#2F2F2F] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[#171717] text-[10px] font-mono text-neutral-400 hover:text-white border border-[#2F2F2F]"
            >
              GO
            </button>
          </form>

          {/* Quick Patient Switch Dropdown */}
          <select
            value={activePatient.id}
            onChange={(e) => selectPatientById(e.target.value)}
            className="hidden lg:block py-1.5 px-3 rounded-xl bg-[#262626] border border-[#2F2F2F] text-xs text-[#38bdf8] font-mono font-medium focus:outline-none"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}: {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Master Role Switcher Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Active Patient ID Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#262626] border border-[#2F2F2F]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-[#A3A3A3]">Active MRN:</span>
            <span className="text-xs font-mono font-bold text-white">{activePatient.id}</span>
          </div>

          {/* Role Switcher Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] border border-[#2F2F2F] text-xs font-semibold text-white shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                {roleConfigs[currentRole].icon}
                <span>{roleConfigs[currentRole].label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#171717] border border-[#2F2F2F] shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  Switch Hospital Workspace
                </div>
                {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
                  const isSelected = currentRole === role;
                  const item = roleConfigs[role];
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-[#262626] border border-[#9E7FFF]/40 text-white' 
                          : 'hover:bg-[#262626]/60 text-[#A3A3A3] hover:text-white'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-[#171717] border border-[#2F2F2F] shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{item.label}</span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
