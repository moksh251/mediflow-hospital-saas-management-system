import React from 'react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  Pill, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Receipt, 
  QrCode, 
  AlertCircle,
  Download,
  ChevronRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PatientPortalShell: React.FC = () => {
  const { 
    currentPatient, 
    getAppointmentsForPatient, 
    getPrescriptionsForPatient, 
    getLabOrdersForPatient,
    getInvoicesForPatient,
    getDoctorById
  } = useHospital();

  const patientAppointments = getAppointmentsForPatient(currentPatient.id);
  const patientPrescriptions = getPrescriptionsForPatient(currentPatient.id);
  const patientLabs = getLabOrdersForPatient(currentPatient.id);
  const patientInvoices = getInvoicesForPatient(currentPatient.id);

  const activeAppt = patientAppointments[0];
  const assignedDoc = activeAppt ? getDoctorById(activeAppt.doctorId) : null;

  return (
    <div className="space-y-6">
      
      {/* Digital Health Passport Card (Linked to MRN) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#262626] via-[#1a2e26] to-[#262626] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={currentPatient.avatarUrl}
              alt={currentPatient.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {currentPatient.firstName} {currentPatient.lastName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                  {currentPatient.id}
                </span>
              </div>
              <p className="text-xs text-[#A3A3A3] mt-0.5">
                Digital Health Passport • DOB: {currentPatient.dateOfBirth} ({currentPatient.gender.toUpperCase()})
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-neutral-400">
                <span>Blood: <strong className="text-red-400">{currentPatient.bloodGroup}</strong></span>
                <span>•</span>
                <span>Coverage: <strong className="text-emerald-300">{currentPatient.insurance.provider}</strong></span>
              </div>
            </div>
          </div>

          {/* QR Passport Badge */}
          <div className="flex items-center gap-3 bg-[#171717]/80 p-3 rounded-xl border border-[#2F2F2F]">
            <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 shadow">
              <div className="w-full h-full bg-black rounded flex items-center justify-center text-white text-[9px] font-mono font-bold">
                MEDIFLOW
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Self-Kiosk Fast ID</div>
              <div className="text-xs font-mono font-bold text-white">{currentPatient.id}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified MRN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Visit Queue Card + Medical History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Queue Token & Upcoming Visit (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Live Token Banner */}
          {activeAppt && (
            <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#38bdf8]" />
                  <h3 className="text-sm font-bold text-white">Live Hospital Queue Status</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Today's Visit
                </span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center">
                <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                  Your Department Queue Token
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#38bdf8] my-1">
                  {activeAppt.queueNumber}
                </div>
                <div className="text-xs text-neutral-300">
                  Consulting with <strong className="text-white">Dr. {assignedDoc?.lastName}</strong> ({activeAppt.department})
                </div>

                <div className="mt-3 pt-3 border-t border-[#2F2F2F] flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Appointment Time:</span>
                  <span className="font-mono text-white font-bold">{activeAppt.timeSlot}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Status:</span>
                  <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                    activeAppt.status === 'in-consultation'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {activeAppt.status === 'in-consultation' ? 'Now In Room' : 'Checked In / Waiting'}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-neutral-400 leading-relaxed">
                Please proceed to <strong className="text-white">{assignedDoc?.roomNumber || 'Waiting Area B'}</strong> when your token number is broadcast on the lounge screens.
              </div>
            </div>
          )}

          {/* Active Prescriptions Snapshot */}
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#f472b6]" />
                <h3 className="text-sm font-bold text-white">Active Digital Prescriptions</h3>
              </div>
              <span className="text-xs text-neutral-400">{patientPrescriptions.length} Records</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {patientPrescriptions.length === 0 ? (
                <div className="text-xs text-neutral-400 py-4 text-center">No active prescriptions</div>
              ) : (
                patientPrescriptions.map(rx => (
                  <div key={rx.id} className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rx.diagnosis}</span>
                      <span className="font-mono text-[10px] text-neutral-400">{rx.issueDate}</span>
                    </div>
                    {rx.medications.map(med => (
                      <div key={med.id} className="text-xs bg-[#262626]/60 p-2 rounded-lg text-neutral-200">
                        <div className="font-semibold text-[#9E7FFF]">{med.drugName} ({med.dosage})</div>
                        <div className="text-neutral-400 text-[11px]">{med.frequency} • {med.duration}</div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Diagnostic Orders & Invoicing History (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Lab & Imaging Results */}
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Diagnostic & Lab Findings</h3>
              </div>
              <span className="text-xs text-neutral-400">{patientLabs.length} Ordered</span>
            </div>

            <div className="mt-3 space-y-3">
              {patientLabs.map(lab => (
                <div key={lab.id} className="p-3.5 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lab.testName}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      lab.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}>
                      {lab.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400">
                    Category: <strong className="text-neutral-200">{lab.category}</strong> • Priority: <strong className="text-amber-400 uppercase font-mono">{lab.priority}</strong>
                  </div>

                  {lab.findingsSummary && (
                    <div className="text-xs bg-[#262626] p-2.5 rounded-lg text-emerald-300 font-mono mt-2">
                      Report: {lab.findingsSummary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Copay Transparency */}
          <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-sm font-bold text-white">Billing & Insurance Copay Summary</h3>
              </div>
              <span className="text-xs text-neutral-400">{patientInvoices.length} Statements</span>
            </div>

            <div className="mt-3 space-y-3">
              {patientInvoices.map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-[#171717] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Invoice #{inv.id}</span>
                      <span className="font-mono text-[10px] text-neutral-400">({inv.date})</span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {inv.items.length} items billed • Subtotal: ${inv.subtotal}
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <div className="text-xs text-neutral-400">
                      Patient Copay: <span className="font-bold text-white font-mono">${inv.patientPayable}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
