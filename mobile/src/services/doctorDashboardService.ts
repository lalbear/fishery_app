import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './authService';
import { doctorNetworkService } from './apiService';

const DOCTOR_ALERT_READS_KEY = '@matsyamitra_doctor_alert_reads_v2';

export type DoctorRoleMode = 'LIVE';
export type DoctorAppointmentStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type DoctorDerivedStatus = DoctorAppointmentStatus | 'MISSED';
export type DoctorPriority = 'ROUTINE' | 'HIGH' | 'CRITICAL';
export type DoctorAlertSeverity = 'info' | 'warning' | 'critical';

export interface DoctorVisitReport {
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  completionChecklist: {
    pondInspected: boolean;
    fishObserved: boolean;
    farmerCounseled: boolean;
  };
}

export interface DoctorAppointmentNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface DoctorAppointment {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  doctorId: string;
  doctorName: string;
  pondId?: string;
  pondName: string;
  pondAreaHectares?: number;
  waterSourceType?: string;
  issueDescription: string;
  symptoms: string[];
  suspectedDisease?: string;
  consultationType: 'VISIT' | 'CALL';
  emergencyFlag: boolean;
  priority: DoctorPriority;
  status: DoctorAppointmentStatus;
  bookedAt: string;
  scheduledFor: string;
  dueBy: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  location: {
    stateCode?: string;
    districtCode?: string;
    districtName?: string;
    blockCode?: string;
    blockName?: string;
    panchayatCode?: string;
    panchayatName?: string;
    addressLine: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  waterQualitySnapshot?: {
    temperature?: number;
    dissolvedOxygen?: number;
    ph?: number;
    ammonia?: number;
    timestamp?: string;
  };
  noteHistory: DoctorAppointmentNote[];
  report?: DoctorVisitReport;
}

export interface DoctorAlert {
  id: string;
  appointmentId: string;
  severity: DoctorAlertSeverity;
  category: 'new_booking' | 'reminder' | 'sla_risk' | 'completed';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface DoctorProfile {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  yearsExperience: number;
  languages: string[];
  serviceAreas: string[];
  roleMode: DoctorRoleMode;
}

export interface DoctorDashboardSnapshot {
  doctor: DoctorProfile;
  appointments: DecoratedDoctorAppointment[];
  alerts: DoctorAlert[];
  summary: {
    activeCount: number;
    dueWithin12Hours: number;
    overdueCount: number;
    completedThisWeek: number;
    unreadAlerts: number;
    completionRate: number;
    averageClosureHours: number;
  };
  reports: {
    totalAssigned: number;
    completed: number;
    missed: number;
    inProgress: number;
    acknowledged: number;
    repeatPonds: number;
    completionRate: number;
    averageResponseHours: number;
    averageClosureHours: number;
    topLocations: Array<{ label: string; count: number }>;
  };
}

export interface DecoratedDoctorAppointment extends DoctorAppointment {
  derivedStatus: DoctorDerivedStatus;
  timeRemainingHours: number;
  nextReminderHours: number | null;
  slaProgress: number;
}

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function coercePriority(item: any): DoctorPriority {
  if (item.emergency_flag) return 'CRITICAL';
  if (item.suspected_disease_name || item.latest_dissolved_oxygen != null || item.latest_ammonia != null) {
    return 'HIGH';
  }
  return 'ROUTINE';
}

function mapStatus(status: string): DoctorAppointmentStatus {
  switch (status) {
    case 'APPROVED':
      return 'ACKNOWLEDGED';
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'NEW';
  }
}

function toBackendStatus(status: DoctorAppointmentStatus): 'REQUESTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' {
  switch (status) {
    case 'ACKNOWLEDGED':
      return 'APPROVED';
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'REQUESTED';
  }
}

function buildAddress(item: any) {
  const segments = [
    item.pond_panchayat_name || item.panchayat_name,
    item.pond_block_name || item.block_name,
    item.pond_district_name || item.district_name,
  ].filter(Boolean);

  return segments.length > 0 ? segments.join(', ') : 'Location details pending';
}

function normalizeNotes(notes: any[] | undefined): DoctorAppointmentNote[] {
  if (!Array.isArray(notes)) return [];
  return notes.map((note) => ({
    id: note.id,
    author: note.author,
    text: note.text,
    timestamp: note.timestamp,
  }));
}

function normalizeAppointment(item: any): DoctorAppointment {
  const createdAt = item.created_at || new Date().toISOString();
  const dueBy = new Date(new Date(createdAt).getTime() + FORTY_EIGHT_HOURS_MS).toISOString();
  const images = Array.isArray(item.farmer_images) ? item.farmer_images.filter(Boolean) : [];
  const checklist = item.completion_checklist || {
    pondInspected: false,
    fishObserved: false,
    farmerCounseled: false,
  };

  return {
    id: item.id,
    farmerId: item.farmer_id,
    farmerName: item.farmer_name || 'Farmer',
    farmerPhone: item.farmer_phone,
    doctorId: item.doctor_id,
    doctorName: item.doctor_name,
    pondId: item.pond_id || undefined,
    pondName: item.pond_name || 'Pond pending',
    pondAreaHectares: item.area_hectares ? Number(item.area_hectares) : undefined,
    waterSourceType: item.water_source_type || undefined,
    issueDescription: item.issue_description,
    symptoms: item.suspected_disease_name ? [item.suspected_disease_name] : [],
    suspectedDisease: item.suspected_disease_name || undefined,
    consultationType: item.consultation_type,
    emergencyFlag: Boolean(item.emergency_flag),
    priority: coercePriority(item),
    status: mapStatus(item.status),
    bookedAt: createdAt,
    scheduledFor: item.scheduled_date,
    dueBy,
    acceptedAt: item.accepted_at || undefined,
    startedAt: item.started_at || undefined,
    completedAt: item.completed_at || undefined,
    cancelledAt: item.status === 'CANCELLED' ? item.updated_at : undefined,
    location: {
      districtCode: item.district_code || undefined,
      districtName: item.pond_district_name || item.district_name || undefined,
      blockCode: item.block_code || undefined,
      blockName: item.pond_block_name || item.block_name || undefined,
      panchayatCode: item.panchayat_code || undefined,
      panchayatName: item.pond_panchayat_name || item.panchayat_name || undefined,
      addressLine: buildAddress(item),
    },
    coordinates:
      item.latitude != null && item.longitude != null
        ? { latitude: Number(item.latitude), longitude: Number(item.longitude) }
        : undefined,
    images,
    waterQualitySnapshot:
      item.latest_temperature != null ||
      item.latest_dissolved_oxygen != null ||
      item.latest_ph != null ||
      item.latest_ammonia != null
        ? {
            temperature: item.latest_temperature != null ? Number(item.latest_temperature) : undefined,
            dissolvedOxygen: item.latest_dissolved_oxygen != null ? Number(item.latest_dissolved_oxygen) : undefined,
            ph: item.latest_ph != null ? Number(item.latest_ph) : undefined,
            ammonia: item.latest_ammonia != null ? Number(item.latest_ammonia) : undefined,
            timestamp: item.latest_water_quality_at || undefined,
          }
        : undefined,
    noteHistory: normalizeNotes(item.note_history),
    report:
      item.visit_diagnosis || item.visit_treatment_plan || item.visit_notes
        ? {
            diagnosis: item.visit_diagnosis || '',
            treatmentPlan: item.visit_treatment_plan || '',
            notes: item.visit_notes || '',
            followUpRequired: Boolean(item.follow_up_required),
            followUpDate: item.follow_up_date || undefined,
            completionChecklist: {
              pondInspected: Boolean(checklist.pondInspected),
              fishObserved: Boolean(checklist.fishObserved),
              farmerCounseled: Boolean(checklist.farmerCounseled),
            },
          }
        : undefined,
  };
}

function computeDerivedStatus(appointment: DoctorAppointment, now = Date.now()): DoctorDerivedStatus {
  if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
    return appointment.status;
  }
  if (now > new Date(appointment.dueBy).getTime()) {
    return 'MISSED';
  }
  return appointment.status;
}

function decorateAppointment(appointment: DoctorAppointment, now = Date.now()): DecoratedDoctorAppointment {
  const bookedAtMs = new Date(appointment.bookedAt).getTime();
  const dueMs = new Date(appointment.dueBy).getTime();
  const elapsedMs = Math.max(0, now - bookedAtMs);
  const remainingMs = dueMs - now;
  const derivedStatus = computeDerivedStatus(appointment, now);

  return {
    ...appointment,
    derivedStatus,
    timeRemainingHours: Math.round(remainingMs / (1000 * 60 * 60)),
    nextReminderHours:
      derivedStatus === 'COMPLETED' || derivedStatus === 'CANCELLED' || derivedStatus === 'MISSED'
        ? null
        : Math.max(0, Math.ceil((TWELVE_HOURS_MS - (elapsedMs % TWELVE_HOURS_MS)) / (1000 * 60 * 60))),
    slaProgress: Math.min(100, Math.max(0, Math.round((elapsedMs / FORTY_EIGHT_HOURS_MS) * 100))),
  };
}

async function loadAlertReads(): Promise<Record<string, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(DOCTOR_ALERT_READS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

async function saveAlertReads(reads: Record<string, boolean>) {
  await AsyncStorage.setItem(DOCTOR_ALERT_READS_KEY, JSON.stringify(reads));
}

function buildAlerts(appointments: DecoratedDoctorAppointment[], reads: Record<string, boolean>): DoctorAlert[] {
  const alerts: DoctorAlert[] = [];

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.bookedAt);
    const elapsedMs = Date.now() - appointmentDate.getTime();

    const baseAlertId = `new_${appointment.id}`;
    alerts.push({
      id: baseAlertId,
      appointmentId: appointment.id,
      severity: appointment.priority === 'CRITICAL' ? 'critical' : 'info',
      category: 'new_booking',
      title: `New booking for ${appointment.pondName}`,
      message: `${appointment.farmerName} requested a ${appointment.consultationType.toLowerCase()} visit at ${appointment.location.addressLine}.`,
      createdAt: appointment.bookedAt,
      isRead: Boolean(reads[baseAlertId]),
    });

    if (!['COMPLETED', 'CANCELLED', 'MISSED'].includes(appointment.derivedStatus)) {
      [12, 24, 36, 48].forEach((hourMark) => {
        if (elapsedMs >= hourMark * 60 * 60 * 1000) {
          const reminderId = `reminder_${appointment.id}_${hourMark}`;
          alerts.push({
            id: reminderId,
            appointmentId: appointment.id,
            severity: hourMark >= 36 ? 'critical' : hourMark >= 24 ? 'warning' : 'info',
            category: hourMark >= 36 ? 'sla_risk' : 'reminder',
            title: hourMark >= 36 ? `48-hour visit window at risk` : `${hourMark}-hour reminder`,
            message:
              hourMark >= 36
                ? `${appointment.pondName} still needs a visit. ${appointment.timeRemainingHours} hours remain before the service window is missed.`
                : `Doctor visit still pending for ${appointment.pondName} in ${appointment.location.addressLine}.`,
            createdAt: new Date(new Date(appointment.bookedAt).getTime() + hourMark * 60 * 60 * 1000).toISOString(),
            isRead: Boolean(reads[reminderId]),
          });
        }
      });
    }

    if (appointment.derivedStatus === 'COMPLETED' && appointment.completedAt) {
      const completedId = `completed_${appointment.id}`;
      alerts.push({
        id: completedId,
        appointmentId: appointment.id,
        severity: 'info',
        category: 'completed',
        title: `Appointment completed`,
        message: `${appointment.pondName} was completed and added to the doctor progress report.`,
        createdAt: appointment.completedAt,
        isRead: Boolean(reads[completedId]),
      });
    }
  });

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

