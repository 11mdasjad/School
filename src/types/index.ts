// ============================================================
// Smart School Attendance Portal — TypeScript Type Definitions
// ============================================================

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'leave';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export type Gender = 'male' | 'female' | 'other';

// ---- Database Models ----

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  grade_level: string;
  academic_year_id: string;
  created_at: string;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
  created_at: string;
  class?: Class;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  profile_id: string;
  employee_id: string;
  specialization?: string;
  created_at: string;
  profile?: Profile;
}

export interface Parent {
  id: string;
  profile_id: string;
  relationship: string;
  created_at: string;
  profile?: Profile;
}

export interface Student {
  id: string;
  profile_id: string;
  admission_no: string;
  roll_no: string;
  class_id: string;
  section_id: string;
  parent_id?: string;
  dob?: string;
  gender?: Gender;
  address?: string;
  photo_url?: string;
  created_at: string;
  profile?: Profile;
  class?: Class;
  section?: Section;
  parent?: Parent;
}

export interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  created_at: string;
  teacher?: Teacher;
  class?: Class;
  section?: Section;
  subject?: Subject;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  subject_id?: string;
  attendance_date: string;
  period_no?: number;
  status: AttendanceStatus;
  remarks?: string;
  marked_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
}

export interface AttendanceAuditLog {
  id: string;
  attendance_id: string;
  old_status: AttendanceStatus;
  new_status: AttendanceStatus;
  old_remarks?: string;
  new_remarks?: string;
  changed_by: string;
  change_reason?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  requested_by: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: LeaveRequestStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  student?: Student;
  requester?: Profile;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_role?: UserRole;
  recipient_user_id?: string;
  created_by: string;
  is_read: boolean;
  created_at: string;
}

export interface Holiday {
  id: string;
  title: string;
  holiday_date: string;
  description?: string;
  academic_year_id: string;
  created_at: string;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  logo_url?: string;
  minimum_attendance_percentage: number;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// ---- UI / Component Types ----

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterState {
  search: string;
  class_id?: string;
  section_id?: string;
  subject_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}
