import { FormEvent, useState, useEffect } from 'react';
import {
  auth,
  firebaseLogout,
  firebaseSignIn,
  firebaseSignUp,
  isFirebaseConfigured,
  saveReportToFirestore,
  fetchAllReportsFromFirestore,
} from './firebase';
import { ReportPage } from './components/Reports/ReportPage';
import { PersonnelView } from './components/Personnel/PersonnelView';

type UserRole = 'member' | 'admin';
type ViewMode = 'overview' | 'personnel' | 'reports';

type AppUser = {
  id: string;
  email: string;
  role: UserRole;
  demo?: boolean;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: AppUser;
};

type NavItem = {
  label: string;
  view: ViewMode;
  badge?: string;
};

export type PersonnelRecord = {
  id: string | number;
  name: string;
  position: string;
  unit: string;
  department: string;
  gender: string;
  birth: string;
  subject: string;
  status: 'Hoạt động' | 'Chờ duyệt' | 'Nghỉ phép';
};

type ClassPosition = {
  title: string;
  name: string;
  grade: string;
  conduct: string;
  phone: string;
};

type PrizeEntry = {
  competition: string;
  prize: string;
  studentNames: string;
};

type FacilityItem = {
  name: string;
  quantity: number;
  unit: string;
  condition: string;
  notes: string;
};

type AbsentStudent = {
  name: string;
  prevClass: string;
  address: string;
  studentPhone: string;
  parentPhone: string;
  reason: string;
};

export type ReportSubmission = {
  id: string;
  submittedAt: string;
  gcvnName: string;
  gcvnEmail: string;
  className: string;
  meetingTime: string;
  meetingDate: string;
  meetingLocation: string;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  presentStudents: number;
  presentMale: number;
  presentFemale: number;
  absentStudents: number;
  academicStats: { excellent: number; good: number; satisfactory: number };
  conductStats: { excellent: number; good: number; satisfactory: number };
  partyMembers: number;
  locationStats: Record<string, number>;
  prizeEntries: PrizeEntry[];
  classPositions: ClassPosition[];
  facilities: FacilityItem[];
  assentStudentList: AbsentStudent[];
  gcvnOpinion: string;
};

const STORAGE_KEY = 'dbk-auth-session';
const REPORTS_STORAGE_KEY = 'dbk-report-submissions';
const ADMIN_EMAIL = 'nmtri.c3docbinhkieu@dongthap.edu.vn';

const TOTAL_PERSONNEL = 120;

const navItems: NavItem[] = [
  { label: 'Tổng quan', view: 'overview' },
  { label: 'Nhân sự', view: 'personnel', badge: String(TOTAL_PERSONNEL) },
  { label: 'Báo cáo', view: 'reports', badge: '1' },
  { label: 'Tài liệu', view: 'overview', badge: '9' },
  { label: 'Cài đặt', view: 'overview' },
];

const stats = [
  { label: 'Tổng cán bộ', value: String(TOTAL_PERSONNEL), tone: 'blue' },
  { label: 'Giáo viên', value: '94', tone: 'purple' },
  { label: 'Nhân viên', value: '34', tone: 'green' },
  { label: 'Tổng số báo cáo', value: '246', tone: 'orange' },
];

const departments = [
  { name: 'Ban Giám hiệu', count: 5, progress: 92 },
  { name: 'Tổ Văn phòng', count: 12, progress: 74 },
  { name: 'Tổ Toán', count: 16, progress: 88 },
  { name: 'Tổ Ngữ văn', count: 18, progress: 86 },
  { name: 'Tổ KHTN', count: 21, progress: 79 },
];

const personnelStats = [
  { label: 'Đang làm việc', value: String(TOTAL_PERSONNEL), tone: 'purple' },
  { label: 'Chờ duyệt', value: '0', tone: 'orange' },
  { label: 'Nghỉ phép', value: '0', tone: 'blue' },
  { label: 'Tổng số đơn vị', value: '9', tone: 'green' },
];

const reportRows = [
  { title: 'Báo cáo tuần giáo viên', dept: 'Tổ Toán', date: '10/08/2026', status: 'Đã duyệt', tone: 'success' },
  { title: 'Kết quả kiểm tra giữa kỳ', dept: 'THCS Đốc Binh Kiều', date: '09/08/2026', status: 'Chờ duyệt', tone: 'warning' },
  { title: 'Báo cáo hoạt động đoàn thể', dept: 'Ban Giám hiệu', date: '08/08/2026', status: 'Đang xử lý', tone: 'info' },
  { title: 'Tổng hợp hồ sơ nhân sự', dept: 'Tổ Văn phòng', date: '07/08/2026', status: 'Đã duyệt', tone: 'success' },
];

const importExportStats = [
  { label: 'Dữ liệu đã nhập', value: '24.8K', tone: 'purple' },
  { label: 'File xuất', value: '184', tone: 'blue' },
  { label: 'Lỗi dữ liệu', value: '3', tone: 'orange' },
  { label: 'Tổng dung lượng', value: '2.4 GB', tone: 'green' },
];

