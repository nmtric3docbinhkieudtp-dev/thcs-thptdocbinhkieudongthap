import type { ReportSubmission } from '../../../types';
import { LOCATION_OPTIONS, createDefaultPrizeEntries } from '../../../reports/constants';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

const EMPTY_STATS = { excellent: 0, good: 0, satisfactory: 0 };

export function SectionThongTinHocSinh({ reportForm, onFormChange }: SectionProps) {
  const academic = { ...EMPTY_STATS, ...reportForm.academicStats };
  const conduct = { ...EMPTY_STATS, ...reportForm.conductStats };
  const locationStats = reportForm.locationStats || {};
  const prizeEntries = reportForm.prizeEntries?.length ? reportForm.prizeEntries : createDefaultPrizeEntries();

  const updatePrize = (index: number, updates: Partial<(typeof prizeEntries)[number]>) => {
    const next = prizeEntries.map((entry, i) => (i === index ? { ...entry, ...updates } : entry));
    onFormChange({ prizeEntries: next });
  };

  return (
    <section className="form-section">
      <h3>II.5. THÔNG TIN HỌC SINH CỦA LỚP</h3>

      <div>
        <label className="section-label">Học lực</label>
        <div className="form-row">
          <div className="form-group">
            <label>Tốt</label>
            <input type="number" value={academic.excellent || ''} onChange={(e) => onFormChange({ academicStats: { ...academic, excellent: parseInt(e.target.value) || 0 } })} />
          </div>
          <div className="form-group">
            <label>Khá</label>
            <input type="number" value={academic.good || ''} onChange={(e) => onFormChange({ academicStats: { ...academic, good: parseInt(e.target.value) || 0 } })} />
          </div>
          <div className="form-group">
            <label>Đạt</label>
            <input type="number" value={academic.satisfactory || ''} onChange={(e) => onFormChange({ academicStats: { ...academic, satisfactory: parseInt(e.target.value) || 0 } })} />
          </div>
        </div>
      </div>

      <div>
        <label className="section-label">Hạnh kiểm</label>
        <div className="form-row">
          <div className="form-group">
            <label>Tốt</label>
            <input type="number" value={conduct.excellent || ''} onChange={(e) => onFormChange({ conductStats: { ...conduct, excellent: parseInt(e.target.value) || 0 } })} />
          </div>
          <div className="form-group">
            <label>Khá</label>
            <input type="number" value={conduct.good || ''} onChange={(e) => onFormChange({ conductStats: { ...conduct, good: parseInt(e.target.value) || 0 } })} />
          </div>
          <div className="form-group">
            <label>Đạt</label>
            <input type="number" value={conduct.satisfactory || ''} onChange={(e) => onFormChange({ conductStats: { ...conduct, satisfactory: parseInt(e.target.value) || 0 } })} />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Số đoàn viên</label>
        <input
          type="number"
          value={reportForm.partyMembers || ''}
          onChange={(e) => onFormChange({ partyMembers: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div>
        <label className="section-label">Thống kê học sinh theo nơi ở hiện nay</label>
        <div className="form-row">
          {LOCATION_OPTIONS.map((name) => (
            <div className="form-group" key={name}>
              <label>{name}</label>
              <input
                type="number"
                value={locationStats[name] || ''}
                onChange={(e) => onFormChange({ locationStats: { ...locationStats, [name]: parseInt(e.target.value) || 0 } })}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="section-label">Năng khiếu, thành tích của học sinh</label>
        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>TT</th>
                <th>Cuộc thi</th>
                <th>Đạt giải</th>
                <th>Họ tên học sinh đạt giải</th>
              </tr>
            </thead>
            <tbody>
              {prizeEntries.map((entry, index) => (
                <tr key={entry.competition + index}>
                  <td>{index + 1}</td>
                  <td>
                    {entry.competition.startsWith('Phong trào khác') || entry.competition.startsWith('Thành tích khác') ? (
                      <input
                        type="text"
                        value={entry.competition}
                        onChange={(e) => updatePrize(index, { competition: e.target.value })}
                      />
                    ) : (
                      entry.competition
                    )}
                  </td>
                  <td>
                    <input type="text" value={entry.prize} onChange={(e) => updatePrize(index, { prize: e.target.value })} />
                  </td>
                  <td>
                    <input type="text" value={entry.studentNames} onChange={(e) => updatePrize(index, { studentNames: e.target.value })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
