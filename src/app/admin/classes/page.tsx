'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoClasses, demoSections, demoStudents } from '@/lib/demo-data';
import { Plus, School, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ClassesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Classes & Sections</h1>
          <p className="text-muted-foreground">Manage school classes and their sections</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Class
            </Button>
           } />
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Class added (demo)'); setDialogOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Class Name</Label><Input placeholder="Class 9" /></div>
                <div className="space-y-2"><Label>Grade Level</Label><Input placeholder="9" /></div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Class</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoClasses.map(cls => {
          const sections = demoSections.filter(s => s.class_id === cls.id);
          const studentCount = demoStudents.filter(s => s.class_id === cls.id).length;

          return (
            <Card key={cls.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <School className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">Grade {cls.grade_level}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" /> {studentCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Sections</p>
                <div className="flex flex-wrap gap-2">
                  {sections.map(sec => (
                    <Badge key={sec.id} variant="outline" className="px-3 py-1">
                      Section {sec.name}
                      <span className="ml-1.5 text-muted-foreground">
                        ({demoStudents.filter(s => s.section_id === sec.id).length})
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
