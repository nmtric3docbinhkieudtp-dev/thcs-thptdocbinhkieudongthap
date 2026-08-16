import type { ClassPosition, ReportSubmission } from '../../../types';
import { createDefaultClassPositions } from '../../../reports/constants';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

export function SectionBanCanSu({ reportForm, onFormChange }: SectionProps) {
  const positions = reportForm.classPositions?.length ? reportForm.classPositions : createDefaultClassPositions();

  const updatePosition = (index: number, updates: Partial<ClassPosition>) => {
    const next = positions.map((position, i) => (i === index ? { ...position, ...updates } : position));
    onFormChange({ classPositions: next });
  };

  return (
    <section className="form-section">
      <h3>II.9. PHÂN CÔNG CÁC CHỨC DANH TRONG LỚP</h3>

      <div className="form-group">
        <label>Nhóm lớp (Zalo / Facebook…)</label>
        <input
          type="text"
          value={reportForm.classGroupLink || ''}
          onChange={(e) => onFormChange({ classGroupLink: e.target.value })}
          placeholder="Dán link nhóm lớp hoặc nhóm PHHS"
        />
      </div>

      <div className="table-scroll">
        <table className="report-table">
          <thead>
            <tr>
              <th>TT</th>
              <th>Chức danh</th>
              <th>Họ và tên</th>
              <th>Học lực</th>
              <th>Hạnh kiểm</th>
              <th>Số điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={position.title + index}>
                <td>{index + 1}</td>
                <td>
                  {position.title.startsWith('Tổ trưởng') ? (
                    <input type="text" value={position.title} onChange={(e) => updatePosition(index, { title: e.target.value })} />
                  ) : (
                    position.title
                  )}
                </td>
                <td><input type="text" value={position.name} onChange={(e) => updatePosition(index, { name: e.target.value })} /></td>
                <td><input type="text" value={position.grade} onChange={(e) => updatePosition(index, { grade: e.target.value })} /></td>
                <td><input type="text" value={position.conduct} onChange={(e) => updatePosition(index, { conduct: e.target.value })} /></td>
                <td><input type="text" value={position.phone} onChange={(e) => updatePosition(index, { phone: e.target.value })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
