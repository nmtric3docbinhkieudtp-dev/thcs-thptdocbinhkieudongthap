export type UserRole = 'member' | 'admin';
export type ViewMode = 'overview' | 'personnel' | 'reports';

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  demo?: boolean;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: AppUser;
};

export type NavItem = {
  label: string;
  view: ViewMode;
  badge?: string;
};

export type PersonnelRecord = {
  id: number;
  name: string;
  position: string;
  unit: string;
  department: string;
  gender: string;
  birth: string;
  subject: string;
  status: 'Hoạt động' | 'Chờ duyệt' | 'Nghỉ phép';
};

export type ClassPosition = {
  title: string;
  name: string;
  grade: string;
  conduct: string;
  phone: string;
};

export type PrizeEntry = {
  competition: string;
  prize: string;
  studentNames: string;
};

export type FacilityItem = {
  name: string;
  quantity: number;
  unit: string;
  condition: string;
  notes: string;
};

export type AbsentStudent = {
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
