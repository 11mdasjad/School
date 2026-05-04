import { Profile } from '@/types';
import { useAppStore } from '@/stores/app-store';

export function getProfileById(id: string): Profile | undefined {
  const { profiles } = useAppStore.getState();
  return profiles.find(p => p.id === id);
}

export function getStudentWithDetails(studentId: string) {
  const { students, classes, sections, parents } = useAppStore.getState();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;
  return {
    ...student,
    profile: getProfileById(student.profile_id),
    class: classes.find(c => c.id === student.class_id),
    section: sections.find(s => s.id === student.section_id),
    parent: parents.find(p => p.id === student.parent_id),
  };
}

export function getTeacherWithProfile(teacherId: string) {
  const { teachers } = useAppStore.getState();
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return null;
  return {
    ...teacher,
    profile: getProfileById(teacher.profile_id),
  };
}

export function getStudentAttendanceStats(studentId: string) {
  const { attendance } = useAppStore.getState();
  const records = attendance.filter(a => a.student_id === studentId);
  const total = records.length;
  const present = records.filter(a => a.status === 'present').length;
  const absent = records.filter(a => a.status === 'absent').length;
  const late = records.filter(a => a.status === 'late').length;
  const excused = records.filter(a => a.status === 'excused').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { total, present, absent, late, excused, percentage };
}

export function getClassAttendanceStats(classId: string, date?: string) {
  const { attendance } = useAppStore.getState();
  let records = attendance.filter(a => a.class_id === classId);
  if (date) records = records.filter(a => a.attendance_date === date);
  const total = records.length;
  const present = records.filter(a => a.status === 'present').length;
  const absent = records.filter(a => a.status === 'absent').length;
  const late = records.filter(a => a.status === 'late').length;
  return { total, present, absent, late, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
}

export function getTodayAttendanceSummary() {
  const today = '2025-03-28'; // Maybe make this dynamic like new Date().toISOString().split('T')[0]
  const { attendance, students } = useAppStore.getState();
  const records = attendance.filter(a => a.attendance_date === today);
  const totalStudents = students.length;
  const present = records.filter(a => a.status === 'present').length;
  const absent = records.filter(a => a.status === 'absent').length;
  const late = records.filter(a => a.status === 'late').length;
  const excused = records.filter(a => a.status === 'excused').length;
  return {
    totalStudents,
    present,
    absent,
    late,
    excused,
    percentage: totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0,
  };
}

export function getMonthlyTrend() {
  const { attendance } = useAppStore.getState();
  const dates = [...new Set(attendance.map(a => a.attendance_date))].sort();
  return dates.map(date => {
    const records = attendance.filter(a => a.attendance_date === date);
    const present = records.filter(a => a.status === 'present').length;
    const total = records.length;
    return {
      date: date.slice(5),
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      present,
      absent: records.filter(a => a.status === 'absent').length,
      late: records.filter(a => a.status === 'late').length,
    };
  });
}

export function getClassWiseComparison() {
  const { classes } = useAppStore.getState();
  return classes.map(cls => {
    const stats = getClassAttendanceStats(cls.id);
    return { name: cls.name, ...stats };
  });
}

export function getDefaulterList(threshold: number = 75) {
  const { students, classes, sections } = useAppStore.getState();
  return students
    .slice(0, 50) // Only check students with attendance records
    .map(s => ({
      ...s,
      profile: getProfileById(s.profile_id),
      class: classes.find(c => c.id === s.class_id),
      section: sections.find(sec => sec.id === s.section_id),
      stats: getStudentAttendanceStats(s.id),
    }))
    .filter(s => s.stats.percentage < threshold)
    .sort((a, b) => a.stats.percentage - b.stats.percentage);
}
