'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoHolidays } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { Plus, Calendar, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

export default function HolidaysPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold tracking-tight">Holiday Management</h1><p className="text-muted-foreground">Manage school holidays and events</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Holiday</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Add Holiday</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Holiday added (demo)'); setDialogOpen(false); }}>
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Holiday name" /></div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Description" /></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Add Holiday</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoHolidays.map(h => (
          <Card key={h.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{h.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{h.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    <Calendar className="w-3 h-3 mr-1" /> {formatDate(h.holiday_date, 'long')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
