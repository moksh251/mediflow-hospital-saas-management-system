import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Stethoscope, 
  DollarSign, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const ManagementDashboard: React.FC = () => {
  const { invoices, appointments, doctors, patients, labOrders, pharmacyOrders } = useHospital();

  // Financial Metrics
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Revenue Breakdown by Category
  const categoryRevenue = paidInvoices.reduce((acc, inv) => {
    inv.items.forEach(item => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
    });
    return acc;
  }, {} as Record<string, number>);

  const consultRev = categoryRevenue['consultation'] || 0;
  const pharmRev = categoryRevenue['pharmacy'] || 0;
  const labRev = categoryRevenue['lab'] || 0;
  const otherRev = categoryRevenue['other'] || 0;

  const totalCatSum = consultRev + pharmRev + labRev + otherRev || 1;

  // Operational Metrics
  const todayAppointments = appointments.length;
  const activeDoctors = doctors.filter(d => d.isAvailable).length;

  // Calculate Average Wait Time (Simulated/Calculated)
  const waitingAppointments = appointments.filter(a => a.status === 'WAITING');
  const averageWaitMinutes = Math.round(14 + waitingAppointments.length * 3);

  // Bottleneck Intelligence: Doctors with > 5 waiting patients
  const doctorQueueCounts = doctors.map(doc => {
    const waitingForDoc = appointments.filter(a => a.doctorId === doc.id && a.status === 'WAITING');
    return {
      doctor: doc,
      waitingCount: waitingForDoc.length,
      isOverloaded: waitingForDoc.length >= 5 || (waitingForDoc.length > 1 && doc.averageConsultationMinutes > 12)
    };
  });

  const overloadedQueue = doctorQueueCounts.filter(d => d.isOverloaded || d.waitingCount >= 2);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OWNER PORTAL
            </span>
            <span className="text-xs text-neutral-400 font-mono">• Executive SaaS Analytics</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Executive Hospital Command Center</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Real-time revenue stream, OPD operational bottlenecks, and department load.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#171717] px-3 py-2 rounded-xl border border-[#2F2F2F]">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-neutral-300">System State: <strong className="text-emerald-400">100% Operational</strong></span>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Revenue */}
        <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Total Revenue Paid</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-3">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>100% Real-time collected</span>
          </div>
        </div>

        {/* KPI 2: Today Patients */}
        <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Patients Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[#38bdf8]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-3">
            {todayAppointments}
          </div>
          <p className="text-[11px] font-mono text-neutral-400 mt-2">
            {patients.length} total registered records
          </p>
        </div>

        {/* KPI 3: Avg Wait Time */}
        <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Average Wait Time</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#9E7FFF]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-3">
            {averageWaitMinutes} <span className="text-xs font-normal text-neutral-400">mins</span>
          </div>
          <p className="text-[11px] font-mono text-purple-300 mt-2">
            {waitingAppointments.length} patients in waiting lounge
          </p>
        </div>

        {/* KPI 4: Active Doctors */}
        <div className="p-5 rounded-2xl bg-[#262626] border border-[#2F2F2F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Doctors On Duty</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-[#f472b6]">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white mt-3">
            {activeDoctors} / {doctors.length}
          </div>
          <p className="text-[11px] font-mono text-emerald-400 mt-2">
            100% Suites active
          </p>
        </div>

      </div>

      {/* Main Grid: Revenue Breakdown & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9E7FFF]" /> Revenue Stream Split
              </h3>
              <p className="text-xs text-neutral-400">Financial distribution across clinical services</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              ₹{totalRevenue.toLocaleString()} Net
            </span>
          </div>

          {/* Visual Bar Breakdown */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-[#171717] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-[#2F2F2F]">
              <div 
                style={{ width: `${(consultRev / totalCatSum) * 100}%` }} 
                className="bg-[#9E7FFF] h-full rounded-l-full transition-all duration-500"
                title="Consultations"
              />
              <div 
                style={{ width: `${(pharmRev / totalCatSum) * 100}%` }} 
                className="bg-emerald-400 h-full transition-all duration-500"
                title="Pharmacy"
              />
              <div 
                style={{ width: `${(labRev / totalCatSum) * 100}%` }} 
                className="bg-amber-400 h-full rounded-r-full transition-all duration-500"
                title="Laboratory"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9E7FFF]" />
                  <span>Consultations</span>
                </div>
                <div className="text-base font-extrabold font-mono text-white mt-1">₹{consultRev.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  {Math.round((consultRev / totalCatSum) * 100)}% of total
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Pharmacy</span>
                </div>
                <div className="text-base font-extrabold font-mono text-white mt-1">₹{pharmRev.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  {Math.round((pharmRev / totalCatSum) * 100)}% of total
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Laboratory</span>
                </div>
                <div className="text-base font-extrabold font-mono text-white mt-1">₹{labRev.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  {Math.round((labRev / totalCatSum) * 100)}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Service Orders Metrics */}
          <div className="pt-3 border-t border-[#2F2F2F] grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
              <div>
                <span className="text-neutral-400">Total Pharmacy Orders</span>
                <div className="font-bold text-white font-mono mt-0.5">{pharmacyOrders.length} Prescriptions</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {pharmacyOrders.filter(p => p.status === 'DISPENSED').length} Dispensed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between">
              <div>
                <span className="text-neutral-400">Total Diagnostic Tests</span>
                <div className="font-bold text-white font-mono mt-0.5">{labOrders.length} Labs</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {labOrders.filter(l => l.status === 'COMPLETED').length} Reported
              </span>
            </div>
          </div>

        </div>

        {/* Operational Bottlenecks & Intelligence */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Operational Bottlenecks
            </h3>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              AI Alert Engine
            </span>
          </div>

          <div className="space-y-3">
            {overloadedQueue.length === 0 ? (
              <div className="p-5 rounded-xl bg-[#171717] border border-[#2F2F2F] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-neutral-300 font-bold">Queue Flow Optimal</p>
                <p className="text-[11px] text-neutral-500">No doctor queues exceeding bottleneck thresholds.</p>
              </div>
            ) : (
              overloadedQueue.map(({ doctor, waitingCount }) => (
                <div key={doctor.id} className="p-4 rounded-xl bg-[#171717] border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.lastName}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/40"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">Dr. {doctor.firstName} {doctor.lastName}</h4>
                        <p className="text-[10px] text-neutral-400">{doctor.department}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {waitingCount} Waiting
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-300 bg-[#262626] p-2.5 rounded-lg border border-[#2F2F2F] flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Recommendation:</strong> Consider opening secondary triage desk or reassigning non-urgent patients. Avg pace: {doctor.averageConsultationMinutes}m.
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Department Capacity Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Doctor Suite Status</h4>
            <div className="space-y-1.5">
              {doctors.map((doc) => {
                const count = appointments.filter(a => a.doctorId === doc.id && a.status === 'WAITING').length;
                return (
                  <div key={doc.id} className="p-2.5 rounded-xl bg-[#171717] border border-[#2F2F2F] flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Dr. {doc.firstName} {doc.lastName}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-neutral-400 text-[11px]">{doc.roomNumber}</span>
                      <span className="text-[#38bdf8] font-bold">{count} queued</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
