import React from 'react';
import { 
  Stethoscope, 
  ClipboardCheck, 
  FileText, 
  Activity, 
  Clock, 
  AlertCircle, 
  Pill, 
  Heart, 
  Flame, 
  ChevronRight, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const DoctorPortalShell: React.FC = () => {
  const { 
    currentDoctor, 
    currentPatient, 
    setCurrentPatient, 
    getTodayQueueForDoctor,
    getAppointmentsForDoctor,
    getPrescriptionsForPatient,
    getLabOrdersForPatient,
    startConsultation,
    completeConsultation,
    checkInAppointment,
    patients
  } = useHospital();

  const docQueue = getTodayQueueForDoctor(currentDoctor.id);
  const activeConsultation = docQueue.find(a => a.status === 'in-consultation');
  const patientPrescriptions = getPrescriptionsForPatient(currentPatient.id);
  const patientLabs = getLabOrdersForPatient(currentPatient.id);

  return (
    <div className="space-y-6">
      
      {/* Top Clinical Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#262626] via-[#1e1b2e] to-[#262626] border border-[#2F2F2F] relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentDoctor.avatarUrl}
              alt={currentDoctor.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#9E7FFF]/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Dr. {currentDoctor.firstName} {currentDoctor.lastName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  On Duty • Room 302
                </span>
              </div>
              <p className="text-xs text-[#A3A3A3] mt-0.5">
                {currentDoctor.department} • {currentDoctor.specialty}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-400">
                <span>License: <strong className="text-white">{currentDoctor.licenseNumber}</strong></span>
                <span>•</span>
                <span>Doctor ID: <strong className="text-[#9E7FFF]">{currentDoctor.id}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Doctor Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-[#171717]/80 p-3 rounded-xl border border-[#2F2F2F] text-center">
            <div className="px-3">
              <div className="text-[10px] uppercase font-bold text-neutral-400">In Queue</div>
              <div className="text-lg font-bold font-mono text-[#38bdf8]">{docQueue.length}</div>
            </div>
            <div className="px-3 border-x border-[#2F2F2F]">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Consulting</div>
              <div className="text-lg font-bold font-mono text-[#9E7FFF]">
                {activeConsultation ? '1 Active' : '0'}
              </div>
            </div>
            <div className="px-3">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Satisfaction</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{currentDoctor.rating} ★</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Queue + Active Patient Clinical Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-sm font-bold text-white">Live Consultation Queue</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {docQueue.length} Patients
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {docQueue.map((apt) => {
                const pat = patients.find(p => p.id === apt.patientId);
                const isCurrentActive = activeConsultation?.id === apt.id;
                const isSelected = currentPatient.id === apt.patientId;

                return (
                  <div
                    key={apt.id}
                    onClick={() => {
                      if (pat) setCurrentPatient(pat);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#171717] border-[#9E7FFF] shadow-md'
                        : 'bg-[#1e1e1e] hover:bg-[#171717] border-[#2F2F2F]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">
                          {apt.queueNumber}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {pat?.firstName} {pat?.lastName}
                        </span>
                      </div>
                      
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        apt.status === 'in-consultation'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                          : apt.status === 'checked-in'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-neutral-700/40 text-neutral-400'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-2 line-clamp-1">
                      {apt.reasonForVisit}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#2F2F2F] flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-mono">MRN: {apt.patientId}</span>
                      
                      {apt.status === 'checked-in' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startConsultation(apt.id);
                            if (pat) setCurrentPatient(pat);
                          }}
                          className="px-2 py-0.5 rounded bg-[#9E7FFF] hover:bg-[#8d6aef] text-white font-medium text-[10px] transition-colors"
                        >
                          Call In
                        </button>
                      )}

                      {apt.status === 'in-consultation' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeConsultation(apt.id);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] transition-colors"
                        >
                          Complete Visit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Patient EMR Chart for Selected Patient (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Patient MRN Master Profile Card */}
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-3.5">
                <img
                  src={currentPatient.avatarUrl}
                  alt={currentPatient.firstName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#38bdf8]/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {currentPatient.firstName} {currentPatient.lastName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                      {currentPatient.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span>DOB: <strong className="text-neutral-200">{currentPatient.dateOfBirth}</strong></span>
                    <span>•</span>
                    <span>Blood: <strong className="text-red-400 font-mono">{currentPatient.bloodGroup}</strong></span>
                    <span>•</span>
                    <span>Insurance: <strong className="text-[#38bdf8]">{currentPatient.insurance.provider}</strong></span>
                  </div>
                </div>
              </div>

              {/* Triage Status Tag */}
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-neutral-400">Current Scope</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Clinical Chart
                </div>
              </div>
            </div>

            {/* Vital Signs Grid (Linked to MRN) */}
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono mb-2.5">
                Recorded Triage Vitals (Cross-Portal Sync)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                  <div className="text-[10px] text-neutral-400">Blood Pressure</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    142/92 <span className="text-[10px] text-neutral-400">mmHg</span>
                  </div>
                  <span className="text-[9px] text-amber-400 font-medium">Stage 1 High</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                  <div className="text-[10px] text-neutral-400">Heart Rate</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    98 <span className="text-[10px] text-neutral-400">bpm</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-medium">Normal Sinus</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                  <div className="text-[10px] text-neutral-400">SpO2 Oxygen</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                    98% <span className="text-[10px] text-neutral-400">Room Air</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-medium">Optimal</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                  <div className="text-[10px] text-neutral-400">Temp / BMI</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    36.8°C <span className="text-[10px] text-neutral-400">/ 23.4</span>
                  </div>
                  <span className="text-[9px] text-neutral-400">Afebrile</span>
                </div>
              </div>
            </div>

            {/* Critical Clinical Alerts: Allergies & Chronic Conditions */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Allergies & Adverse Reactions</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {currentPatient.allergies.length === 0 ? (
                    <span className="text-xs text-neutral-400">No known drug allergies (NKDA)</span>
                  ) : (
                    currentPatient.allergies.map(a => (
                      <div key={a.id} className="text-xs text-neutral-200">
                        • <strong className="text-red-300">{a.allergen}</strong>: {a.reaction} ({a.severity})
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Chronic Conditions</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {currentPatient.chronicConditions.length === 0 ? (
                    <span className="text-xs text-neutral-400">No chronic medical history</span>
                  ) : (
                    currentPatient.chronicConditions.map(c => (
                      <div key={c.id} className="text-xs text-neutral-200">
                        • <strong>{c.condition}</strong> (Status: {c.status})
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Clinical SOAP Charting Draft Preview */}
            <div className="mt-4 p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9E7FFF]" />
                  <span>Doctor Consultation Charting (SOAP Format)</span>
                </h4>
                <span className="text-[10px] text-neutral-500">Auto-saves to Patient ID</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-neutral-400">Subjective (Chief Complaint): </span>
                  <span className="text-neutral-200">Substernal tightness and palpitations after climbing stairs.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-400">Objective (Vitals & Labs): </span>
                  <span className="text-neutral-200">BP 142/92, Normal sinus rhythm. STAT ECG ordered.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-400">Assessment: </span>
                  <span className="text-neutral-200">Suspected exertional angina vs Stage 1 Hypertension.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-400">Plan & Rx: </span>
                  <span className="text-neutral-200">Prescribe Amlodipine 5mg + sublingual Nitroglycerin PRN.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
