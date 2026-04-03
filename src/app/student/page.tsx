'use client';

import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { demoAttendance, demoStudents, demoClasses, demoSections, getStudentAttendanceStats, demoLeaveRequests, demoNotifications, getProfileById } from '@/lib/demo-data';
import { getAttendanceColor, getAttendanceDotColor, formatDate, cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Link from 'next/link';
import { CalendarCheck, FileText, Bell, ArrowRight, TrendingUp } from 'lucide-react';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7'];

export default function StudentDashboard() {
  // Demo student: st1 (Alex Johnson)
  const student = demoStudents[0];
  const profile = getProfileById(student.profile_id)!;
  const stats = getStudentAttendanceStats(student.id);
  const cls = demoClasses.find(c => c.id === student.class_id)!;
  const section = demoSections.find(s => s.id === student.section_id)!;
  const myLeaves = demoLeaveRequests.filter(l => l.student_id === student.id);
  const myNotifications = demoNotifications.filter(n => !n.recipient_role || n.recipient_role === 'student' || n.recipient_user_id === profile.id).slice(0, 4);
  const recentAttendance = demoAttendance.filter(a => a.student_id === student.id).sort((a, b) => b.attendance_date.localeCompare(a.attendance_date)).slice(0, 10);

  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
    { name: 'Excused', value: stats.excused },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile.full_name} • {cls.name} - Section {section.name}</p>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${stats.percentage}%`} icon="CalendarCheck" color={stats.percentage >= 75 ? 'green' : 'red'} change={stats.percentage >= 75 ? 'Above minimum' : 'Below 75% minimum'} changeType={stats.percentage >= 75 ? 'positive' : 'negative'} />
        <StatCard title="Days Present" value={stats.present} icon="CheckCircle2" color="green" change={`of ${stats.total} total`} changeType="neutral" />
        <StatCard title="Days Absent" value={stats.absent} icon="XCircle" color="red" />
        <StatCard title="Late Arrivals" value={stats.late} icon="Clock" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Pie */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base">Attendance Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress to 75%</span>
                <span className="font-semibold">{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Attendance</CardTitle>
            <Link href="/student/attendance"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAttendance.map(rec => (
                <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={cn("w-3 h-3 rounded-full", getAttendanceDotColor(rec.status))} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{formatDate(rec.attendance_date, 'long')}</p>
                    {rec.remarks && <p className="text-xs text-muted-foreground">{rec.remarks}</p>}
                  </div>
                  <Badge className={getAttendanceColor(rec.status)} variant="secondary">{rec.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Requests */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Leave Requests</CardTitle>
            <Link href="/student/leave"><Button variant="ghost" size="sm" className="text-xs">Apply <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            {myLeaves.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">No leave requests</p>
            ) : myLeaves.map(l => (
              <div key={l.id} className="p-3 rounded-lg bg-muted/30 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{formatDate(l.from_date)} - {formatDate(l.to_date)}</p>
                  <Badge className={l.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : l.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'} variant="secondary">{l.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{l.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Notifications</CardTitle>
            <Link href="/student/notifications"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myNotifications.map(n => (
                <div key={n.id} className={`p-3 rounded-lg ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-950/10' : 'bg-muted/20'}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    <p className="text-sm font-medium">{n.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
