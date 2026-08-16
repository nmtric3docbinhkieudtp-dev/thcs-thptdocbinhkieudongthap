import { FormEvent } from 'react';
import type { ReportSubmission } from '../../types';

interface ReportFormProps {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ReportForm({ reportForm, onFormChange, onSubmit, onCancel }: ReportFormProps) {
  return (
    <div className="report-form-wrapper">
      <form className="report-form" onSubmit={onSubmit}>
        <section className="form-section">
          <h3>I. THÀNH PHẦN</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Họ tên GVCN</label>
              <input 
                type="text" 
                value={reportForm.gcvnName || ''} 
                onChange={(e) => onFormChange({...reportForm, gcvnName: e.target.value})}
                placeholder="Nhập họ tên"
                required
              />
            </div>
            <div className="form-group">
              <label>Lớp</label>
              <input 
                type="text" 
                value={reportForm.className || ''} 
                onChange={(e) => onFormChange({...reportForm, className: e.target.value})}
                placeholder="VD: 6A, 9B"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thời gian (giờ)</label>
              <input 
                type="text" 
                value={reportForm.meetingTime || ''} 
                onChange={(e) => onFormChange({...reportForm, meetingTime: e.target.value})}
                placeholder="VD: 7:00"
              />
            </div>
            <div className="form-group">
              <label>Ngày</label>
              <input 
                type="text" 
                value={reportForm.meetingDate || ''} 
                onChange={(e) => onFormChange({...reportForm, meetingDate: e.target.value})}
                placeholder="VD: 03/9/2026"
              />
            </div>
            <div className="form-group">
              <label>Địa điểm</label>
              <input 
                type="text" 
                value={reportForm.meetingLocation || ''} 
                onChange={(e) => onFormChange({...reportForm, meetingLocation: e.target.value})}
                placeholder="Phòng học, địa điểm"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tổng số HS</label>
              <input 
                type="number" 
                value={reportForm.totalStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, totalStudents: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Nam</label>
              <input 
                type="number" 
                value={reportForm.maleStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, maleStudents: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Nữ</label>
              <input 
                type="number" 
                value={reportForm.femaleStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, femaleStudents: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>HS có mặt</label>
              <input 
                type="number" 
                value={reportForm.presentStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, presentStudents: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Nam</label>
              <input 
                type="number" 
                value={reportForm.presentMale || ''} 
                onChange={(e) => onFormChange({...reportForm, presentMale: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Nữ</label>
              <input 
                type="number" 
                value={reportForm.presentFemale || ''} 
                onChange={(e) => onFormChange({...reportForm, presentFemale: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Số vắng</label>
              <input 
                type="number" 
                value={reportForm.absentStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, absentStudents: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>V. TÌNH HÌNH HỌC LỰC VÀ HẠNH KIỂM</h3>
          
          <div>
            <label>Học lực</label>
            <div className="form-row">
              <div className="form-group">
                <label>Tốt</label>
                <input 
                  type="number" 
                  value={reportForm.academicStats?.excellent || ''} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.academicStats, excellent: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div className="form-group">
                <label>Khá</label>
                <input 
                  type="number" 
                  value={reportForm.academicStats?.good || ''} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.academicStats, good: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div className="form-group">
                <label>Đạt</label>
                <input 
                  type="number" 
                  value={reportForm.academicStats?.satisfactory || ''} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.academicStats, satisfactory: parseInt(e.target.value) || 0}})}
                />
              </div>
            </div>
          </div>

          <div>
            <label>Hạnh kiểm</label>
            <div className="form-row">
              <div className="form-group">
                <label>Tốt</label>
                <input 
                  type="number" 
                  value={reportForm.conductStats?.excellent || ''} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.conductStats, excellent: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div className="form-group">
                <label>Khá</label>
                <input 
                  type="number" 
                  value={reportForm.conductStats?.good || ''} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.conductStats, good: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div className="form-group">
                <label>Đạt</label>
                <input 
                  type="number" 
                  value={reportForm.conductStats?.satisfactory || ''} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: {...{excellent: 0, good: 0, satisfactory: 0}, ...reportForm.conductStats, satisfactory: parseInt(e.target.value) || 0}})}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Số đoàn viên</label>
            <input 
              type="number" 
              value={reportForm.partyMembers || ''} 
              onChange={(e) => onFormChange({...reportForm, partyMembers: parseInt(e.target.value) || 0})}
            />
          </div>
        </section>

        <section className="form-section">
          <h3>XI. Ý KIẾN CỦA GVCN VÀ HỌC SINH</h3>
          <div className="form-group">
            <label>Ý kiến</label>
            <textarea 
              value={reportForm.gcvnOpinion || ''} 
              onChange={(e) => onFormChange({...reportForm, gcvnOpinion: e.target.value})}
              rows={6}
              placeholder="Nhập ý kiến của GVCN và học sinh..."
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Quay lại</button>
          <button type="submit" className="primary-btn">Gửi báo cáo</button>
        </div>
      </form>
    </div>
  );
}
