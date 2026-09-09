import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { DoctorDashboard } from './components/portals/DoctorDashboard';
import { ReceptionDashboard } from './components/portals/ReceptionDashboard';
import { PharmacyDashboard } from './components/portals/PharmacyDashboard';
import { LabDashboard } from './components/portals/LabDashboard';
import { PatientDashboard } from './components/portals/PatientDashboard';
import { ManagementDashboard } from './components/portals/ManagementDashboard';

const MainAppContent: React.FC = () => {
  const { currentRole } = useHospital();

  return (
    <div className="min-h-screen bg-[#171717] text-white flex flex-col font-sans selection:bg-[#9E7FFF]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {currentRole === 'doctor' && <DoctorDashboard />}
        {currentRole === 'receptionist' && <ReceptionDashboard />}
        {currentRole === 'pharmacy' && <PharmacyDashboard />}
        {currentRole === 'lab' && <LabDashboard />}
        {currentRole === 'patient' && <PatientDashboard />}
        {currentRole === 'management' && <ManagementDashboard />}
      </main>

      <ToastContainer />

      <footer className="border-t border-[#2F2F2F] bg-[#171717] py-4 text-center text-xs font-mono text-neutral-500">
        MEDIFLOW SaaS Enterprise Platform — Connected Healthcare Architecture © 2025
      </footer>
    </div>
  );
};

export function App() {
  return (
    <HospitalProvider>
      <MainAppContent />
    </HospitalProvider>
  );
}

export default App;
