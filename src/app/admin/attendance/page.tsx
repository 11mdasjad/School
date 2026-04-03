'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { demoStudents, demoClasses, demoSections, demoSubjects, getProfileById } from '@/lib/demo-data';
import { getInitials, getAttendanceColor, cn } from '@/lib/utils';
import { AttendanceStatus } from '@/types';
import { ATTENDANCE_STATUSES, PERIODS } from '@/constants';
import { CalendarCheck, CheckCircle2, XCircle, Clock, ShieldCheck, Save, RotateCcw, Search } from 'lucide-react';
import { toast } from 'sonner';

const statusIcons: Record<string, React.ElementType> = {
  present: CheckCircle2, absent: XCircle, late: Clock, excused: ShieldCheck, leave: ShieldCheck,
};

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('s1');
  const [selectedSubject, setSelectedSubject] = useState('sub1');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialog, setEditDialog] = useState<{ studentId: string; open: boolean }>({ studentId: '', open: false });
  const [editReason, setEditReason] = useState('');

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  const filteredSections = demoSections.filter(s => s.class_id === selectedClass);
  const students = useMemo(() => {
    let list = demoStudents.filter(s => s.class_id === selectedClass && s.section_id === selectedSection);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => {
        const profile = getProfileById(s.profile_id);
        return profile?.full_name.toLowerCase().includes(q) || s.roll_no.includes(q);
      });
    }
    return list.map(s => ({ ...s, profile: getProfileById(s.profile_id) }));
  }, [selectedClass, selectedSection, searchQuery]);

  const getStatus = (studentId: string): AttendanceStatus => {
    return attendanceMap[studentId] || 'present';
  };

  const toggleStatus = (studentId: string) => {
    const current = getStatus(studentId);
    const order: AttendanceStatus[] = ['present', 'absent', 'late', 'excused', 'leave'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setAttendanceMap(prev => ({ ...prev, [studentId]: next }));
  };

  const setAllStatus = (status: AttendanceStatus) => {
    const map: Record<string, AttendanceStatus> = {};
    students.forEach(s => { map[s.id] = status; });
    setAttendanceMap(prev => ({ ...prev, ...map }));
  };

  const handleSave = () => {
    toast.success(`Attendance saved for ${students.length} students on ${selectedDate}`);
  };

  const stats = {
    present: students.filter(s => getStatus(s.id) === 'present').length,
    absent: students.filter(s => getStatus(s.id) === 'absent').length,
    late: students.filter(s => getStatus(s.id) === 'late').length,
    excused: students.filter(s => ['excused', 'leave'].includes(getStatus(s.id))).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">Record daily or period-wise attendance</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Save className="w-4 h-4 mr-2" /> Save Attendance
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Class</label>
              <Select value={selectedClass} onValueChange={v => { if (v) { setSelectedClass(v); setSelectedSection(demoSections.find(s => s.class_id === v)?.id || ''); } }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{demoClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Section</label>
              <Select value={selectedSection} onValueChange={v => { if (v) setSelectedSection(v); }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{filteredSections.map(s => <SelectItem key={s.id} value={s.id}>Section {s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Subject</label>
              <Select value={selectedSubject} onValueChange={v => { if (v) setSelectedSubject(v); }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{demoSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Period</label>
              <Select value={selectedPeriod} onValueChange={v => { if (v) setSelectedPeriod(v); }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{PERIODS.map(p => <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Name or roll..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 pl-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div><p className="text-xs text-muted-foreground">Present</p><p className="text-xl font-bold text-emerald-700">{stats.present}</p></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50">
          <XCircle className="w-5 h-5 text-red-600" />
          <div><p className="text-xs text-muted-foreground">Absent</p><p className="text-xl font-bold text-red-700">{stats.absent}</p></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50">
          <Clock className="w-5 h-5 text-amber-600" />
          <div><p className="text-xs text-muted-foreground">Late</p><p className="text-xl font-bold text-amber-700">{stats.late}</p></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <div><p className="text-xs text-muted-foreground">Excused/Leave</p><p className="text-xl font-bold text-blue-700">{stats.excused}</p></div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Bulk Actions:</span>
        {ATTENDANCE_STATUSES.map(status => (
          <Button
            key={status.value}
            variant="outline"
            size="sm"
            onClick={() => setAllStatus(status.value as AttendanceStatus)}
            className="text-xs"
          >
            Mark All {status.label}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setAttendanceMap({})} className="text-xs">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {students.map(student => {
          const status = getStatus(student.id);
          const StatusIcon = statusIcons[status];
          return (
            <Card
              key={student.id}
              className={cn(
                "cursor-pointer border-2 transition-all duration-200 hover:shadow-md overflow-hidden",
                status === 'present' && "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/10",
                status === 'absent' && "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/10",
                status === 'late' && "border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-950/10",
                status === 'excused' && "border-blue-200 bg-blue-50/30 dark:border-blue-900 dark:bg-blue-950/10",
                status === 'leave' && "border-purple-200 bg-purple-50/30 dark:border-purple-900 dark:bg-purple-950/10",
              )}
              onClick={() => toggleStatus(student.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className={cn(
                      "text-white text-xs font-bold",
                      status === 'present' ? 'bg-emerald-500' :
                      status === 'absent' ? 'bg-red-500' :
                      status === 'late' ? 'bg-amber-500' :
                      'bg-blue-500'
                    )}>
                      {student.profile ? getInitials(student.profile.full_name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{student.profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">Roll #{student.roll_no}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <StatusIcon className={cn("w-6 h-6",
                      status === 'present' && 'text-emerald-500',
                      status === 'absent' && 'text-red-500',
                      status === 'late' && 'text-amber-500',
                      status === 'excused' && 'text-blue-500',
                      status === 'leave' && 'text-purple-500',
                    )} />
                    <Badge className={cn("text-[10px] px-1.5", getAttendanceColor(status))} variant="secondary">
                      {status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {students.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-lg font-semibold">No students found</p>
          <p className="text-sm">Select a class and section to view students</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog(p => ({ ...p, open }))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Attendance</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Reason for edit</Label><Textarea value={editReason} onChange={e => setEditReason(e.target.value)} placeholder="Enter reason..." /></div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setEditDialog({ studentId: '', open: false })}>Cancel</Button><Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Save Changes</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
