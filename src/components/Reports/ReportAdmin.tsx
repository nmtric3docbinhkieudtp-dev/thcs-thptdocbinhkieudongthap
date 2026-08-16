import type { ReportSubmission } from '../../types';

interface ReportAdminProps {
  allReports: ReportSubmission[];
  onExport: () => void;
}

export function ReportAdmin({ allReports, onExport }: ReportAdminProps) {
  return (
    <div className="admin-reports-view">
      <div className="admin-header">
        <h3>Tổng hợp báo cáo ({allReports.length})</h3>
        <button 
          type="button" 
          className="primary-btn small"
          onClick={onExport}
        >
          ⬇️ Tải dữ liệu JSON
        </button>
      </div>

      {allReports.length === 0 ? (
        <p className="empty-state">Chưa có báo cáo nào được gửi.</p>
      ) : (
        <div className="reports-list">
          {allReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <strong>{report.className} - {report.gcvnName}</strong>
                <small>{new Date(report.submittedAt).toLocaleString('vi-VN')}</small>
              </div>
              <div className="report-summary">
                <div><span>Tổng HS:</span> {report.totalStudents} (Nam: {report.maleStudents}, Nữ: {report.femaleStudents})</div>
                <div><span>HS có mặt:</span> {report.presentStudents} (Nam: {report.presentMale}, Nữ: {report.presentFemale})</div>
                <div><span>Vắng:</span> {report.absentStudents}</div>
                <div><span>Học lực T/K/Đ:</span> {report.academicStats.excellent}/{report.academicStats.good}/{report.academicStats.satisfactory}</div>
                <div><span>Hạnh kiểm T/K/Đ:</span> {report.conductStats.excellent}/{report.conductStats.good}/{report.conductStats.satisfactory}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
