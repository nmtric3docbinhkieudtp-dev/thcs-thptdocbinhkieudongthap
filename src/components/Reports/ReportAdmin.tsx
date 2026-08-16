import { useState } from 'react';
import type { ReportSubmission } from '../../App';

interface ReportAdminProps {
  allReports: ReportSubmission[];
  onExport: () => void;
}

export function ReportAdmin({ allReports, onExport }: ReportAdminProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="admin-reports-view">
      <div className="admin-header">
        <h3>Tổng hợp báo cáo ({allReports.length})</h3>
        <button 
          type="button" 
          className="primary-btn small"
          onClick={onExport}
        >
          ⬇️ Tải dữ liệu JSON
        </button>
      </div>

      {allReports.length === 0 ? (
        <p className="empty-state">Chưa có báo cáo nào được gửi.</p>
      ) : (
        <div className="reports-list">
          {allReports.map((report) => {
            const isExpanded = expandedIds[report.id];
            
            // Tính số lượng học sinh vắng thực tế ghi nhận trong danh sách vắng
            const actualAbsentCount = report.assentStudentList?.length || 0;

            return (
              <div key={report.id} className={`report-card ${isExpanded ? 'active' : ''}`}>
                <div className="report-header" onClick={() => toggleExpand(report.id)} style={{ cursor: 'pointer' }}>
                  <div>
                    <strong>Lớp {report.className} — GVCN: {report.gcvnName}</strong>
                    <small style={{ display: 'block', marginTop: '4px', color: 'var(--muted)' }}>
                      Gửi lúc: {new Date(report.submittedAt).toLocaleString('vi-VN')}
                    </small>
                  </div>
                  <button type="button" className="ghost-btn small">
                    {isExpanded ? '🔼 Thu gọn' : '🔽 Xem chi tiết'}
                  </button>
                </div>
                
                <div className="report-summary" onClick={() => toggleExpand(report.id)} style={{ cursor: 'pointer' }}>
                  <div><span>Sĩ số:</span> {report.totalStudents} (Nam: {report.maleStudents}, Nữ: {report.femaleStudents})</div>
                  <div><span>Có mặt:</span> {report.presentStudents} (Nam: {report.presentMale}, Nữ: {report.presentFemale})</div>
                  <div><span>Số vắng:</span> {report.absentStudents} (Khai báo DS: {actualAbsentCount})</div>
                  <div><span>Học lực T/K/Đ:</span> {report.academicStats.excellent}/{report.academicStats.good}/{report.academicStats.satisfactory}</div>
                  <div><span>Hạnh kiểm T/K/Đ:</span> {report.conductStats.excellent}/{report.conductStats.good}/{report.conductStats.satisfactory}</div>
                </div>

                {isExpanded && (
                  <div className="report-details-expanded" style={{ borderTop: '1px solid var(--line)', marginTop: '16px', paddingTop: '16px' }}>
                    
                    {/* Thống kê nơi cư trú */}
                    <div className="detail-section">
                      <h5>📍 Thống kê nơi cư trú</h5>
                      <div className="residence-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '8px 0 16px' }}>
                        {Object.entries(report.locationStats || {}).map(([loc, count]) => (
                          <div key={loc} className="residence-badge" style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--muted)', marginRight: '6px' }}>{loc === 'Khác' ? 'Các xã khác' : `Xã ${loc}`}:</span>
                            <strong style={{ color: 'var(--text)' }}>{count} HS</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách học sinh vắng */}
                    <div className="detail-section">
                      <h5>❌ Danh sách học sinh vắng đầu năm ({actualAbsentCount})</h5>
                      {!report.assentStudentList || report.assentStudentList.length === 0 ? (
                        <p className="no-data" style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 16px' }}>Không có học sinh vắng.</p>
                      ) : (
                        <div className="table-responsive" style={{ margin: '8px 0 16px' }}>
                          <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>TT</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Họ tên học sinh</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Lớp cũ</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Địa chỉ</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>SĐT học sinh</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>SĐT phụ huynh</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Lý do chưa ra lớp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.assentStudentList.map((st, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{i + 1}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}><strong>{st.name}</strong></td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{st.prevClass || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{st.address || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{st.studentPhone || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{st.parentPhone || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{st.reason || '---'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Ban cán sự lớp */}
                    <div className="detail-section">
                      <h5>👥 Phân công các chức danh trong lớp</h5>
                      {!report.classPositions || report.classPositions.length === 0 ? (
                        <p className="no-data" style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 16px' }}>Chưa phân công chức danh.</p>
                      ) : (
                        <div className="table-responsive" style={{ margin: '8px 0 16px' }}>
                          <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>TT</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Chức danh</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Họ và tên</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Học lực</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Hạnh kiểm</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Số điện thoại</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.classPositions.map((pos, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{i + 1}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}><strong>{pos.title}</strong></td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{pos.name || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{pos.grade || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{pos.conduct || '---'}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{pos.phone || '---'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Bàn giao cơ sở vật chất */}
                    <div className="detail-section">
                      <h5>📦 Bàn giao cơ sở vật chất</h5>
                      {!report.facilities || report.facilities.length === 0 ? (
                        <p className="no-data" style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 16px' }}>Chưa nhập thông tin cơ sở vật chất.</p>
                      ) : (
                        <div className="table-responsive" style={{ margin: '8px 0 16px' }}>
                          <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>TT</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Tên thiết bị</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Số lượng</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Tình trạng</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Ghi chú chi tiết</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.facilities.map((fac, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{i + 1}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}><strong>{fac.name}</strong></td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{fac.quantity} {fac.unit}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>
                                    <span 
                                      className={`status-badge ${fac.condition === 'Tốt' ? 'good' : 'warning'}`}
                                      style={{
                                        background: fac.condition === 'Tốt' ? 'var(--green-soft)' : 'var(--orange-soft)',
                                        color: fac.condition === 'Tốt' ? 'var(--green)' : 'var(--orange)',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '0.8rem'
                                      }}
                                    >
                                      {fac.condition}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{fac.notes || '---'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Năng khiếu thành tích */}
                    <div className="detail-section">
                      <h5>🏆 Năng khiếu & thành tích nổi bật</h5>
                      {!report.prizeEntries || report.prizeEntries.length === 0 ? (
                        <p className="no-data" style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 16px' }}>Không có ghi nhận thành tích.</p>
                      ) : (
                        <div className="table-responsive" style={{ margin: '8px 0 16px' }}>
                          <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>TT</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Cuộc thi / Phong trào</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Giải thưởng</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>Học sinh đạt giải</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.prizeEntries.map((prize, i) => (
                                <tr key={i}>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{i + 1}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{prize.competition}</td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}><strong>{prize.prize || '---'}</strong></td>
                                  <td style={{ padding: '8px', borderBottom: '1px solid var(--line)' }}>{prize.studentNames || '---'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Ý kiến của giáo viên chủ nhiệm */}
                    {report.gcvnOpinion && (
                      <div className="detail-section" style={{ background: 'var(--purple-soft)', padding: '12px 16px', borderRadius: '12px', margin: '8px 0 8px' }}>
                        <h5 style={{ margin: '0 0 6px 0', color: 'var(--purple)' }}>💬 Ý kiến đề xuất của GVCN & Học sinh</h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text)' }}>
                          {report.gcvnOpinion}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