const personnelRecords: PersonnelRecord[] = [
  { id: 1, name: 'Lê Thanh Cường', position: 'Phó Hiệu trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '17/10/1975', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 2, name: 'Nguyễn Minh Trí', position: 'Phó Hiệu trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '23/10/1986', subject: 'Vật Lý', status: 'Hoạt động' },
  { id: 3, name: 'Phan Thanh Thảo', position: 'Hiệu trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '25/11/1966', subject: 'Lịch sử', status: 'Hoạt động' },
  { id: 4, name: 'Lê Hồng Thúy', position: 'Phó hiệu trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ban giám hiệu', gender: 'Nữ', birth: '17/07/1975', subject: 'GDCD', status: 'Hoạt động' },
  { id: 5, name: 'Lê Văn Nguyên', position: 'Phó hiệu trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '01/01/1975', subject: 'GDTC', status: 'Hoạt động' },
  { id: 6, name: 'Nguyễn Thanh Tòng', position: 'Hiệu trưởng', unit: 'Trường THCS Tân Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '04/08/1979', subject: 'KHTN', status: 'Hoạt động' },
  { id: 7, name: 'Lê Thị Ngọc Tuyền', position: 'Phó hiệu trưởng', unit: 'Trường THCS Tân Kiều', department: 'Ban giám hiệu', gender: 'Nữ', birth: '02/11/1990', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 8, name: 'Thái Văn Tiến', position: 'Phó hiệu trưởng', unit: 'Trường THCS Tân Kiều', department: 'Ban giám hiệu', gender: 'Nam', birth: '01/01/1978', subject: 'KHTN', status: 'Hoạt động' },
  { id: 9, name: 'Trần Văn Út', position: 'Kế toán', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '01/05/1976', subject: 'Kế toán', status: 'Hoạt động' },
  { id: 10, name: 'Minh Tho', position: 'Y tế', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '16/01/1990', subject: 'Y tế', status: 'Hoạt động' },
  { id: 11, name: 'Nguyễn Thị Kim Ngọc', position: 'Văn thư', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '18/07/1984', subject: 'Văn thư', status: 'Hoạt động' },
  { id: 12, name: 'Lý Huỳnh Mai', position: 'Nhân viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '01/01/1976', subject: 'Tạp vụ', status: 'Hoạt động' },
  { id: 13, name: 'Nguyễn Ngọc Cường', position: 'Bảo vệ', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '01/01/1970', subject: 'Bảo vệ', status: 'Hoạt động' },
  { id: 14, name: 'Nguyễn Văn Quân', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '21/07/1989', subject: 'Kế toán', status: 'Hoạt động' },
  { id: 15, name: 'Huỳnh Thị Thu Ngoan', position: 'Nhân viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '20/08/1993', subject: 'Văn thư', status: 'Hoạt động' },
  { id: 16, name: 'Trần Thị Bích Hạnh', position: 'Nhân viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '10/09/1988', subject: 'Y tế học đường', status: 'Hoạt động' },
  { id: 17, name: 'Nguyễn Văn Thuấn', position: 'Bảo vệ', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '01/01/1976', subject: 'Bảo vệ', status: 'Hoạt động' },
  { id: 18, name: 'Đinh Thị Hanh', position: 'Phục vụ', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '01/01/1977', subject: 'Phục vụ', status: 'Hoạt động' },
  { id: 19, name: 'Nguyễn Thị Thúy Huỳnh', position: 'Tổ trưởng', unit: 'Trường THCS Tân Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '09/09/1983', subject: 'Kế toán', status: 'Hoạt động' },
  { id: 20, name: 'Nguyễn Thị Kim Kha', position: 'Nhân viên', unit: 'Trường THCS Tân Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '28/09/1986', subject: 'Văn thư', status: 'Hoạt động' },
  { id: 21, name: 'Huỳnh Quang Huy', position: 'Bảo vệ', unit: 'Trường THCS Tân Kiều', department: 'Tổ Văn phòng', gender: 'Nam', birth: '24/11/1999', subject: 'Bảo vệ', status: 'Hoạt động' },
  { id: 22, name: 'Ngô Thị Hồng Thắm', position: 'Phục vụ', unit: 'Trường THCS Tân Kiều', department: 'Tổ Văn phòng', gender: 'Nữ', birth: '11/01/1979', subject: 'Phục vụ', status: 'Hoạt động' },
  { id: 23, name: 'Nguyễn Văn Tới', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '01/06/1982', subject: 'Toán', status: 'Hoạt động' },
  { id: 24, name: 'Trần Văn Giang', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '01/01/1977', subject: 'Toán', status: 'Hoạt động' },
  { id: 25, name: 'Lê Cao Toàn', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '01/07/1975', subject: 'Toán', status: 'Hoạt động' },
  { id: 26, name: 'Lê Văn Toàn', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '30/06/1983', subject: 'Toán', status: 'Hoạt động' },
  { id: 27, name: 'Võ Thị Ngọc Hương', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nữ', birth: '10/05/1982', subject: 'Toán', status: 'Hoạt động' },
  { id: 28, name: 'Nguyễn Thị Bích Lang', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nữ', birth: '25/09/1980', subject: 'Toán', status: 'Hoạt động' },
  { id: 29, name: 'Lê Thị Bình', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nữ', birth: '27/07/1975', subject: 'Toán', status: 'Hoạt động' },
  { id: 30, name: 'Nguyễn Thái Hùng', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '12/10/1980', subject: 'Toán', status: 'Hoạt động' },
  { id: 31, name: 'Nguyễn Văn Ngoan', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '07/10/1981', subject: 'Toán', status: 'Hoạt động' },
  { id: 32, name: 'Nguyễn Quốc Nguyễn', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '12/09/1982', subject: 'Toán', status: 'Hoạt động' },
  { id: 33, name: 'Nguyễn Văn Tài', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '10/10/1983', subject: 'Toán', status: 'Hoạt động' },
  { id: 34, name: 'Trần Quốc Huy', position: 'Tổ trưởng', unit: 'Trường THCS Tân Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '09/02/1982', subject: 'Toán', status: 'Hoạt động' },
  { id: 35, name: 'Lê Thị Ngọc Điệp', position: 'Tổ phó', unit: 'Trường THCS Tân Kiều', department: 'Tổ Toán', gender: 'Nữ', birth: '02/02/1978', subject: 'Toán', status: 'Hoạt động' },
  { id: 36, name: 'Nguyễn Thành Tín', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '13/10/1988', subject: 'Toán', status: 'Hoạt động' },
  { id: 37, name: 'Huỳnh Thị Huỳnh Nga', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Tổ Toán', gender: 'Nữ', birth: '16/11/1992', subject: 'Toán', status: 'Hoạt động' },
  { id: 38, name: 'Trần Văn Nhuận', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Tổ Toán', gender: 'Nam', birth: '14/01/1984', subject: 'Toán', status: 'Hoạt động' },
  { id: 39, name: 'Tô Thị Lắm', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '11/07/1983', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 40, name: 'Hồ Văn Nhịnh', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nam', birth: '22/04/1976', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 41, name: 'Lê Thị Mỹ Ny', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '01/01/1985', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 42, name: 'Trường Thị Mỹ Duyên', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '25/03/1975', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 43, name: 'Nguyễn Thị Xuyến', position: 'Thư viện', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '20/07/1986', subject: 'Thư viện', status: 'Hoạt động' },
  { id: 44, name: 'Trương Văn Nghĩa', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nam', birth: '01/01/1977', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 45, name: 'Phạm Thanh Lâm', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nam', birth: '04/04/1980', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 46, name: 'Nguyễn Thị Kim Xoa', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '10/07/1983', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 47, name: 'Hứa Thùy Dương', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '13/10/1985', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 48, name: 'Lê Thị Hoài An', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '29/09/1995', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 49, name: 'Hồ Văn Hữu', position: 'Thư viện', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nam', birth: '30/07/1982', subject: 'Thư viện', status: 'Hoạt động' },
  { id: 50, name: 'Huỳnh Thị Vân Nhi', position: 'Tổ trưởng', unit: 'Trường THCS Tân Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '01/01/1980', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 51, name: 'Nguyễn Thị Thảo', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '10/02/1978', subject: 'Ngữ văn', status: 'Hoạt động' },
  { id: 52, name: 'Trần Thị Ngọc Tý', position: 'Thư viện', unit: 'Trường THCS Tân Kiều', department: 'Ngữ văn - Thư viện', gender: 'Nữ', birth: '08/07/1984', subject: 'Thư viện', status: 'Hoạt động' },
  { id: 53, name: 'Trịnh Văn Sơn', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nam', birth: '25/05/1979', subject: 'Sử', status: 'Hoạt động' },
  { id: 54, name: 'Nguyễn Thị Bé Trang', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '15/04/1984', subject: 'Sử', status: 'Hoạt động' },
  { id: 55, name: 'Trần Văn Rỡ', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nam', birth: '21/08/1981', subject: 'Sử', status: 'Hoạt động' },
  { id: 56, name: 'Trần Phước Hòa', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nam', birth: '02/11/1982', subject: 'Địa', status: 'Hoạt động' },
  { id: 57, name: 'Ngô Anh Tuấn', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nam', birth: '22/11/1986', subject: 'Địa', status: 'Hoạt động' },
  { id: 58, name: 'Phạm Nguyễn Văn Trường', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '02/01/1995', subject: 'GDKT&PL', status: 'Hoạt động' },
  { id: 59, name: 'Lê Thị Kim The', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '18/08/1988', subject: 'Lịch sử', status: 'Hoạt động' },
  { id: 60, name: 'Nguyễn Quốc Tân', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nam', birth: '03/10/1987', subject: 'Lịch sử', status: 'Hoạt động' },
  { id: 61, name: 'Nguyễn Thị Kim Đỉnh', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '23/01/1988', subject: 'Địa lý', status: 'Hoạt động' },
  { id: 62, name: 'Nguyễn Thị Lý', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '01/01/1989', subject: 'Địa lý', status: 'Hoạt động' },
  { id: 63, name: 'Nguyễn Thị Xe', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '01/01/1978', subject: 'GDCD', status: 'Hoạt động' },
  { id: 64, name: 'Phạm Thị Mỹ Châu', position: 'Tổ phó', unit: 'Trường THCS Tân Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '27/04/1984', subject: 'LS-ĐL', status: 'Hoạt động' },
  { id: 65, name: 'Châu Thị Kim Hà', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '18/02/1984', subject: 'LS-ĐL', status: 'Hoạt động' },
  { id: 66, name: 'Nguyễn Thị Kim Sang', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '22/08/1988', subject: 'LS-ĐL', status: 'Hoạt động' },
  { id: 67, name: 'Nguyễn Mỹ Ngân', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Lịch sử - Địa lý - GDCD - GDKTPL', gender: 'Nữ', birth: '11/12/1988', subject: 'GDCD', status: 'Hoạt động' },
  { id: 68, name: 'Nguyễn Trung Hiếu', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '01/01/1984', subject: 'Tin học', status: 'Hoạt động' },
  { id: 69, name: 'Võ Thị Hiền Thi', position: 'Tổ phó', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '25/04/1985', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 70, name: 'Ngô Bảo Quốc', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '30/08/1970', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 71, name: 'Trương Sơn Bền', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '27/08/2000', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 72, name: 'Nguyễn Thị Vân Anh', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '08/11/1991', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 73, name: 'Đào Thị Ngọc Liên', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '02/11/1987', subject: 'Tin học', status: 'Hoạt động' },
  { id: 74, name: 'Lê Thị Thu Diễm', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '05/08/1980', subject: 'Tin học', status: 'Hoạt động' },
  { id: 75, name: 'Nguyễn Thị Mai Khanh', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '17/11/1981', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 76, name: 'Trần Thanh Hậu', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '02/08/1976', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 77, name: 'Hồ Mai Thảo', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '22/11/1975', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 78, name: 'Nguyễn Thị Thùy Dương', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '19/07/1982', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 79, name: 'Mai Phước Lộc', position: 'Tổ trưởng', unit: 'Trường THCS Tân Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '28/08/1982', subject: 'Tin học', status: 'Hoạt động' },
  { id: 80, name: 'Bùi Kim Phướng', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nữ', birth: '07/10/1989', subject: 'Tin học', status: 'Hoạt động' },
  { id: 81, name: 'Lê Minh Thành', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '01/01/1989', subject: 'Tiếng Anh', status: 'Hoạt động' },
  { id: 82, name: 'Lê Phước Hậu', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Ngoại ngữ - Tin học', gender: 'Nam', birth: '25/02/1980', subject: 'Tin học', status: 'Hoạt động' },
  { id: 83, name: 'Phạm Biên Thùy', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '01/01/1980', subject: 'Vật Lý', status: 'Hoạt động' },
  { id: 84, name: 'Trần Thị Ngọc Hiền', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '18/03/1983', subject: 'Vật Lý', status: 'Hoạt động' },
  { id: 85, name: 'Phan Thị Ngọc Thơ', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '06/08/1988', subject: 'Hóa', status: 'Hoạt động' },
  { id: 86, name: 'Phạm Long Phi', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '20/04/1982', subject: 'Hóa', status: 'Hoạt động' },
  { id: 87, name: 'Trần Thị Kiều', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '18/11/1980', subject: 'Hóa', status: 'Hoạt động' },
  { id: 88, name: 'Trần Thị Hậu', position: 'Tổ phó', unit: 'Trường THCS Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '01/01/1983', subject: 'Lý', status: 'Hoạt động' },
  { id: 89, name: 'Lê Thái Phương', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '01/01/1980', subject: 'Hóa', status: 'Hoạt động' },
  { id: 90, name: 'Võ Hoàng Toàn', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '10/04/1987', subject: 'Hóa', status: 'Hoạt động' },
  { id: 91, name: 'Nguyễn Thị Thắm', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '11/11/1981', subject: 'Lý', status: 'Hoạt động' },
  { id: 92, name: 'Trần Phi Hải', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '22/10/1977', subject: 'Công nghệ', status: 'Hoạt động' },
  { id: 93, name: 'Nguyễn Thị Bích Phượng', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nữ', birth: '14/04/1987', subject: 'KHTN', status: 'Hoạt động' },
  { id: 94, name: 'Võ Ngọc Đình Văn', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Vật lý - Hóa học - Công nghệ CN', gender: 'Nam', birth: '23/11/1995', subject: 'KHTN', status: 'Hoạt động' },
  { id: 95, name: 'Bùi Kim Huỳnh', position: 'Tổ trưởng', unit: 'Trường THPT Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '19/04/1986', subject: 'Sinh học', status: 'Hoạt động' },
  { id: 96, name: 'Cao Văn Tùng', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nam', birth: '17/07/1980', subject: 'Sinh học', status: 'Hoạt động' },
  { id: 97, name: 'Phạm Thị Lệ Huyên', position: 'Nhân viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '15/06/1988', subject: 'Thiết bị', status: 'Hoạt động' },
  { id: 98, name: 'Nguyễn Thị Hiếu', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '15/07/1980', subject: 'Sinh', status: 'Hoạt động' },
  { id: 99, name: 'Nguyễn Thị Cẩm Nhung', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '13/03/1983', subject: 'Sinh', status: 'Hoạt động' },
  { id: 100, name: 'Nguyễn Kim Ngân', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '28/10/1990', subject: 'Sinh', status: 'Hoạt động' },
  { id: 101, name: 'Hồ Thị Ngọc Tài', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '07/06/1989', subject: 'Sinh', status: 'Hoạt động' },
  { id: 102, name: 'Trần Thị Cẩm', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '01/01/1981', subject: 'Công nghệ', status: 'Hoạt động' },
  { id: 103, name: 'Lê Kim Ngân', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '17/04/1986', subject: 'Công nghệ', status: 'Hoạt động' },
  { id: 104, name: 'Nguyễn Văn Chữ', position: 'Nhân viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nam', birth: '01/01/1977', subject: 'Quản lý thiết bị', status: 'Hoạt động' },
  { id: 105, name: 'Phan Văn Tặt', position: 'Tổ trưởng', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nam', birth: '01/01/1968', subject: 'Công nghệ', status: 'Hoạt động' },
  { id: 106, name: 'Trần Kim Phương', position: 'Tổ phó', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '04/03/1981', subject: 'Sinh học', status: 'Hoạt động' },
  { id: 107, name: 'Đinh Thị Giàu', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '20/08/1989', subject: 'Sinh học', status: 'Hoạt động' },
  { id: 108, name: 'Nguyễn Thị Lụa', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '04/04/1979', subject: 'Sinh học', status: 'Hoạt động' },
  { id: 109, name: 'Nguyễn Thị Ngọc Diễm', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '21/02/1989', subject: 'Công nghệ', status: 'Hoạt động' },
  { id: 110, name: 'Trần Hoàng Yến Ngọc', position: 'Nhân viên', unit: 'Trường THCS Tân Kiều', department: 'Sinh Học - Công nghệ NN - TB', gender: 'Nữ', birth: '01/01/1990', subject: 'Thiết bị', status: 'Hoạt động' },
  { id: 111, name: 'Nguyễn Kim Rạng', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nữ', birth: '26/03/1986', subject: 'GDQPAN', status: 'Hoạt động' },
  { id: 112, name: 'Hồ Hoài Ngân', position: 'Giáo viên', unit: 'Trường THPT Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '06/07/1989', subject: 'Thể dục', status: 'Hoạt động' },
  { id: 113, name: 'Lê Minh Đạt', position: 'Tổ trưởng', unit: 'Trường THCS Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '10/10/1969', subject: 'Mỹ thuật', status: 'Hoạt động' },
  { id: 114, name: 'Lê Ngọc Ẩn', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '10/10/1983', subject: 'GDTC', status: 'Hoạt động' },
  { id: 115, name: 'Huỳnh Thanh Dân', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '05/12/1992', subject: 'GDTC', status: 'Hoạt động' },
  { id: 116, name: 'Nguyễn Thanh Hùng', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '25/02/1980', subject: 'GDTC', status: 'Hoạt động' },
  { id: 117, name: 'Lê Thị Tuyết Xanh', position: 'Giáo viên', unit: 'Trường THCS Đốc Binh Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nữ', birth: '06/03/1981', subject: 'Âm nhạc', status: 'Hoạt động' },
  { id: 118, name: 'Trần Thị Mỹ Quốc', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nữ', birth: '09/07/1986', subject: 'Mỹ thuật', status: 'Hoạt động' },
  { id: 119, name: 'Lê Văn Chính', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '01/01/1982', subject: 'GDTC', status: 'Hoạt động' },
  { id: 120, name: 'Nguyễn Anh Văn', position: 'Giáo viên', unit: 'Trường THCS Tân Kiều', department: 'GDTC - QPAN - Nghệ thuật', gender: 'Nam', birth: '23/06/1986', subject: 'Âm nhạc', status: 'Hoạt động' },
];

function getDemoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return 'demo-user';
}

function readStoredSession(): AuthSession | null {
  try {
    const sessionText = window.localStorage.getItem(STORAGE_KEY);
    return sessionText ? (JSON.parse(sessionText) as AuthSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: AuthSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function readStoredReports(): ReportSubmission[] {
  try {
    const reportsText = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    return reportsText ? (JSON.parse(reportsText) as ReportSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveReport(report: ReportSubmission) {
  const reports = readStoredReports();
  const existingIndex = reports.findIndex((r) => r.id === report.id);
  if (existingIndex >= 0) {
    reports[existingIndex] = report;
  } else {
    reports.push(report);
  }
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

function exportReportsAsJSON(): void {
  const reports = readStoredReports();
  const dataStr = JSON.stringify(reports, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bao_cao_tap_trung_hs_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function buildDemoSession(email: string): AuthSession {
  const isDocBinhKieuAdmin = email.toLowerCase().includes('admin');
  const demoUser: AppUser = {
    id: getDemoId(),
    email,
    role: isDocBinhKieuAdmin ? 'admin' : 'member',
    demo: true,
  };

  const demoSession: AuthSession = {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    user: demoUser,
  };

  saveSession(demoSession);
  return demoSession;
}

async function signInWithFirebase(email: string, password: string): Promise<AuthSession> {
  if (!isFirebaseConfigured || !auth) {
    return buildDemoSession(email);
  }

  const user = await firebaseSignIn(email, password);
  const userEmail = user.email ?? email;
  const isDocBinhKieuAdmin = userEmail.toLowerCase() === ADMIN_EMAIL;
  return {
    access_token: user.uid,
    refresh_token: user.refreshToken,
    user: {
      id: user.uid,
      email: userEmail,
      role: isDocBinhKieuAdmin ? 'admin' : 'member',
      demo: false,
    },
  };
}

async function signUpWithFirebase(email: string, password: string): Promise<AuthSession> {
  if (!isFirebaseConfigured || !auth) {
    return buildDemoSession(email);
  }

  const user = await firebaseSignUp(email, password);
  const userEmail = user.email ?? email;
  const isDocBinhKieuAdmin = userEmail.toLowerCase() === ADMIN_EMAIL;
  return {
    access_token: user.uid,
    refresh_token: user.refreshToken,
    user: {
      id: user.uid,
      email: userEmail,
      role: isDocBinhKieuAdmin ? 'admin' : 'member',
      demo: false,
    },
  };
}

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@dbk.edu.vn');
  const [password, setPassword] = useState('123456');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [view, setView] = useState<ViewMode>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportMode, setReportMode] = useState<'select' | 'form' | 'view'>('select');
  const [allReports, setAllReports] = useState<ReportSubmission[]>([]);
  
  // Report form state
  const [reportForm, setReportForm] = useState<Partial<ReportSubmission>>({
    id: '',
    submittedAt: new Date().toISOString(),
    gcvnName: '',
    gcvnEmail: session?.user.email || '',
    className: '',
    meetingTime: '',
    meetingDate: '03/9/2026',
    meetingLocation: '',
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    presentStudents: 0,
    presentMale: 0,
    presentFemale: 0,
    absentStudents: 0,
    academicStats: { excellent: 0, good: 0, satisfactory: 0 },
    conductStats: { excellent: 0, good: 0, satisfactory: 0 },
    partyMembers: 0,
    locationStats: {},
    prizeEntries: [],
    classPositions: [],
    facilities: [],
    assentStudentList: [],
    gcvnOpinion: '',
  });

  useEffect(() => {
    const existingSession = readStoredSession();
    if (existingSession) {
      setSession(existingSession);
    }
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      if (isFirebaseConfigured && session && !session.user.demo) {
        try {
          const cloudReports = await fetchAllReportsFromFirestore();
          setAllReports(cloudReports);
        } catch (err) {
          console.error("Lỗi khi tải báo cáo từ Firestore, chuyển sang LocalStorage:", err);
          setAllReports(readStoredReports());
        }
      } else {
        setAllReports(readStoredReports());
      }
    };
    loadReports();
  }, [session]);

  const filteredPersonnel = personnelRecords.filter((person) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;

    return [person.name, person.position, person.unit, person.department, person.subject]
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const nextSession = authMode === 'login'
        ? await signInWithFirebase(email, password)
        : await signUpWithFirebase(email, password);

      setSession(nextSession);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Xảy ra lỗi khi xác thực tài khoản.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await firebaseLogout();
      }
    } catch (error) {
      console.warn('Firebase logout warning:', error);
    }

    clearSession();
    setSession(null);
    setAuthMode('login');
  };

  const openNewReport = () => {
    setReportMode('form');
    setView('reports');
  };

  const handleSubmitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reportForm.className || !reportForm.gcvnName) {
      alert('Vui lòng điền đầy đủ thông tin lớp và tên GVCN');
      return;
    }
    
    const newReport: ReportSubmission = {
      id: `report-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      gcvnName: reportForm.gcvnName || '',
      gcvnEmail: session?.user.email || '',
      className: reportForm.className || '',
      meetingTime: reportForm.meetingTime || '',
      meetingDate: reportForm.meetingDate || '',
      meetingLocation: reportForm.meetingLocation || '',
      totalStudents: reportForm.totalStudents || 0,
      maleStudents: reportForm.maleStudents || 0,
      femaleStudents: reportForm.femaleStudents || 0,
      presentStudents: reportForm.presentStudents || 0,
      presentMale: reportForm.presentMale || 0,
      presentFemale: reportForm.presentFemale || 0,
      absentStudents: reportForm.absentStudents || 0,
      academicStats: reportForm.academicStats || { excellent: 0, good: 0, satisfactory: 0 },
      conductStats: reportForm.conductStats || { excellent: 0, good: 0, satisfactory: 0 },
      partyMembers: reportForm.partyMembers || 0,
      locationStats: reportForm.locationStats || {},
      prizeEntries: reportForm.prizeEntries || [],
      classPositions: reportForm.classPositions || [],
      facilities: reportForm.facilities || [],
      assentStudentList: reportForm.assentStudentList || [],
      gcvnOpinion: reportForm.gcvnOpinion || '',
    };
    
    setIsSubmitting(true);
    try {
      // Lưu cục bộ trước để không mất báo cáo nếu Firestore lỗi hoặc chờ quá lâu.
      saveReport(newReport);

      const localReports = readStoredReports();
      setAllReports(localReports);

      let syncedToCloud = false;
      let cloudSyncError = '';
      if (isFirebaseConfigured && session && !session.user.demo) {
        try {
          await saveReportToFirestore(newReport);
          const cloudReports = await fetchAllReportsFromFirestore();
          setAllReports(cloudReports);
          syncedToCloud = true;
        } catch (cloudError) {
          console.error('Không thể đồng bộ báo cáo lên Firestore:', cloudError);
          cloudSyncError = cloudError instanceof Error ? cloudError.message : String(cloudError);
        }
      }

      alert(syncedToCloud
        ? 'Báo cáo đã được gửi thành công lên hệ thống đám mây!'
        : `Báo cáo đã được lưu trên trình duyệt. Chưa đồng bộ được lên hệ thống đám mây.${cloudSyncError ? `\nChi tiết: ${cloudSyncError}` : ''}`);
      setReportMode('select');
      setReportForm({
        id: '',
        submittedAt: new Date().toISOString(),
        gcvnName: '',
        gcvnEmail: session?.user.email || '',
        className: '',
        meetingTime: '',
        meetingDate: '03/9/2026',
        meetingLocation: '',
        totalStudents: 0,
        maleStudents: 0,
        femaleStudents: 0,
        presentStudents: 0,
        presentMale: 0,
        presentFemale: 0,
        absentStudents: 0,
        academicStats: { excellent: 0, good: 0, satisfactory: 0 },
        conductStats: { excellent: 0, good: 0, satisfactory: 0 },
        partyMembers: 0,
        locationStats: {},
        prizeEntries: [],
        classPositions: [],
        facilities: [],
        assentStudentList: [],
        gcvnOpinion: '',
      });
    } catch (err) {
      console.error(err);
      alert('Không thể lưu báo cáo. Vui lòng kiểm tra lại dữ liệu và bộ nhớ trình duyệt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">DBK</div>
            <div>
              <small>Hệ thống quản lý</small>
              <h2>Trường THCS-THPT Đốc Binh Kiều</h2>
            </div>
          </div>

          <div className="auth-intro">
            <span>{authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
            <h1>{authMode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</h1>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@dbk.edu.vn"
                required
              />
            </label>

            <label>
              <span>Mật khẩu</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </label>

            <div className="auth-options">
              <label className="remember-box">
                <input type="checkbox" defaultChecked />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? 'Tạo tài khoản' : 'Đăng nhập'}
              </button>
            </div>

            {authError && <div className="auth-error">{authError}</div>}

            <button type="submit" className="primary-btn auth-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="school-app">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">DBK</div>
          <div>
            <small>Trường</small>
            <strong>THCS-THPT Đốc Binh Kiều</strong>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${view === item.view && item.label === 'Tổng quan' ? 'active' : item.label === 'Nhân sự' && view === 'personnel' ? 'active' : item.label === 'Báo cáo' && view === 'reports' ? 'active' : ''}`}
              onClick={() => {
                if (item.view === 'personnel') setView('personnel');
                else if (item.view === 'reports') setView('reports');
                else setView('overview');
              }}
            >
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Hệ thống báo cáo</p>
          <strong>12 báo cáo mới</strong>
          <button type="button">Xem chi tiết</button>
        </div>
      </aside>

      <main className="main-panel">
        {view === 'personnel' ? (
          <PersonnelView
            totalPersonnel={TOTAL_PERSONNEL}
            allPersonnel={personnelRecords}
            filteredPersonnel={filteredPersonnel}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onBackToOverview={() => setView('overview')}
          />
        ) : view === 'reports' ? (
          <ReportPage
            session={session}
            reportMode={reportMode}
            reportForm={reportForm}
            allReports={allReports}
            onModeChange={setReportMode}
            onFormChange={(updates) => setReportForm({...reportForm, ...updates})}
            onSubmitReport={handleSubmitReport}
            onExportJSON={exportReportsAsJSON}
            onBack={() => {
              if (reportMode === 'select') {
                setView('overview');
              } else {
                setReportMode('select');
              }
            }}
          />
        ) : (
          <>
            <header className="topbar">
              <div>
                <small>Chào mừng bạn trở lại</small>
                <h1>Dashboard trường THCS-THPT Đốc Binh Kiều</h1>
              </div>
              <div className="top-actions">
                <span className="user-pill">{session.user.role === 'admin' ? 'Quản trị' : 'Thành viên'} · {session.user.email}</span>
                <button type="button" className="ghost-btn" onClick={handleLogout}>Đăng xuất</button>
                <button type="button" className="primary-btn small" onClick={openNewReport}>+ Thêm báo cáo</button>
              </div>
            </header>

            <section className="hero-card">
              <div>
                <span className="eyebrow">Hệ thống quản lý trường học</span>
                <h2>Thống kê nhanh theo đơn vị</h2>
              </div>
              <div className="hero-stats">
                <div>
                  <strong>86%</strong>
                  <span>Độ hoàn thành</span>
                </div>
                <div>
                  <strong>24</strong>
                  <span>Chờ phê duyệt</span>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              {stats.map((stat) => (
                <article key={stat.label} className={`stats-card ${stat.tone}`}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3>Phân bổ theo tổ</h3>
                  <button type="button">Xuất Excel</button>
                </div>

                <div className="department-list">
                  {departments.map((dept) => (
                    <div key={dept.name} className="department-row">
                      <div className="department-meta">
                        <strong>{dept.name}</strong>
                        <span>{dept.count} người</span>
                      </div>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${dept.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Hoạt động gần đây</h3>
                  <button type="button">Xem tất cả</button>
                </div>

                <div className="activity-list">
                  <div className="activity-item">
                    <span className="dot green" />
                    <div>
                      <strong>Đã cập nhật báo cáo tuần</strong>
                      <small>08:30 sáng</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="dot orange" />
                    <div>
                      <strong>Thêm hồ sơ nhân sự</strong>
                      <small>Hôm qua</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="dot purple" />
                    <div>
                      <strong>Đã xuất dữ liệu thống kê</strong>
                      <small>2 ngày trước</small>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="personnel-module panel">
              <div className="module-header">
                <div>
                  <small>Phần 3</small>
                  <h3>Quản lý nhân sự</h3>
                </div>
                <div className="module-actions">
                  <button type="button" className="ghost-btn">Lọc</button>
                  <button type="button" className="primary-btn small">+ Thêm nhân sự</button>
                </div>
              </div>

              <div className="personnel-mini-stats">
                {personnelStats.map((item) => (
                  <div key={item.label} className={`mini-stat ${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="personnel-layout">
                <div className="personnel-list">
                  <div className="search-box">
                    <span>🔎</span>
                    <input type="text" value="Tìm kiếm nhân sự" readOnly />
                  </div>

                  {personnelRecords.slice(0, 5).map((person) => (
                    <div key={person.id} className="person-card">
                      <div className="person-avatar">{person.name.split(' ').slice(-1)[0][0]}</div>
                      <div className="person-copy">
                        <strong>{person.name}</strong>
                        <small>{person.position}</small>
                        <span>{person.unit}</span>
                      </div>
                      <span className={`status ${person.status === 'Hoạt động' ? 'active' : person.status === 'Chờ duyệt' ? 'pending' : 'inactive'}`}>
                        {person.status}
                      </span>
                    </div>
                  ))}
                </div>

                <form className="personnel-form">
                  <div className="form-header">
                    <h4>Thông tin cá nhân</h4>
                    <button type="button" className="tiny-tag">Lưu</button>
                  </div>

                  <div className="field-grid">
                    <label>
                      <span>Họ và tên</span>
                      <input type="text" value="Lê Thanh Cường" readOnly />
                    </label>
                    <label>
                      <span>Ngày sinh</span>
                      <input type="text" value="17/10/1975" readOnly />
                    </label>
                    <label>
                      <span>Chức vụ</span>
                      <input type="text" value="Phó Hiệu trưởng" readOnly />
                    </label>
                    <label>
                      <span>Đơn vị</span>
                      <input type="text" value="THPT Đốc Binh Kiều" readOnly />
                    </label>
                    <label>
                      <span>Điện thoại</span>
                      <input type="text" value="0912 345 678" readOnly />
                    </label>
                    <label>
                      <span>Email</span>
                      <input type="text" value="hieu.truong@dbk.edu.vn" readOnly />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="secondary-btn">Xem hồ sơ</button>
                    <button type="button" className="primary-btn small">Cập nhật</button>
                  </div>
                </form>
              </div>
            </section>

            <section className="report-module panel">
              <div className="module-header">
                <div>
                  <small>Phần 4</small>
                  <h3>Quản lý báo cáo & tài liệu</h3>
                </div>
                <div className="module-actions">
                  <button type="button" className="ghost-btn">Xuất file</button>
                  <button type="button" className="primary-btn small" onClick={openNewReport}>+ Tạo báo cáo</button>
                </div>
              </div>

              <div className="report-grid">
                <div className="report-list">
                  {reportRows.map((report) => (
                    <div key={report.title} className="report-row">
                      <div className="report-copy">
                        <strong>{report.title}</strong>
                        <span>{report.dept}</span>
                        <small>{report.date}</small>
                      </div>
                      <span className={`report-badge ${report.tone}`}>{report.status}</span>
                    </div>
                  ))}
                </div>

                <div className="upload-panel">
                  <div className="upload-box">
                    <div className="upload-icon">⇪</div>
                    <strong>Upload tài liệu</strong>
                    <span>Kéo file vào đây hoặc chọn từ máy tính</span>
                    <button type="button" className="primary-btn small">Chọn tệp</button>
                  </div>

                  <div className="attachment-list">
                    <div className="attachment-item">
                      <span>📄</span>
                      <div>
                        <strong>bao-cao-tuan-08.docx</strong>
                        <small>1.2 MB</small>
                      </div>
                    </div>
                    <div className="attachment-item">
                      <span>📎</span>
                      <div>
                        <strong>thong-ke-giao-vien.xlsx</strong>
                        <small>890 KB</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="import-export panel">
              <div className="module-header">
                <div>
                  <small>Phần 5</small>
                  <h3>Import & Export dữ liệu</h3>
                </div>
                <div className="module-actions">
                  <button type="button" className="ghost-btn">Lịch sử nhập</button>
                  <button type="button" className="primary-btn small">Xuất Excel</button>
                </div>
              </div>

              <div className="import-export-stats">
                {importExportStats.map((item) => (
                  <div key={item.label} className={`mini-stat ${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="import-export-grid">
                <div className="import-box">
                  <h4>Nhập dữ liệu</h4>
                  <div className="drop-zone">
                    <div className="drop-icon">⇩</div>
                    <span>Drop file Excel / CSV vào đây</span>
                    <button type="button" className="primary-btn small">Chọn tệp</button>
                  </div>
                </div>

                <div className="export-box">
                  <h4>Xuất dữ liệu</h4>
                  <div className="export-actions">
                    <button type="button" className="secondary-btn">Xuất Excel</button>
                    <button type="button" className="secondary-btn">Xuất CSV</button>
                    <button type="button" className="primary-btn small">Tải xuống</button>
                  </div>

                  <div className="export-summary">
                    <div>
                      <span>Định dạng</span>
                      <strong>.xlsx</strong>
                    </div>
                    <div>
                      <span>Hiệu lực</span>
                      <strong>Hôm nay</strong>
                    </div>
                    <div>
                      <span>Người tạo</span>
                      <strong>Ban quản trị</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
