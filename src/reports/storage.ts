import type { ReportSubmission } from '../types';

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

export function createEmptyReportForm(gcvnEmail: string): Partial<ReportSubmission> {
  return {
    id: '',
    submittedAt: new Date().toISOString(),
    gcvnName: '',
    gcvnEmail,
    className: '',
    meetingTime: '',
    meetingDate: '03/9/2026',
    meetingLocation: '',
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
    locationStats: {},
    prizeEntries: [],
    classPositions: [],
    facilities: [],
    assentStudentList: [],
    gcvnOpinion: '',
  };
}
