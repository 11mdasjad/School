import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  demoProfiles,
  demoClasses,
  demoSections,
  demoSubjects,
  demoTeachers,
  demoParents,
  demoStudents,
  demoAssignments,
  demoAttendance,
  demoLeaveRequests,
  demoNotifications,
  demoHolidays,
  demoSchoolSettings,
} from '@/lib/demo-data';
import type { AttendanceRecord, LeaveRequest, Notification, Profile, Parent, Student, Class, Holiday, Subject, TeacherAssignment, SchoolSettings } from '@/types';

interface AppState {
  profiles: typeof demoProfiles;
  classes: typeof demoClasses;
  sections: typeof demoSections;
  subjects: typeof demoSubjects;
  teachers: typeof demoTeachers;
  parents: typeof demoParents;
  students: typeof demoStudents;
  assignments: typeof demoAssignments;
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  holidays: typeof demoHolidays;
  schoolSettings: typeof demoSchoolSettings;

  // Actions
  addAttendance: (records: AttendanceRecord[]) => void;
  updateLeaveRequestStatus: (id: string, status: 'approved' | 'rejected', adminId: string) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  resetAttendance: () => void;
  addParent: (profile: Profile, parent: Parent, student: Student) => void;
  addClass: (newClass: Class) => void;
  addHoliday: (holiday: Holiday) => void;
  addSubject: (subject: Subject) => void;
  addAssignment: (assignment: TeacherAssignment) => void;
  updateSchoolSettings: (settings: SchoolSettings) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profiles: demoProfiles,
      classes: demoClasses,
      sections: demoSections,
      subjects: demoSubjects,
      teachers: demoTeachers,
      parents: demoParents,
      students: demoStudents,
      assignments: demoAssignments,
      attendance: demoAttendance,
      leaveRequests: demoLeaveRequests,
      notifications: demoNotifications,
      holidays: demoHolidays,
      schoolSettings: demoSchoolSettings,

      addAttendance: (records) =>
        set((state) => {
          // Filter out existing records for the same student, date, and period to avoid duplicates
          const newRecordsIds = new Set(records.map((r) => `${r.student_id}-${r.attendance_date}-${r.period_no}`));
          const filteredAttendance = state.attendance.filter(
            (a) => !newRecordsIds.has(`${a.student_id}-${a.attendance_date}-${a.period_no}`)
          );
          return { attendance: [...filteredAttendance, ...records] };
        }),

      updateLeaveRequestStatus: (id, status, adminId) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((lr) =>
            lr.id === id
              ? { ...lr, status, approved_by: adminId, approved_at: new Date().toISOString() }
              : lr
          ),
        })),

      addLeaveRequest: (request) =>
        set((state) => ({
          leaveRequests: [request, ...state.leaveRequests],
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        })),

      resetAttendance: () =>
        set(() => ({
          attendance: [],
        })),

      addParent: (profile, parent, student) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
          parents: [...state.parents, parent],
          students: [...state.students, student],
        })),

      addClass: (newClass) =>
        set((state) => ({
          classes: [...state.classes, newClass],
        })),

      addHoliday: (holiday) =>
        set((state) => ({
          holidays: [...state.holidays, holiday],
        })),

      addSubject: (subject) =>
        set((state) => ({
          subjects: [...state.subjects, subject],
        })),

      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [...state.assignments, assignment],
        })),

      updateSchoolSettings: (settings) =>
        set(() => ({
          schoolSettings: settings,
        })),
    }),
    {
      name: 'school-app-storage',
      // We only want to persist mutable state. Wait, if we persist everything,
      // updates to demo-data.ts (like adding new students in excel) won't be reflected
      // if localStorage is already set. So we should only persist mutable slices,
      // or just persist everything but know that a clear storage is needed to reload.
      // For simplicity, we persist the whole state.
    }
  )
);
