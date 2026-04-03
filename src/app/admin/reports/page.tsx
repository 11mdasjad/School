'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMonthlyTrend, getClassWiseComparison, getDefaulterList, demoStudents, getProfileById, getStudentAttendanceStats, demoClasses, demoSections } from '@/lib/demo-data';
import { exportToCSV } from '@/lib/utils';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7'];

export default function ReportsPage() {
  const monthlyTrend = getMonthlyTrend();
  const classComparison = getClassWiseComparison();
  const defaulters = getDefaulterList(75);

  const handleExportCSV = () => {
    const data = demoStudents.map(s => {
      const p = getProfileById(s.profile_id);
      const stats = getStudentAttendanceStats(s.id);
      const cls = demoClasses.find(c => c.id === s.class_id);
      return { Name: p?.full_name, Class: cls?.name, Roll: s.roll_no, Present: stats.present, Absent: stats.absent, Late: stats.late, Percentage: `${stats.percentage}%` };
    });
    exportToCSV(data, 'attendance_report');
    toast.success('CSV report downloaded');
  };

  const overallStats = {
    totalDays: monthlyTrend.length,
    avgAttendance: Math.round(monthlyTrend.reduce((a, b) => a + b.percentage, 0) / monthlyTrend.length),
    totalStudents: demoStudents.length,
    defaulterCount: defaulters.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive attendance analytics and reports</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs text-muted-foreground">Working Days</p><p className="text-2xl font-bold">{overallStats.totalDays}</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs text-muted-foreground">Avg Attendance</p><p className="text-2xl font-bold">{overallStats.avgAttendance}%</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{overallStats.totalStudents}</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs text-muted-foreground">Defaulters</p><p className="text-2xl font-bold">{overallStats.defaulterCount}</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="trend">Daily Trend</TabsTrigger>
          <TabsTrigger value="class">Class Comparison</TabsTrigger>
          <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
          <TabsTrigger value="student">Student-wise</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Daily Attendance Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Attendance %" />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Absent" />
                  <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Late" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="class">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Class-wise Attendance Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={classComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                  <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaulters">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Low Attendance Defaulters (&lt;75%)</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {defaulters.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No defaulters found 🎉</p>
                ) : defaulters.map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950">
                    <div className="font-bold text-red-600 text-2xl w-16 text-center">{d.stats.percentage}%</div>
                    <div className="flex-1"><p className="font-semibold text-sm">{d.profile?.full_name}</p><p className="text-xs text-muted-foreground">{d.class?.name} • Roll #{d.roll_no}</p></div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>P: {d.stats.present} | A: {d.stats.absent}</p><p>L: {d.stats.late} | T: {d.stats.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Student-wise Attendance</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2 px-3 font-medium">Student</th><th className="text-center py-2 px-3 font-medium">Present</th><th className="text-center py-2 px-3 font-medium">Absent</th><th className="text-center py-2 px-3 font-medium">Late</th><th className="text-center py-2 px-3 font-medium">Total</th><th className="text-center py-2 px-3 font-medium">%</th></tr></thead>
                  <tbody>{demoStudents.map(s => {
                    const stats = getStudentAttendanceStats(s.id);
                    const profile = getProfileById(s.profile_id);
                    return (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-3 font-medium">{profile?.full_name}</td>
                        <td className="text-center py-2 px-3 text-emerald-600 font-semibold">{stats.present}</td>
                        <td className="text-center py-2 px-3 text-red-600 font-semibold">{stats.absent}</td>
                        <td className="text-center py-2 px-3 text-amber-600 font-semibold">{stats.late}</td>
                        <td className="text-center py-2 px-3">{stats.total}</td>
                        <td className="text-center py-2 px-3">
                          <Badge className={stats.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} variant="secondary">{stats.percentage}%</Badge>
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
