import { FormEvent, useEffect } from 'react';
import type { ReportSubmission } from '../../App';

interface ReportFormProps {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ReportForm({ reportForm, onFormChange, onSubmit, onCancel }: ReportFormProps) {
  const currentAcademicStats = reportForm.academicStats ?? { excellent: 0, good: 0, satisfactory: 0 };
  const currentConductStats = reportForm.conductStats ?? { excellent: 0, good: 0, satisfactory: 0 };

  // Khởi tạo các giá trị mặc định cho form nếu chưa có
  useEffect(() => {
    let needsUpdate = false;
    const updates: Partial<ReportSubmission> = { ...reportForm };

    // 1. Khởi tạo danh sách chức danh mặc định
    if (!reportForm.classPositions || reportForm.classPositions.length === 0) {
      updates.classPositions = [
        { title: 'Lớp trưởng', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Lớp phó học tập', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Phó văn thể', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Phó lao động', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Phó trật tự', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Thư ký', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Thủ quỹ', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Tổ trưởng tổ 1', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Tổ trưởng tổ 2', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Tổ trưởng tổ 3', name: '', grade: '', conduct: '', phone: '' },
        { title: 'Tổ trưởng tổ 4', name: '', grade: '', conduct: '', phone: '' },
      ];
      needsUpdate = true;
    }

    // 2. Khởi tạo danh sách thiết bị cơ sở vật chất mặc định
    if (!reportForm.facilities || reportForm.facilities.length === 0) {
      updates.facilities = [
        { name: 'Quạt trần', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' },
        { name: 'Bóng đèn', quantity: 0, unit: 'Bóng', condition: 'Tốt', notes: '' },
        { name: 'Bàn ghế giáo viên', quantity: 0, unit: 'Bộ', condition: 'Tốt', notes: '' },
        { name: 'Bàn học sinh', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' },
        { name: 'Ghế học sinh', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' },
        { name: 'Kính cửa sổ', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' },
        { name: 'Kính cửa chính', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' },
      ];
      needsUpdate = true;
    }

    // 3. Khởi tạo danh sách thành tích/năng khiếu mặc định
    if (!reportForm.prizeEntries || reportForm.prizeEntries.length === 0) {
      updates.prizeEntries = [
        { competition: 'Văn nghệ vòng tỉnh, vòng xã', prize: '', studentNames: '' },
        { competition: 'Hội khỏe phù đổng', prize: '', studentNames: '' },
        { competition: 'Giải thể thao học sinh tỉnh Đồng Tháp', prize: '', studentNames: '' },
        { competition: 'Sáng tạo thanh thiếu niên nhi đồng', prize: '', studentNames: '' },
        { competition: 'Khoa học kỹ thuật', prize: '', studentNames: '' },
        { competition: 'Vẽ tranh', prize: '', studentNames: '' },
      ];
      needsUpdate = true;
    }

    // 4. Khởi tạo danh sách nơi cư trú
    if (!reportForm.locationStats || Object.keys(reportForm.locationStats).length === 0) {
      updates.locationStats = {
        'Đốc Binh Kiều': 0,
        'Tháp Mười': 0,
        'Thanh Mỹ': 0,
        'Trường Xuân': 0,
        'Khác': 0
      };
      needsUpdate = true;
    }

    if (needsUpdate) {
      onFormChange(updates);
    }
  }, []);

  return (
    <div className="report-form-wrapper">
      <form className="report-form" onSubmit={onSubmit}>
        
        {/* I/ THÀNH PHẦN */}
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
              <label>Ngày tập trung</label>
              <input 
                type="text" 
                value={reportForm.meetingDate || ''} 
                onChange={(e) => onFormChange({...reportForm, meetingDate: e.target.value})}
                placeholder="VD: 28/8/2026"
              />
            </div>
            <div className="form-group">
              <label>Địa điểm (Phòng số)</label>
              <input 
                type="text" 
                value={reportForm.meetingLocation || ''} 
                onChange={(e) => onFormChange({...reportForm, meetingLocation: e.target.value})}
                placeholder="VD: Phòng số 10"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sĩ số lớp (Tổng số)</label>
              <input 
                type="number" 
                value={reportForm.totalStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, totalStudents: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Tổng Nam</label>
              <input 
                type="number" 
                value={reportForm.maleStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, maleStudents: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Tổng Nữ</label>
              <input 
                type="number" 
                value={reportForm.femaleStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, femaleStudents: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số HS có mặt</label>
              <input 
                type="number" 
                value={reportForm.presentStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, presentStudents: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Nam có mặt</label>
              <input 
                type="number" 
                value={reportForm.presentMale || ''} 
                onChange={(e) => onFormChange({...reportForm, presentMale: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Nữ có mặt</label>
              <input 
                type="number" 
                value={reportForm.presentFemale || ''} 
                onChange={(e) => onFormChange({...reportForm, presentFemale: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Số học sinh vắng</label>
              <input 
                type="number" 
                value={reportForm.absentStudents || ''} 
                onChange={(e) => onFormChange({...reportForm, absentStudents: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
          </div>

          {/* Bảng Danh sách học sinh vắng đầu năm */}
          <div className="sub-section-block">
            <div className="sub-section-header">
              <h4>Danh sách học sinh vắng đầu năm</h4>
              <span className="sub-section-tip">GVCN cập nhật thông tin học sinh vắng buổi tập trung</span>
            </div>
            <div className="table-responsive">
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">TT</th>
                    <th>Họ và tên học sinh</th>
                    <th style={{ width: '110px' }}>Lớp năm trước</th>
                    <th>Địa chỉ nhà</th>
                    <th>SĐT học sinh</th>
                    <th>SĐT phụ huynh</th>
                    <th>Lý do chưa ra lớp (nếu biết)</th>
                    <th style={{ width: '50px' }} className="text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportForm.assentStudentList ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-3">Không có học sinh vắng. Click "Thêm học sinh vắng" bên dưới để thêm.</td>
                    </tr>
                  ) : (
                    (reportForm.assentStudentList ?? []).map((student, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={student.name || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, name: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="Họ tên HS"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.prevClass || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, prevClass: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="VD: 5A1"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.address || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, address: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="Xã, ấp..."
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.studentPhone || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, studentPhone: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="SĐT học sinh"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.parentPhone || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, parentPhone: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="SĐT phụ huynh"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={student.reason || ''}
                            onChange={(e) => {
                              const newList = [...(reportForm.assentStudentList ?? [])];
                              newList[idx] = { ...student, reason: e.target.value };
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            placeholder="Lý do..."
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="delete-row-btn"
                            onClick={() => {
                              const newList = (reportForm.assentStudentList ?? []).filter((_, i) => i !== idx);
                              onFormChange({ ...reportForm, assentStudentList: newList });
                            }}
                            title="Xóa dòng này"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="add-row-btn"
              onClick={() => {
                const newList = [...(reportForm.assentStudentList ?? []), { name: '', prevClass: '', address: '', studentPhone: '', parentPhone: '', reason: '' }];
                onFormChange({ ...reportForm, assentStudentList: newList });
              }}
            >
              ➕ Thêm dòng học sinh vắng
            </button>
          </div>
        </section>

        {/* II/ NỘI DUNG - MỤC 5: TÌNH HÌNH HỌC LỰC, HẠNH KIỂM, NƠI CƯ TRÚ, NĂNG KHIẾU */}
        <section className="form-section">
          <h3>II.5 THÔNG TIN KHÁI QUÁT HỌC SINH ĐẦU NĂM</h3>
          
          {/* Học lực */}
          <div className="sub-section-block">
            <h4>Học lực (Năm học trước)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Tốt</label>
                <input 
                  type="number" 
                  value={currentAcademicStats.excellent} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: { ...currentAcademicStats, excellent: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Khá</label>
                <input 
                  type="number" 
                  value={currentAcademicStats.good} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: { ...currentAcademicStats, good: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Đạt</label>
                <input 
                  type="number" 
                  value={currentAcademicStats.satisfactory} 
                  onChange={(e) => onFormChange({...reportForm, academicStats: { ...currentAcademicStats, satisfactory: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Hạnh kiểm */}
          <div className="sub-section-block">
            <h4>Hạnh kiểm (Năm học trước)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Tốt</label>
                <input 
                  type="number" 
                  value={currentConductStats.excellent} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: { ...currentConductStats, excellent: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Khá</label>
                <input 
                  type="number" 
                  value={currentConductStats.good} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: { ...currentConductStats, good: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Đạt</label>
                <input 
                  type="number" 
                  value={currentConductStats.satisfactory} 
                  onChange={(e) => onFormChange({...reportForm, conductStats: { ...currentConductStats, satisfactory: parseInt(e.target.value) || 0 }})}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Đoàn viên */}
          <div className="form-row">
            <div className="form-group">
              <label>Số lượng đoàn viên</label>
              <input 
                type="number" 
                value={reportForm.partyMembers || ''} 
                onChange={(e) => onFormChange({...reportForm, partyMembers: parseInt(e.target.value) || 0})}
                min="0"
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          {/* Thống kê học sinh theo nơi ở hiện nay */}
          <div className="sub-section-block">
            <h4>Thống kê nơi cư trú của học sinh</h4>
            <div className="form-row">
              {['Đốc Binh Kiều', 'Tháp Mười', 'Thanh Mỹ', 'Trường Xuân', 'Khác'].map((loc) => {
                const stats = reportForm.locationStats ?? {};
                return (
                  <div className="form-group" key={loc}>
                    <label>{loc === 'Khác' ? 'Các xã khác' : `Xã ${loc}`}</label>
                    <input
                      type="number"
                      value={stats[loc] ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const newStats = { ...stats, [loc]: val };
                        onFormChange({ ...reportForm, locationStats: newStats });
                      }}
                      min="0"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bảng Năng khiếu, thành tích học sinh đạt giải */}
          <div className="sub-section-block">
            <h4>Năng khiếu, thành tích nổi bật của học sinh</h4>
            <div className="table-responsive">
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">TT</th>
                    <th>Tên cuộc thi / Phong trào</th>
                    <th style={{ width: '220px' }}>Giải đạt được (nếu có)</th>
                    <th>Họ và tên học sinh đạt giải</th>
                    <th style={{ width: '50px' }} className="text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportForm.prizeEntries ?? []).map((prize, idx) => (
                    <tr key={idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={prize.competition || ''}
                          onChange={(e) => {
                            const newList = [...(reportForm.prizeEntries ?? [])];
                            newList[idx] = { ...prize, competition: e.target.value };
                            onFormChange({ ...reportForm, prizeEntries: newList });
                          }}
                          placeholder="Cuộc thi / Phong trào..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={prize.prize || ''}
                          onChange={(e) => {
                            const newList = [...(reportForm.prizeEntries ?? [])];
                            newList[idx] = { ...prize, prize: e.target.value };
                            onFormChange({ ...reportForm, prizeEntries: newList });
                          }}
                          placeholder="Nhất, Nhì, Ba, Khuyến khích..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={prize.studentNames || ''}
                          onChange={(e) => {
                            const newList = [...(reportForm.prizeEntries ?? [])];
                            newList[idx] = { ...prize, studentNames: e.target.value };
                            onFormChange({ ...reportForm, prizeEntries: newList });
                          }}
                          placeholder="Họ tên các học sinh đạt giải..."
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="delete-row-btn"
                          onClick={() => {
                            const newList = (reportForm.prizeEntries ?? []).filter((_, i) => i !== idx);
                            onFormChange({ ...reportForm, prizeEntries: newList });
                          }}
                          title="Xóa dòng"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="add-row-btn"
              onClick={() => {
                const newList = [...(reportForm.prizeEntries ?? []), { competition: '', prize: '', studentNames: '' }];
                onFormChange({ ...reportForm, prizeEntries: newList });
              }}
            >
              ➕ Thêm thành tích / Phong trào khác
            </button>
          </div>
        </section>

        {/* II.9 PHÂN CÔNG BAN CÁN SỰ & CHỨC DANH LỚP */}
        <section className="form-section">
          <h3>II.9 PHÂN CÔNG CÁC CHỨC DANH TRONG LỚP</h3>
          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }} className="text-center">TT</th>
                  <th style={{ width: '180px' }}>Chức danh</th>
                  <th>Họ và tên học sinh</th>
                  <th style={{ width: '110px' }}>Học lực</th>
                  <th style={{ width: '110px' }}>Hạnh kiểm</th>
                  <th style={{ width: '160px' }}>Số điện thoại</th>
                  <th style={{ width: '50px' }} className="text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {(reportForm.classPositions ?? []).map((pos, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={pos.title || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.classPositions ?? [])];
                          newList[idx] = { ...pos, title: e.target.value };
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                        placeholder="Tên chức danh..."
                        className="font-semibold"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={pos.name || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.classPositions ?? [])];
                          newList[idx] = { ...pos, name: e.target.value };
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                        placeholder="Họ và tên học sinh"
                      />
                    </td>
                    <td>
                      <select
                        value={pos.grade || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.classPositions ?? [])];
                          newList[idx] = { ...pos, grade: e.target.value };
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                      >
                        <option value="">Chọn</option>
                        <option value="Tốt">Tốt</option>
                        <option value="Khá">Khá</option>
                        <option value="Đạt">Đạt</option>
                        <option value="Chưa đạt">Chưa đạt</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={pos.conduct || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.classPositions ?? [])];
                          newList[idx] = { ...pos, conduct: e.target.value };
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                      >
                        <option value="">Chọn</option>
                        <option value="Tốt">Tốt</option>
                        <option value="Khá">Khá</option>
                        <option value="Đạt">Đạt</option>
                        <option value="Chưa đạt">Chưa đạt</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={pos.phone || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.classPositions ?? [])];
                          newList[idx] = { ...pos, phone: e.target.value };
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                        placeholder="Số điện thoại"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="delete-row-btn"
                        onClick={() => {
                          const newList = (reportForm.classPositions ?? []).filter((_, i) => i !== idx);
                          onFormChange({ ...reportForm, classPositions: newList });
                        }}
                        title="Xóa chức danh"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="add-row-btn"
            onClick={() => {
              const newList = [...(reportForm.classPositions ?? []), { title: '', name: '', grade: '', conduct: '', phone: '' }];
              onFormChange({ ...reportForm, classPositions: newList });
            }}
          >
            ➕ Thêm chức danh ban cán sự khác
          </button>
        </section>

        {/* II.10 BÀN GIAO CƠ SỞ VẬT CHẤT PHÒNG HỌC */}
        <section className="form-section">
          <h3>II.10 BÀN GIAO CƠ SỞ VẬT CHẤT PHÒNG HỌC</h3>
          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }} className="text-center">STT</th>
                  <th style={{ width: '200px' }}>Tên thiết bị tài sản</th>
                  <th style={{ width: '100px' }}>Số lượng</th>
                  <th style={{ width: '100px' }}>Đơn vị tính</th>
                  <th style={{ width: '180px' }}>Tình trạng</th>
                  <th>Ghi chú về tình trạng tài sản (nếu bể, cong, sắp hư...)</th>
                  <th style={{ width: '50px' }} className="text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {(reportForm.facilities ?? []).map((fac, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={fac.name || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.facilities ?? [])];
                          newList[idx] = { ...fac, name: e.target.value };
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                        placeholder="Tên thiết bị..."
                        className="font-semibold"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={fac.quantity || 0}
                        onChange={(e) => {
                          const newList = [...(reportForm.facilities ?? [])];
                          newList[idx] = { ...fac, quantity: parseInt(e.target.value) || 0 };
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={fac.unit || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.facilities ?? [])];
                          newList[idx] = { ...fac, unit: e.target.value };
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                        placeholder="Cái, Bộ, Bóng..."
                      />
                    </td>
                    <td>
                      <select
                        value={fac.condition || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.facilities ?? [])];
                          newList[idx] = { ...fac, condition: e.target.value };
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                      >
                        <option value="Tốt">Tốt</option>
                        <option value="Bình thường">Bình thường</option>
                        <option value="Hỏng nhẹ">Hỏng nhẹ / Sắp hỏng</option>
                        <option value="Hỏng / Bể / Cong">Hỏng / Bể / Cong</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={fac.notes || ''}
                        onChange={(e) => {
                          const newList = [...(reportForm.facilities ?? [])];
                          newList[idx] = { ...fac, notes: e.target.value };
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                        placeholder="Ghi chú chi tiết..."
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="delete-row-btn"
                        onClick={() => {
                          const newList = (reportForm.facilities ?? []).filter((_, i) => i !== idx);
                          onFormChange({ ...reportForm, facilities: newList });
                        }}
                        title="Xóa thiết bị"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="add-row-btn"
            onClick={() => {
              const newList = [...(reportForm.facilities ?? []), { name: '', quantity: 0, unit: 'Cái', condition: 'Tốt', notes: '' }];
              onFormChange({ ...reportForm, facilities: newList });
            }}
          >
            ➕ Thêm thiết bị tài sản khác
          </button>
        </section>

        {/* XI. Ý KIẾN CỦA GVCN VÀ HỌC SINH */}
        <section className="form-section">
          <h3>XI. Ý KIẾN CỦA GVCN VÀ HỌC SINH</h3>
          <div className="form-group">
            <label>Ý kiến đề xuất / Ghi chú khác</label>
            <textarea 
              value={reportForm.gcvnOpinion || ''} 
              onChange={(e) => onFormChange({...reportForm, gcvnOpinion: e.target.value})}
              rows={6}
              placeholder="Nhập các ý kiến đề xuất, ghi nhận của giáo viên chủ nhiệm và tập thể học sinh lớp..."
            />
          </div>
        </section>

        {/* Các nút hành động */}
        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Quay lại</button>
          <button type="submit" className="primary-btn">Gửi báo cáo</button>
        </div>
      </form>
    </div>
  );
}
