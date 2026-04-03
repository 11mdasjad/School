'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoTeachers, getProfileById, demoAssignments, demoClasses, demoSubjects, demoSections } from '@/lib/demo-data';
import { getInitials } from '@/lib/utils';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function TeachersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const teachers = demoTeachers.map(t => {
    const profile = getProfileById(t.profile_id);
    const assignments = demoAssignments.filter(a => a.teacher_id === t.id);
    return {
      ...t,
      name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      status: profile?.status || 'active',
      assignmentCount: assignments.length,
      classes: [...new Set(assignments.map(a => demoClasses.find(c => c.id === a.class_id)?.name))].join(', '),
    };
  });

  const columns: Column<typeof teachers[0]>[] = [
    {
      key: 'name', label: 'Teacher', sortable: true,
      render: (_v, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9"><AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs">{getInitials(row.name)}</AvatarFallback></Avatar>
          <div><p className="font-semibold text-sm">{row.name}</p><p className="text-xs text-muted-foreground">{row.email}</p></div>
        </div>
      ),
    },
    { key: 'employee_id', label: 'Employee ID', sortable: true },
    { key: 'specialization', label: 'Specialization' },
    { key: 'classes', label: 'Assigned Classes', render: (_v, row) => <span className="text-sm">{row.classes || 'None'}</span> },
    { key: 'assignmentCount', label: 'Assignments', render: (_v, row) => <Badge variant="secondary">{row.assignmentCount}</Badge> },
    { key: 'status', label: 'Status', render: (_v, row) => <Badge className={row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'} variant="secondary">{row.status}</Badge> },
    { key: 'actions', label: '', className: 'w-10', render: () => <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Teacher Management</h1><p className="text-muted-foreground">Manage all teachers and their assignments</p></div>
      <DataTable columns={columns} data={teachers} searchPlaceholder="Search teachers..." actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Teacher</Button> } />
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Teacher</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Teacher added (demo)'); setDialogOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Jane Smith" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" /></div>
                <div className="space-y-2"><Label>Employee ID</Label><Input placeholder="EMP00X" /></div>
                <div className="space-y-2"><Label>Specialization</Label><Input placeholder="Mathematics" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="+1-555-XXXX" /></div>
              </div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Teacher</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      } />
    </div>
  );
}
