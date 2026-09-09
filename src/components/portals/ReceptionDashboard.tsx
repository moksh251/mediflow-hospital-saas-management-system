import React, { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Search,
  Receipt,
  DollarSign
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { BloodGroup } from '../../types/hospital';

export const ReceptionDashboard: React.FC = () => {
  const { 
    patients, 
    doctors, 
    appointments, 
    invoices,
    registerNewPatient,
    scheduleAppointment,
    checkInPatient,
    markNoShow,
    payInvoice
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'appointments' | 'billing'>('appointments');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // Registration Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [assignedDoctorId, setAssignedDoctorId] = useState(doctors[0].id);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) return;

    const newPat = registerNewPatient({
      firstName,
      lastName,
      dateOfBirth: '1995-01-01',
      gender: 'Other',
      bloodGroup,
      phone,
      email: `${firstName.toLowerCase()}@example.com`,
      nationalId: `SSN-${Math.floor(1000 + Math.random() * 9000)}`,
      address: 'Metro City, CA',
      emergencyContact: {
        name: 'Family Kin',
        relationship: 'Relative',
        phone,
      },
      insuranceProvider: 'Standard Healthcare',
      insurancePolicyNumber: 'POL-DEFAULT',
      allergies: [],
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    });

    scheduleAppointment({
      patientId: newPat.id,
      doctorId: assignedDoctorId,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '11:00 AM',
      status: 'WAITING',
      priority: 'routine',
      reasonForVisit: 'General Intake & Triage',
      department: doctors.find(d => d.id === assignedDoctorId)?.department || 'General Medicine',
    });

    setFirstName('');
    setLastName('');
    setPhone('');
    setIsRegisterOpen(false);
  };

  const unpaidInvoices = invoices.filter(i => i.status === 'UNPAID');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Reception Header Banner */}
      <div className="p-6 rounded-2xl bg-[#262626] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Reception & Billing Desk</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
              Counter 01
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Patient Intake, Queue Check-in & Integrated Single-Visit Billing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'appointments'
                ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40'
                : 'bg-[#171717] text-neutral-400 border-[#2F2F2F]'
            }`}
          >
            Appointments Intake
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'billing'
                ? 'bg-[#9E7FFF]/20 text-[#9E7FFF] border-[#9E7FFF]/40'
                : 'bg-[#171717] text-neutral-400 border-[#2F2F2F]'
            }`}
          >
            Billing & Invoices ({unpaidInvoices.length})
          </button>

          <button
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
            className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Patient</span>
          </button>
        </div>
      </div>

      {/* New Patient Registration Form (Collapsible) */}
      {isRegisterOpen && (
        <div className="p-5 rounded-2xl bg-[#262626] border border-sky-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#38bdf8]" />
              <span>Register Patient Record (Generates Immutable ID)</span>
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">Mediflow Central Intake</span>
          </div>

          <form onSubmit={handleRegisterPatient} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-[#A3A3A3]">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Samuel"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#A3A3A3]">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Hayes"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#A3A3A3]">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#2F2F2F] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#A3A3A3]">Assign Doctor</label>
              <select
                value={assignedDoctorId}
                onChange={(e) => setAssignedDoctorId(e.target.value)}
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
                onClick={() => setIsRegisterOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#171717] text-[#A3A3A3] text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-black font-semibold text-xs transition-colors"
              >
                Issue ID & Check In
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 1: Appointments Queue Management */}
      {activeTab === 'appointments' && (
        <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
            <div>
              <h3 className="text-base font-bold text-white">Today's Appointment Schedule</h3>
              <p className="text-xs text-[#A3A3A3]">Operational front desk queue control</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
              {appointments.length} Total Visits
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const pat = patients.find(p => p.id === apt.patientId);
              const doc = doctors.find(d => d.id === apt.doctorId);

              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                          {apt.patientId}
                        </span>
                        <span className="text-xs font-mono text-[#38bdf8]">
                          [{apt.queueCode}]
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A3A3A3] mt-1">
                        <span>Time: <strong className="text-white">{apt.timeSlot}</strong></span>
                        <span>•</span>
                        <span>Assigned: <strong className="text-neutral-200">Dr. {doc?.lastName}</strong> ({apt.department})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      apt.status === 'WAITING'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : apt.status === 'IN_CONSULTATION'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : apt.status === 'COMPLETED'
                        ? 'bg-neutral-800 text-neutral-400'
                        : apt.status === 'NO_SHOW'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {apt.status}
                    </span>

                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => checkInPatient(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    )}

                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => markNoShow(apt.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 text-xs hover:bg-red-900/50 transition-colors"
                      >
                        No-Show
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Billing & Invoice Aggregation Hub */}
      {activeTab === 'billing' && (
        <div className="bg-[#262626] border border-[#2F2F2F] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2F2F2F]">
            <div>
              <h3 className="text-base font-bold text-white">Central Single-Visit Invoices</h3>
              <p className="text-xs text-[#A3A3A3]">Aggregates consultation, lab, and pharmacy charges per visit</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {invoices.length} Total Invoices
            </span>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => {
              const pat = patients.find(p => p.id === inv.patientId);

              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2F2F2F]">
                    <div className="flex items-center gap-3">
                      <img
                        src={pat?.avatarUrl}
                        alt={pat?.firstName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#9E7FFF]/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">
                            {pat?.firstName} {pat?.lastName}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#9E7FFF]/20 text-[#9E7FFF] border border-[#9E7FFF]/30">
                            {inv.patientId}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">Invoice: {inv.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-neutral-400">Total Amount</div>
                        <div className="text-base font-extrabold font-mono text-[#38bdf8]">₹{inv.totalAmount.toLocaleString()}</div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {inv.status}
                      </span>

                      {inv.status === 'UNPAID' && (
                        <button
                          onClick={() => payInvoice(inv.id, 'Reception Cash Desk')}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>Collect Payment</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Itemized Line Items */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Itemized Charges Breakdown:</span>
                    {inv.items.map((item) => (
                      <div key={item.id} className="p-2 rounded-lg bg-[#262626] border border-[#2F2F2F] flex items-center justify-between text-neutral-300">
                        <span>{item.description}</span>
                        <span className="font-mono font-semibold text-white">₹{item.amount}</span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