async function loadDoctorContext() {
  const currentUser = await authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'DOCTOR') {
    throw new Error('Doctor session not found. Please login as a doctor.');
  }

  const doctorRes = await doctorNetworkService.getDoctorByUser(currentUser.id);
  if (!doctorRes.success || !doctorRes.data) {
    throw new Error(doctorRes.error || 'Doctor profile could not be loaded.');
  }

  return {
    currentUser,
    doctor: doctorRes.data,
  };
}

export async function getDoctorDashboardSnapshot(): Promise<DoctorDashboardSnapshot> {
  const { doctor } = await loadDoctorContext();
  const appointmentRes = await doctorNetworkService.listAppointments({ doctorId: doctor.id });
  const appointmentRows: any[] = Array.isArray(appointmentRes.data) ? appointmentRes.data : [];
  const appointments: DecoratedDoctorAppointment[] = appointmentRows
    .map((row: any) => normalizeAppointment(row))
    .map((item: DoctorAppointment) => decorateAppointment(item));
  const reads = await loadAlertReads();
  const alerts = buildAlerts(appointments, reads);

  const activeAppointments = appointments.filter((item: DecoratedDoctorAppointment) => !['COMPLETED', 'CANCELLED', 'MISSED'].includes(item.derivedStatus));
  const completedAppointments = appointments.filter((item: DecoratedDoctorAppointment) => item.derivedStatus === 'COMPLETED');
  const missedAppointments = appointments.filter((item: DecoratedDoctorAppointment) => item.derivedStatus === 'MISSED');
  const closureHours = completedAppointments
    .filter((item: DecoratedDoctorAppointment) => item.completedAt)
    .map((item: DecoratedDoctorAppointment) => (new Date(item.completedAt!).getTime() - new Date(item.bookedAt).getTime()) / (1000 * 60 * 60));
  const responseHours = appointments
    .filter((item: DecoratedDoctorAppointment) => item.acceptedAt)
    .map((item: DecoratedDoctorAppointment) => (new Date(item.acceptedAt!).getTime() - new Date(item.bookedAt).getTime()) / (1000 * 60 * 60));
  const locationCounts = appointments.reduce((acc: Record<string, number>, item: DecoratedDoctorAppointment) => {
      const key = item.location.panchayatName || item.location.blockName || item.location.addressLine;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  const topLocations: Array<{ label: string; count: number }> = Object.entries(locationCounts)
    .map(([label, count]) => ({ label, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    doctor: {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      specialization: Array.isArray(doctor.specialization) ? doctor.specialization.join(' · ') : doctor.specialization || 'Aquaculture Doctor',
      yearsExperience: 6,
      languages: ['Hindi', 'English'],
      serviceAreas: [
        doctor.panchayat_name,
        doctor.block_name,
        doctor.district_name,
      ].filter(Boolean),
      roleMode: 'LIVE',
    },
    appointments,
    alerts,
    summary: {
      activeCount: activeAppointments.length,
      dueWithin12Hours: activeAppointments.filter((item: DecoratedDoctorAppointment) => item.timeRemainingHours <= 12).length,
      overdueCount: missedAppointments.length,
      completedThisWeek: completedAppointments.filter((item: DecoratedDoctorAppointment) => {
        if (!item.completedAt) return false;
        return Date.now() - new Date(item.completedAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
      }).length,
      unreadAlerts: alerts.filter((item: DoctorAlert) => !item.isRead).length,
      completionRate: appointments.length ? Math.round((completedAppointments.length / appointments.length) * 100) : 0,
      averageClosureHours: average(closureHours),
    },
    reports: {
      totalAssigned: appointments.length,
      completed: completedAppointments.length,
      missed: missedAppointments.length,
      inProgress: appointments.filter((item: DecoratedDoctorAppointment) => item.derivedStatus === 'IN_PROGRESS').length,
      acknowledged: appointments.filter((item: DecoratedDoctorAppointment) => item.derivedStatus === 'ACKNOWLEDGED' || item.derivedStatus === 'NEW').length,
      repeatPonds: new Set(completedAppointments.filter((item: DecoratedDoctorAppointment) => item.pondId).map((item: DecoratedDoctorAppointment) => item.pondId)).size,
      completionRate: appointments.length ? Math.round((completedAppointments.length / appointments.length) * 100) : 0,
      averageResponseHours: average(responseHours),
      averageClosureHours: average(closureHours),
      topLocations,
    },
  };
}

export async function getDoctorAppointmentById(appointmentId: string): Promise<DecoratedDoctorAppointment | null> {
  await loadDoctorContext();
  const result = await doctorNetworkService.getAppointmentById(appointmentId);
  if (!result.success || !result.data) return null;
  return decorateAppointment(normalizeAppointment(result.data));
}

export async function updateDoctorAppointmentStatus(
  appointmentId: string,
  status: DoctorAppointmentStatus,
  report?: DoctorVisitReport
) {
  return doctorNetworkService.updateAppointmentStatus(appointmentId, {
    status: toBackendStatus(status),
    report:
      report
        ? {
            diagnosis: report.diagnosis,
            treatmentPlan: report.treatmentPlan,
            notes: report.notes,
            followUpRequired: report.followUpRequired,
            followUpDate: report.followUpDate,
            completionChecklist: report.completionChecklist,
          }
        : undefined,
  });
}

export async function addDoctorNote(appointmentId: string, text: string) {
  const currentUser = await authService.getCurrentUser();
  const authorName = currentUser?.name || 'Doctor';
  return doctorNetworkService.addAppointmentNote(appointmentId, {
    authorName,
    text: text.trim(),
  });
}

export async function markDoctorAlertRead(alertId: string) {
  const reads = await loadAlertReads();
  reads[alertId] = true;
  await saveAlertReads(reads);
}

export async function markAllDoctorAlertsRead() {
  const snapshot = await getDoctorDashboardSnapshot();
  const reads = await loadAlertReads();
  snapshot.alerts.forEach((alert) => {
    reads[alert.id] = true;
  });
  await saveAlertReads(reads);
}
