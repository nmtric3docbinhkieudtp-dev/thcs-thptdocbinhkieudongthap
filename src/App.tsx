import { useState } from 'react';

type NavItem = {
  label: string;
  active?: boolean;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: 'Tổng quan', active: true },
  { label: 'Nhân sự', badge: '128' },
  { label: 'Báo cáo', badge: '12' },
  { label: 'Tài liệu', badge: '9' },
  { label: 'Cài đặt' },
];

const stats = [
  { label: 'Tổng cán bộ', value: '128', tone: 'blue' },
  { label: 'Giáo viên', value: '94', tone: 'purple' },
  { label: 'Nhân viên', value: '34', tone: 'green' },
  { label: 'Tổng số báo cáo', value: '246', tone: 'orange' },
];

const departments = [
  { name: 'Ban Giám hiệu', count: 5, progress: 92 },
  { name: 'Tổ Văn phòng', count: 12, progress: 74 },
  { name: 'Tổ Toán', count: 16, progress: 88 },
  { name: 'Tổ Ngữ văn', count: 18, progress: 86 },
  { name: 'Tổ KHTN', count: 21, progress: 79 },
];

const staffRows = [
  { name: 'Lê Thanh Cường', role: 'Phó Hiệu trưởng', unit: 'THPT Đốc Binh Kiều', status: 'Hoạt động' },
  { name: 'Nguyễn Minh Trí', role: 'Phó Hiệu trưởng', unit: 'THPT Đốc Binh Kiều', status: 'Hoạt động' },
  { name: 'Phan Thanh Thảo', role: 'Hiệu trưởng', unit: 'THCS Đốc Binh Kiều', status: 'Hoạt động' },
  { name: 'Nguyễn Thanh Tòng', role: 'Hiệu trưởng', unit: 'THCS Tân Kiều', status: 'Chờ duyệt' },
  { name: 'Trần Văn Út', role: 'Kế toán', unit: 'Tổ Văn phòng', status: 'Hoạt động' },
];

const personnelStats = [
  { label: 'Đang làm việc', value: '121', tone: 'purple' },
  { label: 'Chờ duyệt', value: '16', tone: 'orange' },
  { label: 'Nghỉ phép', value: '8', tone: 'blue' },
  { label: 'Tổng số đơn vị', value: '9', tone: 'green' },
];

const reportRows = [
  { title: 'Báo cáo tuần giáo viên', dept: 'Tổ Toán', date: '10/08/2026', status: 'Đã duyệt', tone: 'success' },
  { title: 'Kết quả kiểm tra giữa kỳ', dept: 'THCS Đốc Binh Kiều', date: '09/08/2026', status: 'Chờ duyệt', tone: 'warning' },
  { title: 'Báo cáo hoạt động đoàn thể', dept: 'Ban Giám hiệu', date: '08/08/2026', status: 'Đang xử lý', tone: 'info' },
  { title: 'Tổng hợp hồ sơ nhân sự', dept: 'Tổ Văn phòng', date: '07/08/2026', status: 'Đã duyệt', tone: 'success' },
];

const importExportStats = [
  { label: 'Dữ liệu đã nhập', value: '24.8K', tone: 'purple' },
  { label: 'File xuất', value: '184', tone: 'blue' },
  { label: 'Lỗi dữ liệu', value: '3', tone: 'orange' },
  { label: 'Tổng dung lượng', value: '2.4 GB', tone: 'green' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">DBK</div>
            <div>
              <small>Hệ thống quản lý</small>
              <h2>Trường THCS-THPT Đốc Binh Kiều</h2>
            </div>
          </div>

          <div className="auth-intro">
            <span>Đăng nhập</span>
            <h1>Chào mừng trở lại</h1>
          </div>

          <form className="auth-form" onSubmit={(e) => {
            e.preventDefault();
            setIsLoggedIn(true);
          }}>
            <label>
              <span>Email hoặc tên đăng nhập</span>
              <input type="text" defaultValue="admin@dbk.edu.vn" />
            </label>

            <label>
              <span>Mật khẩu</span>
              <input type="password" defaultValue="123456" />
            </label>

            <div className="auth-options">
              <label className="remember-box">
                <input type="checkbox" defaultChecked />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="primary-btn auth-btn">Đăng nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="school-app">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">DBK</div>
          <div>
            <small>Trường</small>
            <strong>THCS-THPT Đốc Binh Kiều</strong>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Hệ thống báo cáo</p>
          <strong>12 báo cáo mới</strong>
          <button>Xem chi tiết</button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <small>Chào mừng bạn trở lại</small>
            <h1>Dashboard trường THCS-THPT Đốc Binh Kiều</h1>
          </div>
          <div className="top-actions">
            <button className="ghost-btn">Tìm kiếm</button>
            <button className="primary-btn small">+ Thêm báo cáo</button>
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
              <button>Xuất Excel</button>
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
              <button>Xem tất cả</button>
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

        <section className="panel table-panel">
          <div className="panel-header">
            <h3>Danh sách nhân sự</h3>
            <button>Import dữ liệu</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Đơn vị</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {staffRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>{row.unit}</td>
                  <td>
                    <span className={`status ${row.status === 'Hoạt động' ? 'active' : 'pending'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="personnel-module panel">
          <div className="module-header">
            <div>
              <small>Phần 3</small>
              <h3>Quản lý nhân sự</h3>
            </div>
            <div className="module-actions">
              <button className="ghost-btn">Lọc</button>
              <button className="primary-btn small">+ Thêm nhân sự</button>
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

              {staffRows.map((person) => (
                <div key={person.name} className="person-card">
                  <div className="person-avatar">{person.name.split(' ').slice(-1)[0][0]}</div>
                  <div className="person-copy">
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                    <span>{person.unit}</span>
                  </div>
                  <span className={`status ${person.status === 'Hoạt động' ? 'active' : 'pending'}`}>
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
              <button className="ghost-btn">Xuất file</button>
              <button className="primary-btn small">+ Tạo báo cáo</button>
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
              <button className="ghost-btn">Lịch sử nhập</button>
              <button className="primary-btn small">Xuất Excel</button>
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
      </main>
    </div>
  );
}

export default App;
