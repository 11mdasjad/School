import { UserRole } from '@/types';

export const APP_NAME = 'Royal International Public School';
export const APP_SHORT_NAME = 'RIPS';

export const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Present', color: 'bg-emerald-500' },
  { value: 'absent', label: 'Absent', color: 'bg-red-500' },
  { value: 'late', label: 'Late', color: 'bg-amber-500' },
  { value: 'excused', label: 'Excused', color: 'bg-blue-500' },
  { value: 'leave', label: 'Leave', color: 'bg-purple-500' },
] as const;

export const LEAVE_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access and management' },
  { value: 'teacher', label: 'Teacher', description: 'Manage attendance for assigned classes' },
  { value: 'student', label: 'Student', description: 'View your attendance records' },
  { value: 'parent', label: 'Parent', description: 'Monitor your child\'s attendance' },
];

export const NAV_ITEMS: Record<UserRole, { title: string; href: string; icon: string; badge?: number }[]> = {
  admin: [
    { title: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { title: 'Students', href: '/admin/students', icon: 'GraduationCap' },
    { title: 'Teachers', href: '/admin/teachers', icon: 'Users' },
    { title: 'Parents', href: '/admin/parents', icon: 'UserCheck' },
    { title: 'Classes', href: '/admin/classes', icon: 'School' },
    { title: 'Subjects', href: '/admin/subjects', icon: 'BookOpen' },
    { title: 'Assignments', href: '/admin/assignments', icon: 'ClipboardList' },
    { title: 'Attendance', href: '/admin/attendance', icon: 'CalendarCheck' },
    { title: 'Reports', href: '/admin/reports', icon: 'BarChart3' },
    { title: 'Leave Requests', href: '/admin/leave-requests', icon: 'FileText', badge: 3 },
    { title: 'Holidays', href: '/admin/holidays', icon: 'Calendar' },
    { title: 'Notifications', href: '/admin/notifications', icon: 'Bell' },
    { title: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
  teacher: [
    { title: 'Dashboard', href: '/teacher', icon: 'LayoutDashboard' },
    { title: 'Mark Attendance', href: '/teacher/attendance', icon: 'CalendarCheck' },
    { title: 'History', href: '/teacher/history', icon: 'History' },
    { title: 'My Students', href: '/teacher/students', icon: 'GraduationCap' },
    { title: 'Reports', href: '/teacher/reports', icon: 'BarChart3' },
    { title: 'Leave Requests', href: '/teacher/leave-requests', icon: 'FileText', badge: 2 },
    { title: 'Notifications', href: '/teacher/notifications', icon: 'Bell' },
    { title: 'Profile', href: '/teacher/profile', icon: 'User' },
  ],
  student: [
    { title: 'Dashboard', href: '/student', icon: 'LayoutDashboard' },
    { title: 'My Attendance', href: '/student/attendance', icon: 'CalendarCheck' },
    { title: 'Leave Requests', href: '/student/leave', icon: 'FileText' },
    { title: 'Notifications', href: '/student/notifications', icon: 'Bell' },
    { title: 'Profile', href: '/student/profile', icon: 'User' },
  ],
  parent: [
    { title: 'Dashboard', href: '/parent', icon: 'LayoutDashboard' },
    { title: 'Child Attendance', href: '/parent/attendance', icon: 'CalendarCheck' },
    { title: 'Leave Requests', href: '/parent/leave', icon: 'FileText' },
    { title: 'Notifications', href: '/parent/notifications', icon: 'Bell' },
    { title: 'Profile', href: '/parent/profile', icon: 'User' },
  ],
};

export const DEMO_CREDENTIALS: Record<UserRole, { phone: string; password: string; name: string }> = {
  admin: { phone: '9876543210', password: 'admin123', name: 'Dr. Anita Sharma' },
  teacher: { phone: '9965092443', password: 'teacher123', name: 'Ms. Riya Goyal' },
  student: { phone: '7068632731', password: 'student123', name: 'Riya Rastogi' },
  parent: { phone: '7068632731', password: 'parent123', name: 'Gaurav Rastogi' },
};

export const PERIODS = [
  { value: 1, label: 'Period 1 (8:00 - 8:45)' },
  { value: 2, label: 'Period 2 (8:45 - 9:30)' },
  { value: 3, label: 'Period 3 (9:45 - 10:30)' },
  { value: 4, label: 'Period 4 (10:30 - 11:15)' },
  { value: 5, label: 'Period 5 (11:30 - 12:15)' },
  { value: 6, label: 'Period 6 (12:15 - 1:00)' },
  { value: 7, label: 'Period 7 (2:00 - 2:45)' },
  { value: 8, label: 'Period 8 (2:45 - 3:30)' },
];
