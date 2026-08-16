interface ReportSelectorProps {
  allReports: any[];
  isAdmin: boolean;
  onSelectForm: () => void;
  onSelectView: () => void;
}

export function ReportSelector({ allReports, isAdmin, onSelectForm, onSelectView }: ReportSelectorProps) {
  return (
    <div className="report-mode-select">
      <div className="report-choice">
        <button 
          type="button" 
          className="choice-btn"
          onClick={onSelectForm}
        >
          <span className="icon">📝</span>
          <strong>Tạo báo cáo mới</strong>
          <small>Điền form báo cáo tập trung đầu năm</small>
        </button>
      </div>
      {isAdmin && (
        <div className="report-choice">
          <button 
            type="button" 
            className="choice-btn"
            onClick={onSelectView}
          >
            <span className="icon">📊</span>
            <strong>Xem tất cả báo cáo</strong>
            <small>Tổng hợp dữ liệu từ {allReports.length} báo cáo</small>
          </button>
        </div>
      )}
    </div>
  );
}
