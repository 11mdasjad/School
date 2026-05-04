'use client';

import { useAppStore } from '@/stores/app-store';
import { useState } from 'react';
import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const { students: allStudents, classes: allClasses, sections: allSections, subjects: allSubjects, teachers: allTeachers, parents: allParents, assignments: allAssignments, attendance: allAttendance, leaveRequests: allLeaveRequests, notifications: allNotifications, holidays: allHolidays, schoolSettings: allSchoolSettings, addSubject } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const subjects = allSubjects.map(s => ({ ...s }));

  const columns: Column<typeof subjects[0]>[] = [
    { key: 'name', label: 'Subject', sortable: true, render: (_v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><BookOpen className="w-4 h-4 text-white" /></div>
        <div><p className="font-semibold text-sm">{row.name}</p><p className="text-xs text-muted-foreground">{row.description}</p></div>
      </div>
    )},
    { key: 'code', label: 'Code', render: (_v, row) => <Badge variant="outline" className="font-mono">{row.code}</Badge> },
    { key: 'created_at', label: 'Created', render: (_v, row) => <span className="text-sm text-muted-foreground">{row.created_at}</span> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Subject Management</h1><p className="text-muted-foreground">Manage school subjects and curriculum</p></div>
      <DataTable columns={columns} data={subjects} searchPlaceholder="Search subjects..." actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Subject</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Add New Subject</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { 
              e.preventDefault(); 
              const fd = new FormData(e.currentTarget);
              const name = fd.get('name') as string || 'New Subject';
              const code = fd.get('code') as string || 'SUB';
              const desc = fd.get('description') as string || '';
              
              addSubject({
                id: 'sub' + Date.now(),
                name: name,
                code: code,
                description: desc,
                created_at: new Date().toISOString()
              });
              
              toast.success('Subject added successfully'); 
              setDialogOpen(false); 
            }}>
              <div className="space-y-2"><Label>Subject Name</Label><Input name="name" placeholder="Physics" required /></div>
              <div className="space-y-2"><Label>Code</Label><Input name="code" placeholder="PHY" required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea name="description" placeholder="Brief description..." /></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Subject</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      } />
    </div>
  );
}
