'use client';

import { DataTable, Column } from '@/components/common/data-table';
import { Badge } from '@/components/ui/badge';
import { demoAttendance, demoStudents, getProfileById, demoClasses, demoSubjects } from '@/lib/demo-data';
import { getAttendanceColor, formatDate } from '@/lib/utils';

export default function TeacherHistoryPage() {
  const records = demoAttendance.slice(0, 50).map(a => {
    const student = demoStudents.find(s => s.id === a.student_id);
    const profile = student ? getProfileById(student.profile_id) : null;
    return { ...a, studentName: profile?.full_name || '', className: demoClasses.find(c => c.id === a.class_id)?.name || '', subjectName: demoSubjects.find(s => s.id === a.subject_id)?.name || '' };
  });

  const columns: Column<typeof records[0]>[] = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'className', label: 'Class' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'attendance_date', label: 'Date', sortable: true, render: (_v, row) => <span>{formatDate(row.attendance_date)}</span> },
    { key: 'period_no', label: 'Period' },
    { key: 'status', label: 'Status', render: (_v, row) => <Badge className={getAttendanceColor(row.status)} variant="secondary">{row.status}</Badge> },
    { key: 'remarks', label: 'Remarks', render: (_v, row) => <span className="text-xs text-muted-foreground">{row.remarks || '-'}</span> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Attendance History</h1><p className="text-muted-foreground">View past attendance records</p></div>
      <DataTable columns={columns} data={records} searchPlaceholder="Search by student name..." />
    </div>
  );
}
