import type { ReportSubmission } from '../types';
import { LOCATION_OPTIONS } from './constants';

function escapeCell(value: string | number): string {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');
}

function downloadCsv(fileName: string, rows: (string | number)[][]) {
  const blob = new Blob(['\uFEFF' + toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const today = () => new Date().toISOString().split('T')[0];

/** Bảng tổng hợp toàn trường: mỗi lớp một dòng. */
export function exportSummaryExcel(reports: ReportSubmission[]) {
  const header = [
    'STT', 'Lớp', 'GVCN', 'Email GVCN', 'Ngày gửi',
    'Giờ họp', 'Ngày họp', 'Phòng',
    'Sĩ số', 'Nam', 'Nữ', 'Có mặt', 'Có mặt nam', 'Có mặt nữ', 'Vắng',
    'Học lực Tốt', 'Học lực Khá', 'Học lực Đạt',
    'Hạnh kiểm Tốt', 'Hạnh kiểm Khá', 'Hạnh kiểm Đạt',
    'Đoàn viên',
    ...LOCATION_OPTIONS,
    'Ý kiến GVCN',
  ];

  const rows = reports.map((report, index) => [
    index + 1,
    report.className,
    report.gcvnName,
    report.gcvnEmail,
    new Date(report.submittedAt).toLocaleString('vi-VN'),
    report.meetingTime,
    report.meetingDate,
    report.meetingLocation,
    report.totalStudents,
    report.maleStudents,
    report.femaleStudents,
    report.presentStudents,
    report.presentMale,
    report.presentFemale,
    report.absentStudents,
    report.academicStats.excellent,
    report.academicStats.good,
    report.academicStats.satisfactory,
    report.conductStats.excellent,
    report.conductStats.good,
    report.conductStats.satisfactory,
    report.partyMembers,
    ...LOCATION_OPTIONS.map((name) => report.locationStats?.[name] ?? 0),
    report.gcvnOpinion,
  ]);

  const totals: (string | number)[] = ['', 'TỔNG CỘNG', '', '', '', '', '', ''];
  for (let column = 8; column < header.length - 1; column += 1) {
    totals.push(rows.reduce((sum, row) => sum + (typeof row[column] === 'number' ? (row[column] as number) : 0), 0));
  }
  totals.push('');

  downloadCsv(`tong_hop_bao_cao_toan_truong_${today()}.csv`, [header, ...rows, totals]);
}

/** Danh sách ban cán sự các lớp. */
export function exportClassPositionsExcel(reports: ReportSubmission[]) {
  const header = ['Lớp', 'GVCN', 'Chức danh', 'Họ và tên', 'Học lực', 'Hạnh kiểm', 'Số điện thoại'];
  const rows = reports.flatMap((report) =>
    (report.classPositions || [])
      .filter((position) => position.name.trim() !== '')
      .map((position) => [
        report.className,
        report.gcvnName,
        position.title,
        position.name,
        position.grade,
        position.conduct,
        position.phone,
      ]),
  );

  downloadCsv(`ban_can_su_cac_lop_${today()}.csv`, [header, ...rows]);
}

/** Danh sách học sinh vắng toàn trường. */
export function exportAbsentStudentsExcel(reports: ReportSubmission[]) {
  const header = ['Lớp', 'GVCN', 'Họ và tên học sinh', 'Lớp năm trước', 'Địa chỉ', 'ĐT học sinh', 'ĐT phụ huynh', 'Lý do chưa ra lớp'];
  const rows = reports.flatMap((report) =>
    (report.assentStudentList || [])
      .filter((student) => student.name.trim() !== '')
      .map((student) => [
        report.className,
        report.gcvnName,
        student.name,
        student.prevClass,
        student.address,
        student.studentPhone,
        student.parentPhone,
        student.reason,
      ]),
  );

  downloadCsv(`hoc_sinh_vang_dau_nam_${today()}.csv`, [header, ...rows]);
}

/** Thống kê cơ sở vật chất theo lớp. */
export function exportFacilitiesExcel(reports: ReportSubmission[]) {
  const header = ['Lớp', 'GVCN', 'Phòng', 'Tên thiết bị', 'Số lượng', 'Đơn vị tính', 'Tình trạng', 'Ghi chú'];
  const rows = reports.flatMap((report) =>
    (report.facilities || []).map((item) => [
      report.className,
      report.gcvnName,
      report.handoverLocation || report.meetingLocation,
      item.name,
      item.quantity,
      item.unit,
      item.condition,
      item.notes,
    ]),
  );

  downloadCsv(`co_so_vat_chat_cac_lop_${today()}.csv`, [header, ...rows]);
}
