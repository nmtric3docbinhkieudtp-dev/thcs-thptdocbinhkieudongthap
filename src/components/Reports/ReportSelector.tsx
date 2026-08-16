import type { ReportSubmission } from '../../types';

interface ReportSelectorProps {
  allReports: ReportSubmission[];
  myReports: ReportSubmission[];
  isAdmin: boolean;
  onSelectForm: () => void;
  onSelectView: () => void;
  onEditReport: (report: ReportSubmission) => void;
}

export function ReportSelector({ allReports, myReports, isAdmin, onSelectForm, onSelectView, onEditReport }: ReportSelectorProps) {
  return (
    <>
      <div className="report-mode-select">
        <div className="report-choice">
          <button type="button" className="choice-btn" onClick={onSelectForm}>
            <span className="icon">📝</span>
            <strong>Tạo báo cáo mới</strong>
            <small>Điền biên bản tập trung học sinh đầu năm</small>
          </button>
        </div>
        {isAdmin && (
          <div className="report-choice">
            <button type="button" className="choice-btn" onClick={onSelectView}>
              <span className="icon">📊</span>
              <strong>Xem tất cả báo cáo</strong>
              <small>Tổng hợp dữ liệu từ {allReports.length} báo cáo</small>
            </button>
          </div>
        )}
      </div>

      {myReports.length > 0 && (
        <div className="my-reports">
          <h4>Báo cáo bạn đã gửi</h4>
          {myReports.map((report) => (
            <div key={report.id} className="report-row">
              <div className="report-copy">
                <strong>Lớp {report.className}</strong>
                <span>Sĩ số {report.totalStudents} · vắng {report.absentStudents}</span>
                <small>{new Date(report.submittedAt).toLocaleString('vi-VN')}</small>
              </div>
              <button type="button" className="secondary-btn" onClick={() => onEditReport(report)}>
                Sửa lại
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
