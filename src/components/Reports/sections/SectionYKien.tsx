import type { ReportSubmission } from '../../../types';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

export function SectionYKien({ reportForm, onFormChange }: SectionProps) {
  return (
    <section className="form-section">
      <h3>II.11. Ý KIẾN CỦA GVCN VÀ HỌC SINH</h3>

      <div className="form-group">
        <label>Ý kiến</label>
        <textarea
          value={reportForm.gcvnOpinion || ''}
          onChange={(e) => onFormChange({ gcvnOpinion: e.target.value })}
          rows={6}
          placeholder="Nhập ý kiến của GVCN và học sinh..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Biên bản kết thúc lúc</label>
          <input
            type="text"
            value={reportForm.meetingEndTime || ''}
            onChange={(e) => onFormChange({ meetingEndTime: e.target.value })}
            placeholder="VD: 9 giờ 30 cùng ngày"
          />
        </div>
        <div className="form-group">
          <label>Thư ký (họ tên)</label>
          <input
            type="text"
            value={reportForm.secretaryName || ''}
            onChange={(e) => onFormChange({ secretaryName: e.target.value })}
            placeholder="Họ tên thư ký"
          />
        </div>
      </div>
    </section>
  );
}
