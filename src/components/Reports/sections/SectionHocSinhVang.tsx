import type { AbsentStudent, ReportSubmission } from '../../../types';
import { createDefaultAbsentStudents } from '../../../reports/constants';

type SectionProps = {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
};

const EMPTY_STUDENT: AbsentStudent = {
  name: '',
  prevClass: '',
  address: '',
  studentPhone: '',
  parentPhone: '',
  reason: '',
};

export function SectionHocSinhVang({ reportForm, onFormChange }: SectionProps) {
  const students = reportForm.assentStudentList?.length ? reportForm.assentStudentList : createDefaultAbsentStudents();

  const updateStudent = (index: number, updates: Partial<AbsentStudent>) => {
    const next = students.map((student, i) => (i === index ? { ...student, ...updates } : student));
    onFormChange({ assentStudentList: next });
  };

  return (
    <section className="form-section">
      <h3>DANH SÁCH HỌC SINH VẮNG ĐẦU NĂM</h3>
      <p className="form-note">Chỉ điền những dòng có học sinh vắng, dòng trống sẽ tự bỏ qua khi gửi.</p>

      <div className="table-scroll">
        <table className="report-table">
          <thead>
            <tr>
              <th>TT</th>
              <th>Họ và tên học sinh</th>
              <th>Lớp năm trước</th>
              <th>Địa chỉ nhà</th>
              <th>ĐT học sinh</th>
              <th>ĐT phụ huynh</th>
              <th>Lý do chưa ra lớp</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><input type="text" value={student.name} onChange={(e) => updateStudent(index, { name: e.target.value })} /></td>
                <td><input type="text" value={student.prevClass} onChange={(e) => updateStudent(index, { prevClass: e.target.value })} /></td>
                <td><input type="text" value={student.address} onChange={(e) => updateStudent(index, { address: e.target.value })} /></td>
                <td><input type="text" value={student.studentPhone} onChange={(e) => updateStudent(index, { studentPhone: e.target.value })} /></td>
                <td><input type="text" value={student.parentPhone} onChange={(e) => updateStudent(index, { parentPhone: e.target.value })} /></td>
                <td><input type="text" value={student.reason} onChange={(e) => updateStudent(index, { reason: e.target.value })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="ghost-btn"
        onClick={() => onFormChange({ assentStudentList: [...students, { ...EMPTY_STUDENT }] })}
      >
        + Thêm dòng
      </button>
    </section>
  );
}
