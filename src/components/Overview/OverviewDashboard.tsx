import type { AuthSession } from '../../types';
import { personnelRecords } from '../../data/personnel';
import { stats, departments, personnelStats, reportRows, importExportStats } from '../../data/dashboard';

type OverviewDashboardProps = {
  session: AuthSession;
  onLogout: () => void;
};

export function OverviewDashboard({ session, onLogout }: OverviewDashboardProps) {
  return (
    <>
      <header className="topbar">
        <div>
          <small>Chào mừng bạn trở lại</small>
          <h1>Dashboard trường THCS-THPT Đốc Binh Kiều</h1>
        </div>
        <div className="top-actions">
          <span className="user-pill">{session.user.role === 'admin' ? 'Quản trị' : 'Thành viên'} · {session.user.name ?? session.user.email}</span>
          <button type="button" className="ghost-btn" onClick={onLogout}>Đăng xuất</button>
          <button type="button" className="primary-btn small">+ Thêm báo cáo</button>
        </div>
      </header>

      <section className="hero-card">
        <div>
          <span className="eyebrow">Hệ thống quản lý trường học</span>
          <h2>Thống kê nhanh theo đơn vị</h2>
        </div>
        <div className="hero-stats">
          <div>
            <strong>86%</strong>
            <span>Độ hoàn thành</span>
          </div>
          <div>
            <strong>24</strong>
            <span>Chờ phê duyệt</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className={`stats-card ${stat.tone}`}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Phân bổ theo tổ</h3>
            <button type="button">Xuất Excel</button>
          </div>

          <div className="department-list">
            {departments.map((dept) => (
              <div key={dept.name} className="department-row">
                <div className="department-meta">
                  <strong>{dept.name}</strong>
                  <span>{dept.count} người</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${dept.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Hoạt động gần đây</h3>
            <button type="button">Xem tất cả</button>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <span className="dot green" />
              <div>
                <strong>Đã cập nhật báo cáo tuần</strong>
                <small>08:30 sáng</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="dot orange" />
              <div>
                <strong>Thêm hồ sơ nhân sự</strong>
                <small>Hôm qua</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="dot purple" />
              <div>
                <strong>Đã xuất dữ liệu thống kê</strong>
                <small>2 ngày trước</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="personnel-module panel">
        <div className="module-header">
          <div>
            <small>Phần 3</small>
            <h3>Quản lý nhân sự</h3>
          </div>
          <div className="module-actions">
            <button type="button" className="ghost-btn">Lọc</button>
            <button type="button" className="primary-btn small">+ Thêm nhân sự</button>
          </div>
        </div>

        <div className="personnel-mini-stats">
          {personnelStats.map((item) => (
            <div key={item.label} className={`mini-stat ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="personnel-layout">
          <div className="personnel-list">
            <div className="search-box">
              <span>🔎</span>
              <input type="text" value="Tìm kiếm nhân sự" readOnly />
            </div>

            {personnelRecords.slice(0, 5).map((person) => (
              <div key={person.id} className="person-card">
                <div className="person-avatar">{person.name.split(' ').slice(-1)[0][0]}</div>
                <div className="person-copy">
                  <strong>{person.name}</strong>
                  <small>{person.position}</small>
                  <span>{person.unit}</span>
                </div>
                <span className={`status ${person.status === 'Hoạt động' ? 'active' : person.status === 'Chờ duyệt' ? 'pending' : 'inactive'}`}>
                  {person.status}
                </span>
              </div>
            ))}
          </div>

          <form className="personnel-form">
            <div className="form-header">
              <h4>Thông tin cá nhân</h4>
              <button type="button" className="tiny-tag">Lưu</button>
            </div>

            <div className="field-grid">
              <label>
                <span>Họ và tên</span>
                <input type="text" value="Lê Thanh Cường" readOnly />
              </label>
              <label>
                <span>Ngày sinh</span>
                <input type="text" value="17/10/1975" readOnly />
              </label>
              <label>
                <span>Chức vụ</span>
                <input type="text" value="Phó Hiệu trưởng" readOnly />
              </label>
              <label>
                <span>Đơn vị</span>
                <input type="text" value="THPT Đốc Binh Kiều" readOnly />
              </label>
              <label>
                <span>Điện thoại</span>
                <input type="text" value="0912 345 678" readOnly />
              </label>
              <label>
                <span>Email</span>
                <input type="text" value="hieu.truong@dbk.edu.vn" readOnly />
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-btn">Xem hồ sơ</button>
              <button type="button" className="primary-btn small">Cập nhật</button>
            </div>
          </form>
        </div>
      </section>

      <section className="report-module panel">
        <div className="module-header">
          <div>
            <small>Phần 4</small>
            <h3>Quản lý báo cáo & tài liệu</h3>
          </div>
          <div className="module-actions">
            <button type="button" className="ghost-btn">Xuất file</button>
            <button type="button" className="primary-btn small">+ Tạo báo cáo</button>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-list">
            {reportRows.map((report) => (
              <div key={report.title} className="report-row">
                <div className="report-copy">
                  <strong>{report.title}</strong>
                  <span>{report.dept}</span>
                  <small>{report.date}</small>
                </div>
                <span className={`report-badge ${report.tone}`}>{report.status}</span>
              </div>
            ))}
          </div>

          <div className="upload-panel">
            <div className="upload-box">
              <div className="upload-icon">⇪</div>
              <strong>Upload tài liệu</strong>
              <span>Kéo file vào đây hoặc chọn từ máy tính</span>
              <button type="button" className="primary-btn small">Chọn tệp</button>
            </div>

            <div className="attachment-list">
              <div className="attachment-item">
                <span>📄</span>
                <div>
                  <strong>bao-cao-tuan-08.docx</strong>
                  <small>1.2 MB</small>
                </div>
              </div>
              <div className="attachment-item">
                <span>📎</span>
                <div>
                  <strong>thong-ke-giao-vien.xlsx</strong>
                  <small>890 KB</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="import-export panel">
        <div className="module-header">
          <div>
            <small>Phần 5</small>
            <h3>Import & Export dữ liệu</h3>
          </div>
          <div className="module-actions">
            <button type="button" className="ghost-btn">Lịch sử nhập</button>
            <button type="button" className="primary-btn small">Xuất Excel</button>
          </div>
        </div>

        <div className="import-export-stats">
          {importExportStats.map((item) => (
            <div key={item.label} className={`mini-stat ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="import-export-grid">
          <div className="import-box">
            <h4>Nhập dữ liệu</h4>
            <div className="drop-zone">
              <div className="drop-icon">⇩</div>
              <span>Drop file Excel / CSV vào đây</span>
              <button type="button" className="primary-btn small">Chọn tệp</button>
            </div>
          </div>

          <div className="export-box">
            <h4>Xuất dữ liệu</h4>
            <div className="export-actions">
              <button type="button" className="secondary-btn">Xuất Excel</button>
              <button type="button" className="secondary-btn">Xuất CSV</button>
              <button type="button" className="primary-btn small">Tải xuống</button>
            </div>

            <div className="export-summary">
              <div>
                <span>Định dạng</span>
                <strong>.xlsx</strong>
              </div>
              <div>
                <span>Hiệu lực</span>
                <strong>Hôm nay</strong>
              </div>
              <div>
                <span>Người tạo</span>
                <strong>Ban quản trị</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
