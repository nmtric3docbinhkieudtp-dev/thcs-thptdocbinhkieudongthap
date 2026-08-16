import { useState } from 'react';
import type { ReportSubmission } from '../../types';
import { ReportDetail } from './ReportDetail';
import {
  exportAbsentStudentsExcel,
  exportClassPositionsExcel,
  exportFacilitiesExcel,
  exportSummaryExcel,
} from '../../reports/exportExcel';

interface ReportAdminProps {
  allReports: ReportSubmission[];
  onExport: () => void;
}

export function ReportAdmin({ allReports, onExport }: ReportAdminProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const selectedReport = allReports.find((report) => report.id === selectedId);
  if (selectedReport) {
    return <ReportDetail report={selectedReport} onBack={() => setSelectedId(null)} />;
  }

  const search = keyword.trim().toLowerCase();
  const reports = search
    ? allReports.filter((report) => `${report.className} ${report.gcvnName} ${report.gcvnEmail}`.toLowerCase().includes(search))
    : allReports;

  const totals = reports.reduce(
    (acc, report) => ({
      students: acc.students + report.totalStudents,
      present: acc.present + report.presentStudents,
      absent: acc.absent + report.absentStudents,
    }),
    { students: 0, present: 0, absent: 0 },
  );

  return (
    <div className="admin-reports-view">
      <div className="admin-header">
        <h3>Tổng hợp báo cáo ({allReports.length} lớp)</h3>
        <div className="module-actions">
          <button type="button" className="primary-btn small" onClick={() => exportSummaryExcel(allReports)}>
            Xuất tổng hợp (Excel)
          </button>
          <button type="button" className="secondary-btn" onClick={() => exportClassPositionsExcel(allReports)}>
            Ban cán sự
          </button>
          <button type="button" className="secondary-btn" onClick={() => exportAbsentStudentsExcel(allReports)}>
            HS vắng
          </button>
          <button type="button" className="secondary-btn" onClick={() => exportFacilitiesExcel(allReports)}>
            Cơ sở vật chất
          </button>
          <button type="button" className="ghost-btn" onClick={onExport}>
            Dữ liệu JSON
          </button>
        </div>
      </div>

      <div className="personnel-mini-stats">
        <div className="mini-stat purple"><span>Tổng học sinh</span><strong>{totals.students}</strong></div>
        <div className="mini-stat green"><span>Có mặt</span><strong>{totals.present}</strong></div>
        <div className="mini-stat orange"><span>Vắng</span><strong>{totals.absent}</strong></div>
        <div className="mini-stat blue"><span>Lớp đã gửi</span><strong>{reports.length}</strong></div>
      </div>

      <div className="search-box">
        <span>🔎</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo lớp, GVCN hoặc email"
        />
      </div>

      {reports.length === 0 ? (
        <p className="empty-state">Chưa có báo cáo nào được gửi.</p>
      ) : (
        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>Lớp</th>
                <th>GVCN</th>
                <th>Sĩ số</th>
                <th>Có mặt</th>
                <th>Vắng</th>
                <th>Học lực T/K/Đ</th>
                <th>Hạnh kiểm T/K/Đ</th>
                <th>Ngày gửi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.className}</td>
                  <td>{report.gcvnName}</td>
                  <td>{report.totalStudents}</td>
                  <td>{report.presentStudents}</td>
                  <td>{report.absentStudents}</td>
                  <td>{report.academicStats.excellent}/{report.academicStats.good}/{report.academicStats.satisfactory}</td>
                  <td>{report.conductStats.excellent}/{report.conductStats.good}/{report.conductStats.satisfactory}</td>
                  <td>{new Date(report.submittedAt).toLocaleString('vi-VN')}</td>
                  <td>
                    <button type="button" className="secondary-btn" onClick={() => setSelectedId(report.id)}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
