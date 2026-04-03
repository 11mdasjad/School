'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoParents, demoStudents, getProfileById } from '@/lib/demo-data';
import { getInitials } from '@/lib/utils';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ParentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const parents = demoParents.map(p => {
    const profile = getProfileById(p.profile_id);
    const children = demoStudents.filter(s => s.parent_id === p.id).map(s => getProfileById(s.profile_id)?.full_name).filter(Boolean);
    return { ...p, name: profile?.full_name || '', email: profile?.email || '', phone: profile?.phone || '', status: profile?.status || 'active', childrenNames: children.join(', '), childCount: children.length };
  });

  const columns: Column<typeof parents[0]>[] = [
    { key: 'name', label: 'Parent', sortable: true, render: (_v, row) => (
      <div className="flex items-center gap-3"><Avatar className="w-9 h-9"><AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs">{getInitials(row.name)}</AvatarFallback></Avatar><div><p className="font-semibold text-sm">{row.name}</p><p className="text-xs text-muted-foreground">{row.email}</p></div></div>
    )},
    { key: 'relationship', label: 'Relationship' },
    { key: 'phone', label: 'Phone' },
    { key: 'childrenNames', label: 'Children', render: (_v, row) => <span className="text-sm">{row.childrenNames || 'None'}</span> },
    { key: 'childCount', label: 'Count', render: (_v, row) => <Badge variant="secondary">{row.childCount}</Badge> },
    { key: 'status', label: 'Status', render: (_v, row) => <Badge className={row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'} variant="secondary">{row.status}</Badge> },
    { key: 'actions', label: '', className: 'w-10', render: () => <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Parent Management</h1><p className="text-muted-foreground">Manage parents and their linked children</p></div>
      <DataTable columns={columns} data={parents} searchPlaceholder="Search parents..." actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Parent</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Add New Parent</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Parent added (demo)'); setDialogOpen(false); }}>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Full Name</Label><Input /></div><div className="space-y-2"><Label>Email</Label><Input type="email" /></div><div className="space-y-2"><Label>Phone</Label><Input /></div><div className="space-y-2"><Label>Relationship</Label><Input placeholder="Father/Mother" /></div></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Parent</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      } />
    </div>
  );
}
