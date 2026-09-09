import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Pill, 
  FlaskConical, 
  CreditCard,
  QrCode,
  ShieldCheck,
  Printer,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { calculateWaitPrediction } from '../../services/waitPrediction';
import { Invoice, ConsultationRecord } from '../../types/hospital';

export const PatientDashboard: React.FC = () => {
  const { 
    activePatient, 
    appointments, 
    doctors, 
    getConsultationsForPatient,
    getLabOrdersForPatient,
    getInvoicesForPatient,
    payInvoice
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'ticket' | 'records' | 'labs' | 'bills'>('ticket');

  // Print Modals State
  const [selectedInvoiceToPrint, setSelectedInvoiceToPrint] = useState<Invoice | null>(null);
  const [selectedConsultationToPrint, setSelectedConsultationToPrint] = useState<ConsultationRecord | null>(null);

  const myAppointments = appointments.filter(a => a.patientId === activePatient.id);
  const activeAppointment = myAppointments[0]; // Primary active visit ticket

  const activeDoctor = activeAppointment ? doctors.find(d => d.id === activeAppointment.doctorId) : undefined;

  const waitPrediction = activeAppointment 
    ? calculateWaitPrediction(activeAppointment, appointments, activeDoctor)
    : null;

  const myConsultations = getConsultationsForPatient(activePatient.id);
  const myLabOrders = getLabOrdersForPatient(activePatient.id);
  const myInvoices = getInvoicesForPatient(activePatient.id);

  // Trigger Print Browser Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Patient Profile Header */}
      <div className="p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activePatient.avatarUrl}
            alt={activePatient.firstName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#f472b6]/50 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {activePatient.firstName} {activePatient.lastName}
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                {activePatient.id}
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Blood: <strong className="text-red-400 font-mono">{activePatient.bloodGroup}</strong> • Insurance: {activePatient.insuranceProvider}
            </p>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Policy: {activePatient.insurancePolicyNumber} • Emergency Contact: {activePatient.emergencyContact.phone}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#171717] p-1.5 rounded-xl border border-[#2F2F2F]">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ticket'
                ? 'bg-pink-500/20 text-[#f472b6] border border-pink-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Queue Ticket
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'records'
                ? 'bg-purple-500/20 text-[#9E7FFF] border border-purple-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'labs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Lab Reports ({myLabOrders.filter(l => l.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bills'
                ? 'bg-sky-500/20 text-[#38bdf8] border border-sky-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Bills ({myInvoices.filter(i => i.status === 'UNPAID').length})
          </button>
        </div>
      </div>

      {/* Tab 1: Live Digital Ticket & Queue Tracker */}
      {activeTab === 'ticket' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-4">
            {activeAppointment ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#262626] to-[#1e1e1e] border border-[#f472b6]/30 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#2F2F2F]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-[#f472b6]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Live OPD Digital Queue Ticket</h3>
                      <p className="text-xs text-neutral-400">Scan or present at Consultation Suite</p>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                    activeAppointment.status === 'IN_CONSULTATION'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                      : activeAppointment.status === 'WAITING'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {activeAppointment.status}
                  </span>
                </div>

                {/* Queue Math Numbers Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Your Token</div>
                    <div className="text-2xl font-black font-mono text-[#f472b6] mt-1">{activeAppointment.queueCode}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Patients Ahead</div>
                    <div className="text-2xl font-black font-mono text-[#38bdf8] mt-1">
                      {waitPrediction ? waitPrediction.patientsAhead : 0}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Est. Call Time</div>
                    <div className="text-xs font-bold font-mono text-emerald-400 mt-2">
                      {waitPrediction ? waitPrediction.estimatedCallTimeFormatted : 'Calculating...'}
                    </div>
                  </div>
                </div>

                {/* Assigned Doctor Details */}
                {activeDoctor && (
                  <div className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center gap-4">
                    <img
                      src={activeDoctor.avatarUrl}
                      alt={activeDoctor.lastName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-purple-500/40 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Dr. {activeDoctor.firstName} {activeDoctor.lastName}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {activeDoctor.department} • {activeDoctor.roomNumber}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        Avg Consultation Pace: {activeDoctor.averageConsultationMinutes} mins/patient
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-neutral-400 italic bg-[#171717] p-3 rounded-xl border border-[#2F2F2F]">
                  "{waitPrediction?.disclaimer}"
                </p>

              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 text-xs bg-[#262626] rounded-2xl border border-[#2F2F2F]">
                No active OPD appointments for today.
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F] space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Patient Passport Details
              </h4>
              <div className="space-y-2 text-xs text-[#A3A3A3]">
                <p><strong className="text-white">National ID / SSN:</strong> {activePatient.nationalId}</p>
                <p><strong className="text-white">Address:</strong> {activePatient.address}</p>
                <p><strong className="text-white">Registered Since:</strong> {activePatient.registeredDate}</p>
                <p><strong className="text-white">Emergency Kin:</strong> {activePatient.emergencyContact.name} ({activePatient.emergencyContact.relationship})</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Medical History & E-Prescriptions */}
      {activeTab === 'records' && (
        <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Consultation & E-Prescriptions History</h3>
          
          {myConsultations.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-6 rounded-xl bg-[#171717] border border-[#2F2F2F]">
              No consultation records available yet. Complete a doctor consultation to see history here.
            </p>
          ) : (
            <div className="space-y-4">
              {myConsultations.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2F2F2F]">
                    <div>
                      <h4 className="font-bold text-sm text-white">{c.doctorName}</h4>
                      <p className="text-xs text-neutral-400">{c.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#9E7FFF] font-bold">{c.id}</span>
                      <button
                        onClick={() => setSelectedConsultationToPrint(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-purple-500/20 text-[#9E7FFF] border border-[#2F2F2F] hover:border-purple-500/30 text-xs font-bold transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Prescription</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-[#A3A3A3]">
                    <p><strong className="text-white">Symptoms:</strong> {c.symptoms}</p>
                    <p><strong className="text-white">Diagnosis:</strong> {c.diagnosis}</p>
                    <p><strong className="text-white">Clinical Notes:</strong> {c.clinicalNotes}</p>
                  </div>

                  {c.prescriptions.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold uppercase text-emerald-400">Prescribed Rx:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                        {c.prescriptions.map((rx) => (
                          <div key={rx.id} className="p-2.5 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs">
                            <span className="font-bold text-white">{rx.medicineName} ({rx.dosage})</span>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{rx.frequency} — {rx.duration}</div>
                            {rx.instructions && (
                              <div className="text-[10px] text-neutral-500 italic mt-0.5">{rx.instructions}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Lab Investigation Reports */}
      {activeTab === 'labs' && (
        <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Digital Diagnostic Reports</h3>
          
          {myLabOrders.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-6 rounded-xl bg-[#171717] border border-[#2F2F2F]">
              No lab test reports ordered.
            </p>
          ) : (
            <div className="space-y-3">
              {myLabOrders.map((lab) => (
                <div key={lab.id} className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-white">{lab.testName}</h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      lab.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {lab.status}
                    </span>
                  </div>

                  {lab.status === 'COMPLETED' ? (
                    <div className="p-3 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs text-emerald-300 font-mono">
                      <strong className="text-white font-sans">Diagnostic Result:</strong> {lab.resultDetails}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">Sample received in laboratory. Processing test biomarkers...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Invoices & Online Payments */}
      {activeTab === 'bills' && (
        <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Invoices & Financial Statements</h3>

          {myInvoices.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-6 rounded-xl bg-[#171717] border border-[#2F2F2F]">
              No pending invoices.
            </p>
          ) : (
            <div className="space-y-4">
              {myInvoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
                    <div>
                      <span className="text-xs font-mono text-neutral-400">Invoice Reference: {inv.id}</span>
                      <div className="text-base font-extrabold text-[#38bdf8] font-mono mt-0.5">₹{inv.totalAmount.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {inv.status}
                      </span>

                      <button
                        onClick={() => setSelectedInvoiceToPrint(inv)}
                        className="px-3 py-1.5 rounded-xl bg-[#262626] hover:bg-[#2F2F2F] text-neutral-300 hover:text-white border border-[#2F2F2F] text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      {inv.status === 'UNPAID' && (
                        <button
                          onClick={() => payInvoice(inv.id, 'Patient Online Portal')}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Online</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Itemized list */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400">Line Items:</span>
                    {inv.items.map((item) => (
                      <div key={item.id} className="p-2 rounded-lg bg-[#262626] border border-[#2F2F2F] flex items-center justify-between text-neutral-300">
                        <span>{item.description}</span>
                        <span className="font-mono font-bold text-white">₹{item.amount}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRINT RECEIPT MODAL */}
      {selectedInvoiceToPrint && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">MEDIFLOW HEALTHCARE</h2>
                <p className="text-xs text-neutral-500 font-mono">Official Payment & Services Receipt</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceToPrint(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-xl font-mono text-neutral-700">
                <div><strong>Receipt ID:</strong> {selectedInvoiceToPrint.id}</div>
                <div><strong>Date:</strong> {selectedInvoiceToPrint.paidAt ? selectedInvoiceToPrint.paidAt.split('T')[0] : selectedInvoiceToPrint.createdAt.split('T')[0]}</div>
                <div><strong>Patient:</strong> {activePatient.firstName} {activePatient.lastName}</div>
                <div><strong>MRN ID:</strong> {activePatient.id}</div>
                <div><strong>Status:</strong> <span className="uppercase font-bold text-emerald-600">{selectedInvoiceToPrint.status}</span></div>
                <div><strong>Payment:</strong> {selectedInvoiceToPrint.paymentMethod || 'Credit / Online'}</div>
              </div>

              <div className="border-t border-b border-neutral-200 py-3 space-y-2">
                <span className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider">Itemized Breakdown</span>
                {selectedInvoiceToPrint.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-neutral-800">
                    <span>{item.description}</span>
                    <span className="font-mono font-bold">₹{item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-black pt-2 text-slate-900">
                <span>TOTAL AMOUNT:</span>
                <span className="text-base font-mono">₹{selectedInvoiceToPrint.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInvoiceToPrint(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRINT PRESCRIPTION MODAL */}
      {selectedConsultationToPrint && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-black text-purple-950 tracking-tight">MEDIFLOW CLINICAL E-PRESCRIPTION</h2>
                <p className="text-xs text-neutral-500 font-mono">Authorized Medical Order Sheet</p>
              </div>
              <button
                onClick={() => setSelectedConsultationToPrint(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-800">
              <div className="grid grid-cols-2 gap-2 p-3 bg-purple-50 rounded-xl text-neutral-700">
                <div><strong>Doctor:</strong> {selectedConsultationToPrint.doctorName}</div>
                <div><strong>Date:</strong> {selectedConsultationToPrint.date}</div>
                <div><strong>Patient:</strong> {activePatient.firstName} {activePatient.lastName} ({activePatient.gender}, {activePatient.bloodGroup})</div>
                <div><strong>MRN:</strong> {activePatient.id}</div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                <p><strong>Clinical Diagnosis:</strong> {selectedConsultationToPrint.diagnosis}</p>
                <p><strong>Clinical Notes:</strong> {selectedConsultationToPrint.clinicalNotes}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-purple-950 mb-2">Rx Prescribed Medications:</h4>
                <div className="space-y-2 border-t border-b border-neutral-200 py-3">
                  {selectedConsultationToPrint.prescriptions.map((rx) => (
                    <div key={rx.id} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-0.5">
                      <div className="font-bold text-slate-900">{rx.medicineName} — {rx.dosage}</div>
                      <div className="text-neutral-600 font-mono text-[11px]">{rx.frequency} | {rx.duration}</div>
                      {rx.instructions && <div className="text-neutral-500 italic text-[10px]">{rx.instructions}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400">Digitally Verified by Mediflow Health EHR</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedConsultationToPrint(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-800 flex items-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Prescription</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
