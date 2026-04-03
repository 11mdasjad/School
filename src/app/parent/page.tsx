'use client';

import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { demoStudents, demoParents, getProfileById, getStudentAttendanceStats, demoClasses, demoSections, demoAttendance, demoLeaveRequests, demoNotifications } from '@/lib/demo-data';
import { getInitials, getAttendanceColor, getAttendanceDotColor, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, AlertTriangle } from 'lucide-react';

export default function ParentDashboard() {
  // Demo parent: p1 (Michael Johnson)
  const parent = demoParents[0];
  const children = demoStudents.filter(s => s.parent_id === parent.id).map(s => ({
    ...s,
    profile: getProfileById(s.profile_id)!,
    class: demoClasses.find(c => c.id === s.class_id)!,
    section: demoSections.find(sec => sec.id === s.section_id)!,
    stats: getStudentAttendanceStats(s.id),
  }));

  const totalAbsent = children.reduce((sum, c) => sum + c.stats.absent, 0);
  const avgPercentage = Math.round(children.reduce((sum, c) => sum + c.stats.percentage, 0) / children.length);
  const myNotifications = demoNotifications.filter(n => !n.recipient_role || n.recipient_role === 'parent').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your children&apos;s attendance and school updates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Children" value={children.length} icon="Users" color="blue" />
        <StatCard title="Avg Attendance" value={`${avgPercentage}%`} icon="CalendarCheck" color={avgPercentage >= 75 ? 'green' : 'red'} change={avgPercentage >= 75 ? 'Above minimum' : 'Below threshold'} changeType={avgPercentage >= 75 ? 'positive' : 'negative'} />
        <StatCard title="Total Absences" value={totalAbsent} icon="AlertTriangle" color="red" />
        <StatCard title="Pending Leaves" value={demoLeaveRequests.filter(l => children.some(c => c.id === l.student_id) && l.status === 'pending').length} icon="FileText" color="amber" />
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <Card key={child.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${child.stats.percentage >= 75 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500'}`} />
            <CardContent className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-bold">
                    {getInitials(child.profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{child.profile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{child.class.name} - Section {child.section.name} • Roll #{child.roll_no}</p>
                  <p className="text-xs text-muted-foreground">Admission #{child.admission_no}</p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                  <p className="text-lg font-bold text-emerald-600">{child.stats.present}</p><p className="text-[10px] text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-lg font-bold text-red-600">{child.stats.absent}</p><p className="text-[10px] text-muted-foreground">Absent</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <p className="text-lg font-bold text-amber-600">{child.stats.late}</p><p className="text-[10px] text-muted-foreground">Late</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-lg font-bold text-blue-600">{child.stats.excused}</p><p className="text-[10px] text-muted-foreground">Excused</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>Attendance Rate</span>
                  <span className={cn("font-bold", child.stats.percentage >= 75 ? 'text-emerald-600' : 'text-red-600')}>
                    {child.stats.percentage}%
                  </span>
                </div>
                <Progress value={child.stats.percentage} className="h-2.5" />
                {child.stats.percentage < 75 && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertTriangle className="w-3 h-3" /> Below minimum attendance threshold
                  </div>
                )}
              </div>

              <Link href="/parent/attendance" className="block mt-4">
                <Button variant="outline" className="w-full" size="sm">
                  View Details <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Notifications</CardTitle>
          <Link href="/parent/notifications"><Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
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
  );
}
