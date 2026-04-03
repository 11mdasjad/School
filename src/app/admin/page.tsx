'use client';

import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  demoStudents, demoTeachers, demoParents, demoLeaveRequests, demoNotifications,
  getTodayAttendanceSummary, getMonthlyTrend, getClassWiseComparison, getDefaulterList,
  getProfileById,
} from '@/lib/demo-data';
import { getAttendanceColor, getInitials, getStatusColor, formatDate } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { CalendarCheck, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

export default function AdminDashboard() {
  const todayStats = getTodayAttendanceSummary();
  const monthlyTrend = getMonthlyTrend();
  const classComparison = getClassWiseComparison();
  const defaulters = getDefaulterList(75);
  const pendingLeaves = demoLeaveRequests.filter(l => l.status === 'pending');
  const recentNotifications = demoNotifications.slice(0, 5);

  const pieData = [
    { name: 'Present', value: todayStats.present },
    { name: 'Absent', value: todayStats.absent },
    { name: 'Late', value: todayStats.late },
    { name: 'Excused', value: todayStats.excused },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of school attendance and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Link href="/admin/attendance">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CalendarCheck className="w-4 h-4 mr-2" /> Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={demoStudents.length} change="+12 this month" changeType="positive" icon="GraduationCap" color="blue" />
        <StatCard title="Total Teachers" value={demoTeachers.length} change="Active staff" changeType="neutral" icon="Users" color="purple" />
        <StatCard title="Today's Attendance" value={`${todayStats.percentage}%`} change={`${todayStats.present} present`} changeType={todayStats.percentage >= 75 ? 'positive' : 'negative'} icon="CalendarCheck" color="green" />
        <StatCard title="Absent Today" value={todayStats.absent} change={`${todayStats.late} late arrivals`} changeType="negative" icon="AlertTriangle" color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Attendance Trend (March 2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Attendance %" />
                <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Absent" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Pie Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Today&apos;s Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Comparison + Pending Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class-wise comparison */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Class-wise Attendance</CardTitle>
            <Link href="/admin/reports">
              <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={classComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Pending Leave Requests</CardTitle>
            <Badge variant="secondary">{pendingLeaves.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No pending requests</p>
              ) : (
                pendingLeaves.map(leave => {
                  const student = demoStudents.find(s => s.id === leave.student_id);
                  const profile = student ? getProfileById(student.profile_id) : null;
                  return (
                    <div key={leave.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs">
                          {profile ? getInitials(profile.full_name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{leave.reason}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDate(leave.from_date)} - {formatDate(leave.to_date)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(leave.status)} variant="secondary">
                        {leave.status}
                      </Badge>
                    </div>
                  );
                })
              )}
              <Link href="/admin/leave-requests">
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View All Requests <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Defaulters + Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defaulter List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Low Attendance Defaulters (&lt;75%)</CardTitle>
            <Badge variant="destructive">{defaulters.length} students</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaulters.slice(0, 5).map(student => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs">
                      {student.profile ? getInitials(student.profile.full_name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{student.profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{student.class?.name} • Roll #{student.roll_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{student.stats.percentage}%</p>
                    <p className="text-[10px] text-muted-foreground">{student.stats.absent} absent</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Notifications</CardTitle>
            <Link href="/admin/notifications">
              <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-xl transition-colors ${notif.is_read ? 'bg-muted/20' : 'bg-blue-50/50 dark:bg-blue-950/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!notif.is_read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    <p className="text-sm font-semibold">{notif.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 ml-4">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 ml-4">{formatDate(notif.created_at, 'long')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
