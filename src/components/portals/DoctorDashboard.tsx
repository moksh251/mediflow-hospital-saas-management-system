import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  Activity, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FlaskConical, 
  Pill, 
  Sparkles,
  ChevronRight,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Prescription } from '../../types/hospital';

export const DoctorDashboard: React.FC = () => {
  const { 
    activeDoctor, 
    activePatient, 
    getAppointmentsForDoctor, 
    patients,
    setActivePatient,
    callPatient,
    completeConsultation,
    getConsultationsForPatient,
    consultations
  } = useHospital();

  const docAppointments = getAppointmentsForDoctor(activeDoctor.id);
  const activeInConsultApt = docAppointments.find(a => a.status === 'IN_CONSULTATION');
  
  // Highlight Next Patient (WAITING status with oldest token)
  const waitingQueue = docAppointments
    .filter(a => a.status === 'WAITING')
    .sort((a, b) => a.tokenNumber - b.tokenNumber);
  
  const nextPatientApt = waitingQueue[0];

  // Clinical Consultation Form Inputs
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Prescriptions List State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('Once daily');
  const [medDuration, setMedDuration] = useState('7 days');

  // Diagnostic Lab Tests Checklist State
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const commonLabTests = [
    'Complete Blood Count (CBC)',
    '12-Lead Electrocardiogram (ECG)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Profile & Troponin T',
    'HbA1c & Fasting Blood Sugar',
    'Chest X-Ray (PA View)'
  ];

  const handleAddPrescription = () => {
    if (!medName || !medDosage) return;
    const newRx: Prescription = {
      id: `RX-${Date.now()}`,
      medicineName: medName,
      dosage: medDosage,
      frequency: medFreq,
      duration: medDuration,
    };
    setPrescriptions(prev => [...prev, newRx]);
    setMedName('');
    setMedDosage('');
  };

  const handleRemovePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const toggleLabTest = (test: string) => {
    setSelectedLabTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleCompleteConsultation = () => {
    if (!activeInConsultApt) return;

    completeConsultation(
      activeInConsultApt.id,
      symptoms || 'General clinical assessment',
      diagnosis || 'Unspecified non-critical diagnosis',
      clinicalNotes || 'Patient advised rest and follow-up as directed.',
      prescriptions,
      selectedLabTests
    );

    // Reset Form State
    setSymptoms('');
    setDiagnosis('');
    setClinicalNotes('');
    setPrescriptions([]);
    setSelectedLabTests([]);
  };

  const activeConsultHistory = getConsultationsForPatient(activePatient.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Doctor Profile Banner */}
      <div className="p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeDoctor.avatarUrl}
            alt={activeDoctor.lastName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#9E7FFF]/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Dr. {activeDoctor.firstName} {activeDoctor.lastName}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {activeDoctor.roomNumber}
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              {activeDoctor.department} • {activeDoctor.specialty}
            </p>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Doctor ID: <span className="text-[#9E7FFF]">{activeDoctor.id}</span> • License: {activeDoctor.licenseNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#171717] p-3 rounded-xl border border-[#2F2F2F]">
          <div className="text-center px-3">
            <div className="text-[10px] uppercase font-bold text-neutral-400">In Queue</div>
            <div className="text-lg font-bold font-mono text-[#38bdf8]">{waitingQueue.length}</div>
          </div>
          <div className="text-center px-3 border-l border-[#2F2F2F]">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Current Patient</div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              {activeInConsultApt ? activeInConsultApt.patientId : 'Suite Empty'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Queue & Call Next Patient (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Spotlight Next Patient Box */}
          {nextPatientApt && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-sky-950/40 border border-[#9E7FFF]/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9E7FFF] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Next Patient in Line
                </span>
                <span className="text-xs font-mono text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  {nextPatientApt.queueCode}
                </span>
              </div>

              {(() => {
                const nextPat = patients.find(p => p.id === nextPatientApt.patientId);
                return (
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={nextPat?.avatarUrl}
                        alt={nextPat?.firstName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#9E7FFF]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {nextPat?.firstName} {nextPat?.lastName}
                        </h4>
                        <p className="text-xs text-neutral-400 font-mono">ID: {nextPatientApt.patientId}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#A3A3A3] mt-2 italic line-clamp-1">
                      "{nextPatientApt.reasonForVisit}"
                    </p>

                    <button
                      onClick={() => {
                        if (nextPat) setActivePatient(nextPat);
                        callPatient(nextPatientApt.id);
                      }}
                      className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] hover:opacity-90 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Call Patient Into Suite</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Full Doctor Queue List */}
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-sm font-bold text-white">Doctor's Schedule & Queue</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">{docAppointments.length} total</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {docAppointments.map((apt) => {
                const pat = patients.find(p => p.id === apt.patientId);
                const isSelected = activePatient.id === apt.patientId;

                return (
                  <div
                    key={apt.id}
                    onClick={() => {
                      if (pat) setActivePatient(pat);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#171717] border-[#9E7FFF] shadow-md'
                        : 'bg-[#1e1e1e] hover:bg-[#171717] border-[#2F2F2F]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-[#38bdf8]">
                          {apt.queueCode}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {pat?.firstName} {pat?.lastName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        apt.status === 'IN_CONSULTATION'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                          : apt.status === 'WAITING'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : apt.status === 'COMPLETED'
                          ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between font-mono">
                      <span>Token #{apt.tokenNumber}</span>
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Split-Screen Clinical Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Patient Master Card */}
          <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-3">
                <img
                  src={activePatient.avatarUrl}
                  alt={activePatient.firstName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#38bdf8]/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {activePatient.firstName} {activePatient.lastName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                      {activePatient.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    DOB: {activePatient.dateOfBirth} • Blood Group: <strong className="text-red-400 font-mono">{activePatient.bloodGroup}</strong> • {activePatient.gender}
                  </p>
                </div>
              </div>

              {activeInConsultApt && activeInConsultApt.patientId === activePatient.id && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse flex items-center gap-1.5 self-start sm:self-center">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  Active Consult Session
                </span>
              )}
            </div>

            {/* Vitals Bar & Allergies */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="text-[10px] text-neutral-400 font-sans uppercase">Blood Pressure</div>
                <div className="text-white font-bold mt-0.5">{activePatient.vitals?.bloodPressure || '120/80 mmHg'}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="text-[10px] text-neutral-400 font-sans uppercase">Heart Rate</div>
                <div className="text-emerald-400 font-bold mt-0.5">{activePatient.vitals?.heartRate || 72} bpm</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="text-[10px] text-neutral-400 font-sans uppercase">Oxygen SpO2</div>
                <div className="text-sky-400 font-bold mt-0.5">{activePatient.vitals?.spo2 || 98}%</div>
              </div>

              <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30">
                <div className="text-[10px] text-red-400 font-sans font-bold uppercase">Allergies</div>
                <div className="text-red-300 font-bold truncate mt-0.5">
                  {activePatient.allergies.join(', ') || 'None Reported'}
                </div>
              </div>
            </div>

            {/* Clinical Notes Form or History View */}
            {activeInConsultApt && activeInConsultApt.patientId === activePatient.id ? (
              <div className="space-y-4 pt-2 border-t border-[#2F2F2F] animate-in fade-in">
                
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    SOAP Clinical Charting & E-Prescription Workspace
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-mono">Auto-links to Pharmacy, Lab & Billing</span>
                </div>

                {/* Symptoms & Diagnosis inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#A3A3A3]">Presented Symptoms</label>
                    <input
                      type="text"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Substernal tightness, exertion fatigue"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#A3A3A3]">Clinical Diagnosis</label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Mild Angina Pectoris / Ischemia"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                    />
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="text-[11px] text-[#A3A3A3]">Physician Clinical Notes</label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Document clinical observations, advice, and recommended routine..."
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>

                {/* E-Prescriptions Module */}
                <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#38bdf8] flex items-center gap-1.5">
                      <Pill className="w-4 h-4" /> Prescribe Medications (Triggers Pharmacy Order)
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{prescriptions.length} items</span>
                  </div>

                  {/* Add Medication Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="Medicine Name (e.g. Atorvastatin)"
                      className="px-2.5 py-1.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs text-white"
                    />
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      placeholder="Dosage (e.g. 20 mg)"
                      className="px-2.5 py-1.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs text-white"
                    />
                    <input
                      type="text"
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      placeholder="Frequency (e.g. Once daily)"
                      className="px-2.5 py-1.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrescription}
                      className="py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] text-black font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Drug
                    </button>
                  </div>

                  {/* Prescription List */}
                  {prescriptions.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {prescriptions.map((p) => (
                        <div key={p.id} className="p-2 rounded-lg bg-[#262626] border border-[#2F2F2F] flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{p.medicineName} — {p.dosage}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-400 font-mono text-[11px]">{p.frequency} ({p.duration})</span>
                            <button
                              onClick={() => handleRemovePrescription(p.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Diagnostic Lab Tests Checklist */}
                <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4" /> Order Laboratory Investigations
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{selectedLabTests.length} tests selected</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {commonLabTests.map((test) => {
                      const isChecked = selectedLabTests.includes(test);
                      return (
                        <button
                          key={test}
                          type="button"
                          onClick={() => toggleLabTest(test)}
                          className={`p-2 rounded-lg text-xs text-left border transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                              : 'bg-[#262626] text-neutral-400 border-[#2F2F2F] hover:text-white'
                          }`}
                        >
                          <span>{test}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complete Consultation Trigger */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={handleCompleteConsultation}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-emerald-950/40 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Consultation & Sync Workflow</span>
                  </button>
                </div>

              </div>
            ) : (
              /* View Historical Records */
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Past Consultation History
                </h4>

                {activeConsultHistory.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-4 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                    No past consultation records found for this patient. Click "Call Patient" to start a new consultation session.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeConsultHistory.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-2 text-xs">
                        <div className="flex items-center justify-between text-neutral-400 border-b border-[#2F2F2F] pb-2">
                          <span className="font-bold text-white">{c.doctorName}</span>
                          <span className="font-mono">{c.date}</span>
                        </div>
                        <p className="text-[#A3A3A3]">
                          <strong className="text-neutral-200">Diagnosis:</strong> {c.diagnosis}
                        </p>
                        <p className="text-neutral-400 line-clamp-2">
                          <strong className="text-neutral-200">Notes:</strong> {c.clinicalNotes}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
