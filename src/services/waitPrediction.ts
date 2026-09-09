import { Appointment, Doctor } from '../types/hospital';

export interface QueuePredictionResult {
  patientsAhead: number;
  estimatedWaitMinutes: number;
  estimatedCallTimeFormatted: string;
  isCurrentlyInConsultation: boolean;
  disclaimer: string;
}

export const OPERATIONAL_DISCLAIMER = 
  "Wait times are mathematical estimations based on current queue length and historical consultation averages. Emergency cases and unexpected procedures may impact sequence.";

export function calculateWaitPrediction(
  appointment: Appointment,
  allAppointments: Appointment[],
  doctor?: Doctor
): QueuePredictionResult {
  const avgMinutesPerPatient = doctor?.averageConsultationMinutes || 12;

  if (appointment.status === 'IN_CONSULTATION') {
    return {
      patientsAhead: 0,
      estimatedWaitMinutes: 0,
      estimatedCallTimeFormatted: 'Now In Consultation Suite',
      isCurrentlyInConsultation: true,
      disclaimer: OPERATIONAL_DISCLAIMER,
    };
  }

  if (appointment.status === 'COMPLETED') {
    return {
      patientsAhead: 0,
      estimatedWaitMinutes: 0,
      estimatedCallTimeFormatted: 'Consultation Completed',
      isCurrentlyInConsultation: false,
      disclaimer: OPERATIONAL_DISCLAIMER,
    };
  }

  // Filter active waiting appointments for the same doctor scheduled today
  const doctorActiveQueue = allAppointments.filter(
    (apt) =>
      apt.doctorId === appointment.doctorId &&
      apt.date === appointment.date &&
      (apt.status === 'WAITING' || apt.status === 'IN_CONSULTATION')
  );

  // Find position ahead of this patient
  const inConsultationCount = doctorActiveQueue.filter(
    (a) => a.status === 'IN_CONSULTATION'
  ).length;

  const waitingAhead = doctorActiveQueue.filter(
    (a) => a.status === 'WAITING' && a.tokenNumber < appointment.tokenNumber
  ).length;

  const totalPatientsAhead = waitingAhead + inConsultationCount;
  const estimatedWaitMinutes = totalPatientsAhead * avgMinutesPerPatient;

  // Calculate estimated timestamp
  const now = new Date();
  const estimatedTime = new Date(now.getTime() + estimatedWaitMinutes * 60000);
  const formattedTime = estimatedTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    patientsAhead: totalPatientsAhead,
    estimatedWaitMinutes,
    estimatedCallTimeFormatted: `~${formattedTime} (${estimatedWaitMinutes} mins)`,
    isCurrentlyInConsultation: false,
    disclaimer: OPERATIONAL_DISCLAIMER,
  };
}
