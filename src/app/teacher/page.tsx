'use client';

import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { demoAssignments, demoClasses, demoSections, demoSubjects, demoStudents, getProfileById, getTodayAttendanceSummary, demoLeaveRequests } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { CalendarCheck, ArrowRight, Users, BookOpen, Clock } from 'lucide-react';

export default function TeacherDashboard() {
  const todayStats = getTodayAttendanceSummary();
  // Teacher t1 (James Anderson) assignments
  const myAssignments = demoAssignments.filter(a => a.teacher_id === 't1');
  const myClasses = [...new Set(myAssignments.map(a => a.class_id))];
  const myStudentCount = demoStudents.filter(s => myClasses.includes(s.class_id)).length;
  const pendingLeaves = demoLeaveRequests.filter(l => l.status === 'pending').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, James Anderson</p>
        </div>
        <Link href="/teacher/attendance">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CalendarCheck className="w-4 h-4 mr-2" /> Mark Attendance
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Classes" value={myClasses.length} icon="Users" color="blue" change={`${myAssignments.length} assignments`} changeType="neutral" />
        <StatCard title="My Students" value={myStudentCount} icon="GraduationCap" color="purple" />
        <StatCard title="Today's Attendance" value={`${todayStats.percentage}%`} icon="CalendarCheck" color="green" change={`${todayStats.present} present`} changeType="positive" />
        <StatCard title="Pending Leaves" value={pendingLeaves.length} icon="FileText" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Classes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">My Assigned Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAssignments.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{demoClasses.find(c => c.id === a.class_id)?.name} - Section {demoSections.find(s => s.id === a.section_id)?.name}</p>
                    <p className="text-xs text-muted-foreground">{demoSubjects.find(s => s.id === a.subject_id)?.name}</p>
                  </div>
                  <Link href="/teacher/attendance">
                    <Button variant="ghost" size="sm" className="text-xs">Mark <ArrowRight className="w-3 h-3 ml-1" /></Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Mark Attendance', href: '/teacher/attendance', icon: CalendarCheck, color: 'from-emerald-500 to-teal-500' },
                { title: 'View History', href: '/teacher/history', icon: Clock, color: 'from-blue-500 to-indigo-500' },
                { title: 'My Students', href: '/teacher/students', icon: Users, color: 'from-purple-500 to-pink-500' },
                { title: 'Leave Requests', href: '/teacher/leave-requests', icon: BookOpen, color: 'from-amber-500 to-orange-500' },
              ].map(action => (
                <Link key={action.title} href={action.href}>
                  <Card className="border hover:shadow-md transition-all cursor-pointer group h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
