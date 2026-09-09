import React from 'react';
import { Pill, CheckCircle2, Clock, User, Package, AlertCircle } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PharmacyDashboard: React.FC = () => {
  const { pharmacyOrders, patients, doctors, dispensePharmacyOrder } = useHospital();

  const pendingOrders = pharmacyOrders.filter(o => o.status === 'PENDING');
  const dispensedOrders = pharmacyOrders.filter(o => o.status === 'DISPENSED');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" /> Pharmacy Order Fulfillment
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Station 01
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Real-time doctor e-prescriptions dispensing & automatic invoice itemization
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#171717] p-3 rounded-xl border border-[#2F2F2F]">
          <div className="text-center px-3">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Pending Orders</div>
            <div className="text-lg font-bold font-mono text-amber-400">{pendingOrders.length}</div>
          </div>
          <div className="text-center px-3 border-l border-[#2F2F2F]">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Dispensed Today</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{dispensedOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Main Dispensing Queue */}
      <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
          <h3 className="text-base font-bold text-white">E-Prescription Fulfillment Queue</h3>
          <span className="text-xs font-mono text-neutral-400">Linked to Patient Unique ID</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs italic bg-[#171717] rounded-xl border border-[#2F2F2F]">
            No pending pharmacy orders. When a doctor completes a consultation with prescriptions, orders will instantly appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => {
              const pat = patients.find(p => p.id === order.patientId);
              const doc = doctors.find(d => d.id === order.doctorId);

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={pat?.avatarUrl}
                      alt={pat?.firstName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-emerald-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {pat?.firstName} {pat?.lastName}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                          {order.patientId}
                        </span>
                        <span className="text-xs font-mono text-emerald-400">
                          [{order.id}]
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 mt-1">
                        Prescribed by: <strong className="text-white">Dr. {doc?.lastName}</strong> ({doc?.department})
                      </p>

                      {/* Medicines List */}
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-neutral-400">Prescribed Drugs:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.medicines.map((med) => (
                            <div key={med.id} className="p-2 rounded-lg bg-[#262626] border border-[#2F2F2F] text-xs">
                              <div className="font-bold text-emerald-300">{med.medicineName} — {med.dosage}</div>
                              <div className="text-[11px] text-neutral-400 font-mono">{med.frequency} ({med.duration})</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 self-end md:self-center">
                    <span className="text-xs font-mono text-neutral-400">
                      Standard Pharmacy Charge: <strong className="text-white">₹1,250</strong>
                    </span>
                    <button
                      onClick={() => dispensePharmacyOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dispense & Add to Bill</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
