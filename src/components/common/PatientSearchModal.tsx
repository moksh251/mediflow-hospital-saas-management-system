import React, { useState } from 'react';
import { 
  Search, 
  X, 
  User, 
  Phone, 
  Calendar, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  QrCode 
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PatientSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    patients, 
    setCurrentPatient, 
    setCurrentRole,
    setActiveNavTab 
  } = useHospital();

  const [term, setTerm] = useState('');

  if (!isSearchModalOpen) return null;

  const filtered = patients.filter(p => {
    const q = term.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.nationalId.toLowerCase().includes(q)
    );
  });

  const handleSelectPatient = (patient: typeof patients[0], destination: 'doctor' | 'receptionist' | 'patient') => {
    setCurrentPatient(patient);
    setCurrentRole(destination);
    setActiveNavTab('overview');
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#171717] border border-[#2F2F2F] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Search Input */}
        <div className="p-4 border-b border-[#2F2F2F] flex items-center gap-3 bg-[#262626]/50">
          <Search className="w-5 h-5 text-[#38bdf8] shrink-0" />
          <input
            type="text"
            placeholder="Search by Patient ID (e.g. MF-2025-8842), Name, Phone, or National ID..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          {term && (
            <button 
              onClick={() => setTerm('')} 
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-neutral-400 hover:text-white"
          >
            <kbd className="text-[10px] font-mono px-1">ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            <span>Found {filtered.length} Patients Indexed by Unified MRN</span>
            <span>Jump Directly to Portal</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-sm">
              No patient records found matching <span className="text-white font-mono">"{term}"</span>.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-[#262626]/70 hover:bg-[#262626] border border-[#2F2F2F] hover:border-[#38bdf8]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.firstName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-neutral-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                        {p.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {p.gender.toUpperCase()}, {new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()}y
                      </span>
                      <span className="flex items-center gap-1 font-mono text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {p.bloodGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {p.phone}
                      </span>
                    </div>

                    {p.allergies.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#f472b6]">
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                        <span>Allergies: {p.allergies.map(a => a.allergen).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Switch Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleSelectPatient(p, 'doctor')}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Open Doctor Chart for this Patient"
                  >
                    <span>Doctor</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleSelectPatient(p, 'receptionist')}
                    className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Open Reception & Triage Desk"
                  >
                    <span>Reception</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleSelectPatient(p, 'patient')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Open Patient Health Passport"
                  >
                    <span>Passport</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#171717] border-t border-[#2F2F2F] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#9E7FFF]" />
            <span>MRN Barcode & QR Code instant lookup supported</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">MEDIFLOW Unified DB</span>
        </div>

      </div>
    </div>
  );
};
