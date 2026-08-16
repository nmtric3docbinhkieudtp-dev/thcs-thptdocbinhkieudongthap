import type { ReportSubmission } from '../../../types';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

export function SectionThanhPhan({ reportForm, onFormChange }: SectionProps) {
  return (
    <section className="form-section">
      <h3>I. THÀNH PHẦN</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Vào lúc (giờ)</label>
          <input
            type="text"
            value={reportForm.meetingTime || ''}
            onChange={(e) => onFormChange({ meetingTime: e.target.value })}
            placeholder="VD: 7 giờ 30"
          />
        </div>
        <div className="form-group">
          <label>Ngày tập trung</label>
          <input
            type="text"
            value={reportForm.meetingDate || ''}
            onChange={(e) => onFormChange({ meetingDate: e.target.value })}
            placeholder="VD: 28/8/2026"
          />
        </div>
        <div className="form-group">
          <label>Phòng số</label>
          <input
            type="text"
            value={reportForm.meetingLocation || ''}
            onChange={(e) => onFormChange({ meetingLocation: e.target.value })}
            placeholder="VD: 12"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Họ tên GVCN</label>
          <input
            type="text"
            value={reportForm.gcvnName || ''}
            onChange={(e) => onFormChange({ gcvnName: e.target.value })}
            placeholder="Nhập họ tên"
            required
          />
        </div>
        <div className="form-group">
          <label>Lớp</label>
          <input
            type="text"
            value={reportForm.className || ''}
            onChange={(e) => onFormChange({ className: e.target.value })}
            placeholder="VD: 6A, 10A1"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sĩ số lớp</label>
          <input
            type="number"
            value={reportForm.totalStudents || ''}
            onChange={(e) => onFormChange({ totalStudents: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label>Nam</label>
          <input
            type="number"
            value={reportForm.maleStudents || ''}
            onChange={(e) => onFormChange({ maleStudents: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label>Nữ</label>
          <input
            type="number"
            value={reportForm.femaleStudents || ''}
            onChange={(e) => onFormChange({ femaleStudents: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>HS có mặt ngày tập trung</label>
          <input
            type="number"
            value={reportForm.presentStudents || ''}
            onChange={(e) => onFormChange({ presentStudents: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label>Nam</label>
          <input
            type="number"
            value={reportForm.presentMale || ''}
            onChange={(e) => onFormChange({ presentMale: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label>Nữ</label>
          <input
            type="number"
            value={reportForm.presentFemale || ''}
            onChange={(e) => onFormChange({ presentFemale: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label>Số HS vắng</label>
          <input
            type="number"
            value={reportForm.absentStudents || ''}
            onChange={(e) => onFormChange({ absentStudents: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </section>
  );
}
