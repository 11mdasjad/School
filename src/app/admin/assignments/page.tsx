'use client';

import { useAppStore } from '@/stores/app-store';
import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProfileById } from '@/lib/store-helpers';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AssignmentsPage() {
  const { students: allStudents, classes: allClasses, sections: allSections, subjects: allSubjects, teachers: allTeachers, parents: allParents, assignments: allAssignments, attendance: allAttendance, leaveRequests: allLeaveRequests, notifications: allNotifications, holidays: allHolidays, schoolSettings: allSchoolSettings, addAssignment } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const assignments = allAssignments.map(a => ({
    ...a,
    teacherName: getProfileById(allTeachers.find(t => t.id === a.teacher_id)?.profile_id || '')?.full_name || '',
    className: allClasses.find(c => c.id === a.class_id)?.name || '',
    sectionName: allSections.find(s => s.id === a.section_id)?.name || '',
    subjectName: allSubjects.find(s => s.id === a.subject_id)?.name || '',
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
            <form className="space-y-4" onSubmit={e => { 
              e.preventDefault(); 
              const fd = new FormData(e.currentTarget);
              const teacherId = fd.get('teacherId') as string || allTeachers[0]?.id;
              const classId = fd.get('classId') as string || allClasses[0]?.id;
              const sectionId = fd.get('sectionId') as string || allSections[0]?.id;
              const subjectId = fd.get('subjectId') as string || allSubjects[0]?.id;
              
              if(teacherId && classId && sectionId && subjectId) {
                addAssignment({
                  id: 'ta' + Date.now(),
                  teacher_id: teacherId,
                  class_id: classId,
                  section_id: sectionId,
                  subject_id: subjectId,
                  created_at: new Date().toISOString()
                });
                toast.success('Assignment created successfully'); 
              } else {
                toast.error('Please select all fields');
              }
              setDialogOpen(false); 
            }}>
              <div className="space-y-2"><Label>Teacher</Label><Select name="teacherId" required><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger><SelectContent>{allTeachers.map(t => <SelectItem key={t.id} value={t.id}>{getProfileById(t.profile_id)?.full_name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Class</Label><Select name="classId" required><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Section</Label><Select name="sectionId" required><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{allSections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Subject</Label><Select name="subjectId" required><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{allSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Create Assignment</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      } />
    </div>
  );
}
