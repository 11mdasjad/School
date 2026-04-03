'use client';

import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoAssignments, demoTeachers, demoClasses, demoSections, demoSubjects, getProfileById } from '@/lib/demo-data';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AssignmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const assignments = demoAssignments.map(a => ({
    ...a,
    teacherName: getProfileById(demoTeachers.find(t => t.id === a.teacher_id)?.profile_id || '')?.full_name || '',
    className: demoClasses.find(c => c.id === a.class_id)?.name || '',
    sectionName: demoSections.find(s => s.id === a.section_id)?.name || '',
    subjectName: demoSubjects.find(s => s.id === a.subject_id)?.name || '',
  }));

  const columns: Column<typeof assignments[0]>[] = [
    { key: 'teacherName', label: 'Teacher', sortable: true },
    { key: 'className', label: 'Class', render: (_v, row) => <Badge variant="secondary">{row.className}</Badge> },
    { key: 'sectionName', label: 'Section', render: (_v, row) => <Badge variant="outline">Section {row.sectionName}</Badge> },
    { key: 'subjectName', label: 'Subject', sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Teacher Assignments</h1><p className="text-muted-foreground">Assign teachers to classes and subjects</p></div>
      <DataTable columns={columns} data={assignments} searchPlaceholder="Search assignments..." actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> New Assignment</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Assign Teacher</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Assignment created (demo)'); setDialogOpen(false); }}>
              <div className="space-y-2"><Label>Teacher</Label><Select><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger><SelectContent>{demoTeachers.map(t => <SelectItem key={t.id} value={t.id}>{getProfileById(t.profile_id)?.full_name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Class</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{demoClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Section</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{demoSections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Subject</Label><Select><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{demoSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Create Assignment</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      } />
    </div>
  );
}
