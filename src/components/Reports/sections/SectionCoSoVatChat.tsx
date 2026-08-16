import type { FacilityItem, ReportSubmission } from '../../../types';
import { createDefaultFacilities } from '../../../reports/constants';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

export function SectionCoSoVatChat({ reportForm, onFormChange }: SectionProps) {
  const facilities = reportForm.facilities?.length ? reportForm.facilities : createDefaultFacilities();

  const updateFacility = (index: number, updates: Partial<FacilityItem>) => {
    const next = facilities.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onFormChange({ facilities: next });
  };

  return (
    <section className="form-section">
      <h3>BIÊN BẢN BÀN GIAO TÀI SẢN PHÒNG HỌC</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Thời gian bàn giao</label>
          <input
            type="text"
            value={reportForm.handoverTime || ''}
            onChange={(e) => onFormChange({ handoverTime: e.target.value })}
            placeholder="VD: 8 giờ 00 ngày 28/8/2026"
          />
        </div>
        <div className="form-group">
          <label>Địa điểm (phòng học)</label>
          <input
            type="text"
            value={reportForm.handoverLocation || ''}
            onChange={(e) => onFormChange({ handoverLocation: e.target.value })}
            placeholder="VD: Phòng 12"
          />
        </div>
      </div>

      <p className="form-note">
        Ghi rõ thiết bị bị bể, cong hoặc sắp hư ở cột ghi chú để lớp không chịu trách nhiệm khi kiểm tra định kỳ.
      </p>

      <div className="table-scroll">
        <table className="report-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thiết bị</th>
              <th>Số lượng</th>
              <th>Đơn vị tính</th>
              <th>Tình trạng</th>
              <th>Ghi chú về tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((item, index) => (
              <tr key={item.name + index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => updateFacility(index, { quantity: parseInt(e.target.value) || 0 })}
                  />
                </td>
                <td>{item.unit}</td>
                <td>
                  <select value={item.condition} onChange={(e) => updateFacility(index, { condition: e.target.value })}>
                    <option value="">-- Chọn --</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Sử dụng được">Sử dụng được</option>
                    <option value="Hư hỏng">Hư hỏng</option>
                  </select>
                </td>
                <td>
                  <input type="text" value={item.notes} onChange={(e) => updateFacility(index, { notes: e.target.value })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
