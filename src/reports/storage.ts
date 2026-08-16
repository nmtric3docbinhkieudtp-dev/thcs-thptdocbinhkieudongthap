import type { ReportSubmission } from '../types';
import {
  createDefaultAbsentStudents,
  createDefaultClassPositions,
  createDefaultFacilities,
  createDefaultLocationStats,
  createDefaultPrizeEntries,
} from './constants';

const REPORTS_STORAGE_KEY = 'dbk-report-submissions';

export function readStoredReports(): ReportSubmission[] {
  try {
    const reportsText = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    return reportsText ? (JSON.parse(reportsText) as ReportSubmission[]) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: ReportSubmission) {
  const reports = readStoredReports();
  const existingIndex = reports.findIndex((r) => r.id === report.id);
  if (existingIndex >= 0) {
    reports[existingIndex] = report;
  } else {
    reports.push(report);
  }
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReport(id: string) {
  const reports = readStoredReports().filter((report) => report.id !== id);
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function exportReportsAsJSON(): void {
  const reports = readStoredReports();
  const dataStr = JSON.stringify(reports, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bao_cao_tap_trung_hs_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function createEmptyReportForm(gcvnEmail: string, gcvnName = ''): Partial<ReportSubmission> {
  return {
    id: '',
    submittedAt: new Date().toISOString(),
    gcvnName,
    gcvnEmail,
    className: '',
    meetingTime: '',
    meetingDate: '',
    meetingLocation: '',
    meetingEndTime: '',
    secretaryName: '',
    classGroupLink: '',
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    presentStudents: 0,
    presentMale: 0,
    presentFemale: 0,
    absentStudents: 0,
    academicStats: { excellent: 0, good: 0, satisfactory: 0 },
    conductStats: { excellent: 0, good: 0, satisfactory: 0 },
    partyMembers: 0,
    locationStats: createDefaultLocationStats(),
    prizeEntries: createDefaultPrizeEntries(),
    classPositions: createDefaultClassPositions(),
    facilities: createDefaultFacilities(),
    assentStudentList: createDefaultAbsentStudents(),
    gcvnOpinion: '',
    handoverTime: '',
    handoverLocation: '',
  };
}

export function buildReportFromForm(form: Partial<ReportSubmission>, gcvnEmail: string, id?: string): ReportSubmission {
  return {
    id: id || `report-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    gcvnName: form.gcvnName || '',
    gcvnEmail,
    className: form.className || '',
    meetingTime: form.meetingTime || '',
    meetingDate: form.meetingDate || '',
    meetingLocation: form.meetingLocation || '',
    meetingEndTime: form.meetingEndTime || '',
    secretaryName: form.secretaryName || '',
    classGroupLink: form.classGroupLink || '',
    totalStudents: form.totalStudents || 0,
    maleStudents: form.maleStudents || 0,
    femaleStudents: form.femaleStudents || 0,
    presentStudents: form.presentStudents || 0,
    presentMale: form.presentMale || 0,
    presentFemale: form.presentFemale || 0,
    absentStudents: form.absentStudents || 0,
    academicStats: form.academicStats || { excellent: 0, good: 0, satisfactory: 0 },
    conductStats: form.conductStats || { excellent: 0, good: 0, satisfactory: 0 },
    partyMembers: form.partyMembers || 0,
    locationStats: form.locationStats || createDefaultLocationStats(),
    prizeEntries: form.prizeEntries || createDefaultPrizeEntries(),
    classPositions: form.classPositions || createDefaultClassPositions(),
    facilities: form.facilities || createDefaultFacilities(),
    assentStudentList: (form.assentStudentList || []).filter((student) => student.name.trim() !== ''),
    gcvnOpinion: form.gcvnOpinion || '',
    handoverTime: form.handoverTime || '',
    handoverLocation: form.handoverLocation || '',
  };
}
