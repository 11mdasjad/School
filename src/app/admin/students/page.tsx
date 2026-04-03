'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoStudents, demoClasses, demoSections, demoParents, getProfileById, getStudentAttendanceStats } from '@/lib/demo-data';
import { getInitials, getAttendanceColor } from '@/lib/utils';
import { Plus, Download, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const students = demoStudents.map(s => ({
    ...s,
    profile: getProfileById(s.profile_id),
    class: demoClasses.find(c => c.id === s.class_id),
    section: demoSections.find(sec => sec.id === s.section_id),
    parent: s.parent_id ? demoParents.find(p => p.id === s.parent_id) : undefined,
    stats: getStudentAttendanceStats(s.id),
    name: getProfileById(s.profile_id)?.full_name || '',
    email: getProfileById(s.profile_id)?.email || '',
    className: demoClasses.find(c => c.id === s.class_id)?.name || '',
    sectionName: demoSections.find(sec => sec.id === s.section_id)?.name || '',
  }));

  const columns: Column<typeof students[0]>[] = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (_v, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'admission_no', label: 'Admission No', sortable: true },
    { key: 'roll_no', label: 'Roll No', sortable: true },
    {
      key: 'className',
      label: 'Class',
      sortable: true,
      render: (_v, row) => (
        <Badge variant="secondary" className="font-medium">
          {row.className} - {row.sectionName}
        </Badge>
      ),
    },
    {
      key: 'stats',
      label: 'Attendance',
      render: (_v, row) => (
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.stats.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {row.stats.percentage}%
          </div>
        </div>
      ),
    },
    {
      key: 'profile',
      label: 'Status',
      render: (_v, row) => (
        <Badge className={row.profile?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'} variant="secondary">
          {row.profile?.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-10',
      render: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage all students in the school</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search students by name, email, admission no..."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info('CSV export coming soon')}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
               } />
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Student added (demo)'); setDialogOpen(false); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input placeholder="John Doe" /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="john@school.com" /></div>
                    <div className="space-y-2"><Label>Admission No</Label><Input placeholder="ADM2024XXX" /></div>
                    <div className="space-y-2"><Label>Roll No</Label><Input placeholder="01" /></div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>{demoClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                        <SelectContent>{demoSections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" /></div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Student</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />
    </div>
  );
}
