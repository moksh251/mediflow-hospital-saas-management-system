import React, { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  CalendarPlus, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BloodGroup } from '../../types/hospital';

export const ReceptionPortalShell: React.FC = () => {
  const { 
    currentReceptionist, 
    appointments, 
    patients, 
    doctors, 
    checkInAppointment, 
    addNewPatient, 
    createAppointment,
    setCurrentPatient,
    setCurrentRole,
    stats
  } = useHospital();

  const [showQuickIntake, setShowQuickIntake] = useState(false);
  const [fastFirstName, setFastFirstName] = useState('');
  const [fastLastName, setFastLastName] = useState('');
  const [fastPhone, setFastPhone] = useState('');
  const [fastBloodGroup, setFastBloodGroup] = useState<BloodGroup>('O+');
  const [fastDoctorId, setFastDoctorId] = useState(doctors[0].id);

  const handleQuickIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastFirstName || !fastLastName || !fastPhone) return;

    const newPat = addNewPatient({
      firstName: fastFirstName,
      lastName: fastLastName,
      dateOfBirth: '1995-01-01',
      gender: 'other',
      bloodGroup: fastBloodGroup,
      phone: fastPhone,
      email: `${fastFirstName.toLowerCase()}.${fastLastName.toLowerCase()}@patient.mediflow.health`,
      nationalId: `NAT-${Math.floor(1000 + Math.random() * 9000)}`,
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      address: { street: '100 Medical Blvd', city: 'Metro City', state: 'CA', zipCode: '90210' },
      emergencyContact: { name: 'Emergency Kin', relationship: 'Family', phone: fastPhone },
      insurance: {
        provider: 'Direct Cash / Copay Standard',
        policyNumber: 'DIRECT-01',
        groupNumber: 'GRP-01',
        coverageExpiry: '2026-12-31',
        copayAmount: 20,
        status: 'active',
      },
      allergies: [],
      chronicConditions: [],
    });

    createAppointment({
      patientId: newPat.id,
      doctorId: fastDoctorId,
      date: new Date().toISOString().split('T')[0],
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked-in',
      priority: 'routine',
      reasonForVisit: 'Fast Walk-in Triage Consultation',
      department: doctors.find(d => d.id === fastDoctorId)?.department || 'General Medicine',
      triageVitals: {
        temperature: 36.8,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        heartRate: 72,
        respiratoryRate: 16,
        oxygenSaturation: 99,
        height: 172,
        weight: 68,
        bmi: 23.0,
        recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recordedBy: `${currentReceptionist.firstName} ${currentReceptionist.lastName}`,
      }
    });

    setFastFirstName('');
    setFastLastName('');
    setFastPhone('');
    setShowQuickIntake(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Front-Desk Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#262626] via-[#1a2332] to-[#262626] border border-[#2F2F2F] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentReceptionist.avatarUrl}
              alt={currentReceptionist.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#38bdf8]/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {currentReceptionist.firstName} {currentReceptionist.lastName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                  {currentReceptionist.shift}
                </span>
              </div>
              <p className="text-xs text-[#A3A3A3] mt-0.5">
                {currentReceptionist.deskNumber} • Admissions & Live Triage Flow
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-400">
                <span>Staff ID: <strong className="text-white">{currentReceptionist.id}</strong></span>
                <span>•</span>
                <span>Campus: <strong className="text-[#38bdf8]">Metro Central</strong></span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickIntake(!showQuickIntake)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-950/40 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showQuickIntake ? 'Close Intake Form' : '+ New Patient Intake (MRN)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Intake Collapsible Panel */}
      {showQuickIntake && (
        <div className="p-5 rounded-2xl bg-[#262626] border border-sky-500/40 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
            <div className="flex items-center gap-2 text-white text-sm font-bold">
              <UserPlus className="w-4 h-4 text-[#38bdf8]" />
              <span>Instant Patient Registration & Automated MRN Generation</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Auto-indexed into Unified DB</span>
          </div>

          <form onSubmit={handleQuickIntakeSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-400">First Name</label>
              <input
                type="text"
                required
                value={fastFirstName}
                onChange={e => setFastFirstName(e.target.value)}
                placeholder="e.g. Liam"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400">Last Name</label>
              <input
                type="text"
                required
                value={fastLastName}
                onChange={e => setFastLastName(e.target.value)}
                placeholder="e.g. O'Connor"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400">Phone Number</label>
              <input
                type="tel"
                required
                value={fastPhone}
                onChange={e => setFastPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400">Assign Doctor</label>
              <select
                value={fastDoctorId}
                onChange={e => setFastDoctorId(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.lastName} ({d.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-[#2F2F2F]">
              <button
                type="button"
                onClick={() => setShowQuickIntake(false)}
                className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#171717] text-neutral-400 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-black font-semibold text-xs transition-colors"
              >
                Generate MRN & Check In
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Reception Grid: Triage Queue & Patient Fast Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today's Appointments & Check-In Desk (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#2F2F2F]">
              <div>
                <h3 className="text-base font-bold text-white">Daily Triage Check-in Counter</h3>
                <p className="text-xs text-neutral-400">Verify identity, record triage vitals, and assign token numbers</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {appointments.length} Total Visits Today
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {appointments.map((apt) => {
                const pat = patients.find(p => p.id === apt.patientId);
                const doc = doctors.find(d => d.id === apt.doctorId);

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={pat?.avatarUrl}
                        alt={pat?.firstName}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {pat?.firstName} {pat?.lastName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                            {apt.patientId}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#38bdf8]">
                            [{apt.queueNumber}]
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mt-1">
                          <span>Slot: <strong className="text-white">{apt.timeSlot}</strong></span>
                          <span>•</span>
                          <span>Doctor: <strong className="text-neutral-200">Dr. {doc?.lastName}</strong></span>
                          <span>•</span>
                          <span>Dept: <strong className="text-neutral-300">{apt.department}</strong></span>
                        </div>

                        <p className="text-xs text-neutral-400 mt-1.5 italic">
                          "{apt.reasonForVisit}"
                        </p>
                      </div>
                    </div>

                    {/* Check-In Status Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        apt.status === 'checked-in'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : apt.status === 'in-consultation'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {apt.status}
                      </span>

                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => checkInAppointment(apt.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Check In & Triage</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (pat) {
                            setCurrentPatient(pat);
                            setCurrentRole('doctor');
                          }
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        <span>View Chart</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Hospital Floor Snapshot & Quick Registry (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Campus Status Snapshot</span>
            </h3>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
                <span className="text-xs text-neutral-400">Registered MRNs</span>
                <span className="text-sm font-mono font-bold text-white">{stats.totalPatientsRegistered}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
                <span className="text-xs text-neutral-400">Waiting in Lounges</span>
                <span className="text-sm font-mono font-bold text-[#38bdf8]">{stats.currentlyWaitingInQueue}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
                <span className="text-xs text-neutral-400">In Consultation</span>
                <span className="text-sm font-mono font-bold text-[#9E7FFF]">{stats.currentlyInConsultation}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
                <span className="text-xs text-neutral-400">Bed Occupancy Rate</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{stats.bedOccupancyRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#9E7FFF]" />
              <span>Fast Digital Check-in</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Patients presenting mobile QR passports can be checked in directly at self-kiosks.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0">
                <div className="w-full h-full bg-black rounded flex items-center justify-center text-white text-[8px] font-mono">
                  QR
                </div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">Universal Patient Passport</div>
                <div className="text-[11px] text-neutral-400">Linked to MF-2025 Series</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
