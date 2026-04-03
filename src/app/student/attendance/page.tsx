'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoAttendance, demoStudents, getProfileById } from '@/lib/demo-data';
import { getAttendanceColor, getAttendanceDotColor, formatDate, cn } from '@/lib/utils';

export default function StudentAttendancePage() {
  const student = demoStudents[0];
  const records = demoAttendance.filter(a => a.student_id === student.id).sort((a, b) => b.attendance_date.localeCompare(a.attendance_date));

  // Build calendar data for March 2025
  const year = 2025; const month = 2; // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays: { day: number; status?: string }[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push({ day: 0 });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rec = records.find(r => r.attendance_date === dateStr);
    calendarDays.push({ day: d, status: rec?.status });
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">My Attendance</h1><p className="text-muted-foreground">View your attendance calendar and history</p></div>

      {/* Calendar */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">March 2025</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <div key={i} className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative",
                d.day === 0 && "invisible",
                d.status && "cursor-pointer hover:ring-2 hover:ring-blue-300",
                !d.status && d.day !== 0 && "bg-muted/20",
                d.status === 'present' && "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700",
                d.status === 'absent' && "bg-red-100 dark:bg-red-950/30 text-red-700",
                d.status === 'late' && "bg-amber-100 dark:bg-amber-950/30 text-amber-700",
                d.status === 'excused' && "bg-blue-100 dark:bg-blue-950/30 text-blue-700",
                d.status === 'leave' && "bg-purple-100 dark:bg-purple-950/30 text-purple-700",
              )}>
                <span className="font-medium">{d.day || ''}</span>
                {d.status && <div className={cn("w-1.5 h-1.5 rounded-full mt-0.5", getAttendanceDotColor(d.status))} />}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            {['present', 'absent', 'late', 'excused', 'leave'].map(s => (
              <div key={s} className="flex items-center gap-1.5 text-xs"><div className={cn("w-3 h-3 rounded", getAttendanceDotColor(s))} /><span className="capitalize">{s}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {records.slice(0, 20).map(rec => (
              <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={cn("w-3 h-3 rounded-full shrink-0", getAttendanceDotColor(rec.status))} />
                <div className="flex-1"><p className="text-sm font-medium">{formatDate(rec.attendance_date, 'long')}</p>{rec.remarks && <p className="text-xs text-muted-foreground">{rec.remarks}</p>}</div>
                <Badge className={getAttendanceColor(rec.status)} variant="secondary">{rec.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
