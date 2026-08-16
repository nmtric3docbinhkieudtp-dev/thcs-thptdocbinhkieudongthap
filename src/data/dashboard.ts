import type { NavItem } from '../types';
import { TOTAL_PERSONNEL } from './personnel';

export const navItems: NavItem[] = [
  { label: 'Tổng quan', view: 'overview' },
  { label: 'Nhân sự', view: 'personnel', badge: String(TOTAL_PERSONNEL) },
  { label: 'Báo cáo', view: 'reports', badge: '1' },
  { label: 'Tài liệu', view: 'overview', badge: '9' },
  { label: 'Cài đặt', view: 'overview' },
];

export const stats = [
  { label: 'Tổng cán bộ', value: String(TOTAL_PERSONNEL), tone: 'blue' },
  { label: 'Giáo viên', value: '94', tone: 'purple' },
  { label: 'Nhân viên', value: '34', tone: 'green' },
  { label: 'Tổng số báo cáo', value: '246', tone: 'orange' },
];

export const departments = [
  { name: 'Ban Giám hiệu', count: 5, progress: 92 },
  { name: 'Tổ Văn phòng', count: 12, progress: 74 },
  { name: 'Tổ Toán', count: 16, progress: 88 },
  { name: 'Tổ Ngữ văn', count: 18, progress: 86 },
  { name: 'Tổ KHTN', count: 21, progress: 79 },
];

export const personnelStats = [
  { label: 'Đang làm việc', value: String(TOTAL_PERSONNEL), tone: 'purple' },
  { label: 'Chờ duyệt', value: '0', tone: 'orange' },
  { label: 'Nghỉ phép', value: '0', tone: 'blue' },
  { label: 'Tổng số đơn vị', value: '9', tone: 'green' },
];

export const reportRows = [
  { title: 'Báo cáo tuần giáo viên', dept: 'Tổ Toán', date: '10/08/2026', status: 'Đã duyệt', tone: 'success' },
  { title: 'Kết quả kiểm tra giữa kỳ', dept: 'THCS Đốc Binh Kiều', date: '09/08/2026', status: 'Chờ duyệt', tone: 'warning' },
  { title: 'Báo cáo hoạt động đoàn thể', dept: 'Ban Giám hiệu', date: '08/08/2026', status: 'Đang xử lý', tone: 'info' },
  { title: 'Tổng hợp hồ sơ nhân sự', dept: 'Tổ Văn phòng', date: '07/08/2026', status: 'Đã duyệt', tone: 'success' },
];

export const importExportStats = [
  { label: 'Dữ liệu đã nhập', value: '24.8K', tone: 'purple' },
  { label: 'File xuất', value: '184', tone: 'blue' },
  { label: 'Lỗi dữ liệu', value: '3', tone: 'orange' },
  { label: 'Tổng dung lượng', value: '2.4 GB', tone: 'green' },
];
