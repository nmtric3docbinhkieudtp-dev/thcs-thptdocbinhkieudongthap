import type { AbsentStudent, ClassPosition, FacilityItem, PrizeEntry } from '../types';

export const LOCATION_OPTIONS = [
  'Xã Đốc Binh Kiều',
  'Xã Tháp Mười',
  'Xã Thanh Mỹ',
  'Xã Trường Xuân',
  'Các xã khác',
];

export const PRIZE_COMPETITIONS = [
  'Văn nghệ vòng tỉnh, vòng xã',
  'Hội khỏe phù đổng',
  'Giải thể thao học sinh tỉnh Đồng Tháp',
  'Sáng tạo thanh thiếu niên nhi đồng',
  'Khoa học kỹ thuật',
  'Vẽ tranh',
  'Phong trào khác',
  'Thành tích khác',
];

export const CLASS_POSITION_TITLES = [
  'Lớp trưởng',
  'Lớp phó học tập',
  'Phó văn thể',
  'Phó lao động',
  'Phó trật tự',
  'Thư ký',
  'Thủ quỹ',
  'Tổ trưởng tổ 1',
  'Tổ trưởng tổ 2',
  'Tổ trưởng tổ 3',
  'Tổ trưởng tổ 4',
  'Tổ trưởng tổ 5',
  'Tổ trưởng tổ 6',
];

export const FACILITY_ITEMS: { name: string; unit: string }[] = [
  { name: 'Quạt trần', unit: 'Cái' },
  { name: 'Bóng đèn', unit: 'Bóng' },
  { name: 'Bàn ghế giáo viên', unit: 'Bộ' },
  { name: 'Bàn học sinh', unit: 'Cái' },
  { name: 'Ghế học sinh', unit: 'Cái' },
  { name: 'Kính cửa sổ', unit: 'Cái' },
  { name: 'Kính cửa chính', unit: 'Cái' },
];

export const ABSENT_STUDENT_ROWS = 10;

export function createDefaultLocationStats(): Record<string, number> {
  return LOCATION_OPTIONS.reduce<Record<string, number>>((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});
}

export function createDefaultPrizeEntries(): PrizeEntry[] {
  return PRIZE_COMPETITIONS.map((competition) => ({ competition, prize: '', studentNames: '' }));
}

export function createDefaultClassPositions(): ClassPosition[] {
  return CLASS_POSITION_TITLES.map((title) => ({ title, name: '', grade: '', conduct: '', phone: '' }));
}

export function createDefaultFacilities(): FacilityItem[] {
  return FACILITY_ITEMS.map((item) => ({
    name: item.name,
    quantity: 0,
    unit: item.unit,
    condition: '',
    notes: '',
  }));
}

export function createDefaultAbsentStudents(): AbsentStudent[] {
  return Array.from({ length: ABSENT_STUDENT_ROWS }, () => ({
    name: '',
    prevClass: '',
    address: '',
    studentPhone: '',
    parentPhone: '',
    reason: '',
  }));
}
