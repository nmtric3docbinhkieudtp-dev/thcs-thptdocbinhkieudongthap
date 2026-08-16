interface PersonnelRecord {
  id: string;
  name: string;
  position: string;
  department: string;
  unit: string;
  gender: string;
  birth: string;
  status: string;
}

interface PersonnelViewProps {
  totalPersonnel: number;
  allPersonnel: PersonnelRecord[];
  filteredPersonnel: PersonnelRecord[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onBackToOverview: () => void;
}

export function PersonnelView({
  totalPersonnel,
  allPersonnel,
  filteredPersonnel,
  searchTerm,
  onSearchChange,
  onBackToOverview,
}: PersonnelViewProps) {
  return (
    <section className="personnel-page panel">
      <div className="personnel-page-header">
        <div>
          <small>Nhân sự toàn trường</small>
          <h1>Danh sách nhân sự</h1>
        </div>
        <button type="button" className="ghost-btn" onClick={onBackToOverview}>Quay lại dashboard</button>
      </div>

      <div className="personnel-page-summary">
        <div className="mini-stat purple">
          <span>Tổng nhân sự</span>
          <strong>{totalPersonnel}</strong>
        </div>
        <div className="mini-stat blue">
          <span>Giáo viên</span>
          <strong>{allPersonnel.filter((person) => person.position.includes('Giáo viên') || person.position.includes('Tổ trưởng') || person.position.includes('Tổ phó')).length}</strong>
        </div>
        <div className="mini-stat green">
          <span>Nhân viên</span>
          <strong>{allPersonnel.filter((person) => person.position.includes('Nhân viên') || person.position.includes('Văn thư') || person.position.includes('Kế toán') || person.position.includes('Y tế')).length}</strong>
        </div>
        <div className="mini-stat orange">
          <span>Ban giám hiệu</span>
          <strong>{allPersonnel.filter((person) => person.department === 'Ban giám hiệu').length}</strong>
        </div>
      </div>

      <div className="personnel-toolbar">
        <div className="search-box full-width">
          <span>🔎</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên, chức vụ, đơn vị, bộ môn..."
          />
        </div>
      </div>

      <div className="personnel-table-wrap">
        <table className="personnel-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Đơn vị</th>
              <th>Bộ môn</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonnel.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.position}</td>
                <td>{person.unit}</td>
                <td>{person.department}</td>
                <td>{person.gender}</td>
                <td>{person.birth}</td>
                <td>
                  <span className={`status ${person.status === 'Hoạt động' ? 'active' : person.status === 'Chờ duyệt' ? 'pending' : 'inactive'}`}>
                    {person.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
