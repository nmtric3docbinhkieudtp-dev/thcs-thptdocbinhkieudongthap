import type { ReportSubmission } from '../../types';
import { LOCATION_OPTIONS } from '../../reports/constants';

interface ReportDetailProps {
  report: ReportSubmission;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  const filledPrizes = report.prizeEntries?.filter((entry) => entry.prize.trim() || entry.studentNames.trim()) ?? [];
  const filledPositions = report.classPositions?.filter((position) => position.name.trim()) ?? [];
  const absentList = report.assentStudentList ?? [];

  return (
    <div className="report-detail">
      <div className="admin-header">
        <h3>Lớp {report.className} — GVCN {report.gcvnName}</h3>
        <button type="button" className="ghost-btn" onClick={onBack}>Quay lại danh sách</button>
      </div>

      <section className="form-section">
        <h4>I. Thành phần</h4>
        <div className="detail-grid">
          <div><span>Thời gian:</span> {report.meetingTime} — {report.meetingDate}</div>
          <div><span>Phòng:</span> {report.meetingLocation}</div>
          <div><span>Sĩ số:</span> {report.totalStudents} (Nam {report.maleStudents}, Nữ {report.femaleStudents})</div>
          <div><span>Có mặt:</span> {report.presentStudents} (Nam {report.presentMale}, Nữ {report.presentFemale})</div>
          <div><span>Vắng:</span> {report.absentStudents}</div>
          <div><span>Email GVCN:</span> {report.gcvnEmail}</div>
        </div>
      </section>

      <section className="form-section">
        <h4>Học lực – Hạnh kiểm – Nơi ở</h4>
        <div className="detail-grid">
          <div><span>Học lực T/K/Đ:</span> {report.academicStats.excellent}/{report.academicStats.good}/{report.academicStats.satisfactory}</div>
          <div><span>Hạnh kiểm T/K/Đ:</span> {report.conductStats.excellent}/{report.conductStats.good}/{report.conductStats.satisfactory}</div>
          <div><span>Đoàn viên:</span> {report.partyMembers}</div>
          {LOCATION_OPTIONS.map((name) => (
            <div key={name}><span>{name}:</span> {report.locationStats?.[name] ?? 0}</div>
          ))}
        </div>
      </section>

      {filledPrizes.length > 0 && (
        <section className="form-section">
          <h4>Thành tích học sinh</h4>
          <table className="report-table">
            <thead><tr><th>Cuộc thi</th><th>Đạt giải</th><th>Học sinh</th></tr></thead>
            <tbody>
              {filledPrizes.map((entry, index) => (
                <tr key={index}><td>{entry.competition}</td><td>{entry.prize}</td><td>{entry.studentNames}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {filledPositions.length > 0 && (
        <section className="form-section">
          <h4>Ban cán sự lớp</h4>
          <table className="report-table">
            <thead><tr><th>Chức danh</th><th>Họ và tên</th><th>Học lực</th><th>Hạnh kiểm</th><th>Điện thoại</th></tr></thead>
            <tbody>
              {filledPositions.map((position, index) => (
                <tr key={index}>
                  <td>{position.title}</td><td>{position.name}</td><td>{position.grade}</td><td>{position.conduct}</td><td>{position.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="form-section">
        <h4>Cơ sở vật chất phòng học {report.handoverLocation}</h4>
        <table className="report-table">
          <thead><tr><th>Thiết bị</th><th>Số lượng</th><th>ĐVT</th><th>Tình trạng</th><th>Ghi chú</th></tr></thead>
          <tbody>
            {(report.facilities ?? []).map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td><td>{item.quantity}</td><td>{item.unit}</td><td>{item.condition}</td><td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {absentList.length > 0 && (
        <section className="form-section">
          <h4>Học sinh vắng ({absentList.length})</h4>
          <table className="report-table">
            <thead><tr><th>Họ và tên</th><th>Lớp năm trước</th><th>Địa chỉ</th><th>ĐT HS</th><th>ĐT PH</th><th>Lý do</th></tr></thead>
            <tbody>
              {absentList.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td><td>{student.prevClass}</td><td>{student.address}</td>
                  <td>{student.studentPhone}</td><td>{student.parentPhone}</td><td>{student.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="form-section">
        <h4>Ý kiến GVCN và học sinh</h4>
        <p className="detail-text">{report.gcvnOpinion || '(không có)'}</p>
        <div className="detail-grid">
          <div><span>Kết thúc lúc:</span> {report.meetingEndTime}</div>
          <div><span>Thư ký:</span> {report.secretaryName}</div>
          <div><span>Nhóm lớp:</span> {report.classGroupLink}</div>
        </div>
      </section>
    </div>
  );
}
