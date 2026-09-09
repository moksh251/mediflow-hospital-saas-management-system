import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, Clock, Upload, FileText } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const LabDashboard: React.FC = () => {
  const { labOrders, patients, doctors, completeLabOrder } = useHospital();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [resultInput, setResultInput] = useState('');

  const pendingOrders = labOrders.filter(l => l.status === 'PENDING');
  const completedOrders = labOrders.filter(l => l.status === 'COMPLETED');

  const handleCompleteTest = (orderId: string) => {
    const details = resultInput || 'Normal physiological parameters. Biomarkers within standard diagnostic reference intervals.';
    completeLabOrder(orderId, details);
    setSelectedOrderId(null);
    setResultInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-400" /> Laboratory Diagnostics & Reports
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Lab Suite 02
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Perform clinical testing, release digital diagnostic reports, and post lab charges
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#171717] p-3 rounded-xl border border-[#2F2F2F]">
          <div className="text-center px-3">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Pending Tests</div>
            <div className="text-lg font-bold font-mono text-amber-400">{pendingOrders.length}</div>
          </div>
          <div className="text-center px-3 border-l border-[#2F2F2F]">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Completed Today</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{completedOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Main Lab Investigation Board */}
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
          <h3 className="text-base font-bold text-white">Pending Diagnostic Investigations</h3>
          <span className="text-xs font-mono text-neutral-400">Linked to Doctor Orders</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs italic bg-[#171717] rounded-xl border border-[#2F2F2F]">
            No pending laboratory test requests.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => {
              const pat = patients.find(p => p.id === order.patientId);
              const doc = doctors.find(d => d.id === order.doctorId);

              const isEditing = selectedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={pat?.avatarUrl}
                        alt={pat?.firstName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">
                            {order.testName}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {order.id}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Patient: <strong className="text-white">{pat?.firstName} {pat?.lastName}</strong> ({order.patientId}) • Ordered by: Dr. {doc?.lastName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrderId(isEditing ? null : order.id)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Cancel Input' : 'Enter Results & Complete'}</span>
                    </button>
                  </div>

                  {/* Result Detail Form (Collapsible) */}
                  {isEditing && (
                    <div className="p-3.5 rounded-xl bg-[#262626] border border-amber-500/30 space-y-3 animate-in fade-in">
                      <label className="text-[11px] text-amber-200 font-bold uppercase">
                        Diagnostic Result Findings & Biomarkers Summary
                      </label>
                      <textarea
                        rows={2}
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        placeholder="e.g. Normal Sinus Rhythm, No ST Changes. Troponin T < 0.01 ng/mL."
                        className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>Standard Lab Fee appended to bill: <strong className="text-white">₹800</strong></span>
                        <button
                          onClick={() => handleCompleteTest(order.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
                        >
                          Release Digital Report & Bill
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
