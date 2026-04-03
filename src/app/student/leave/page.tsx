'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { demoLeaveRequests, demoStudents } from '@/lib/demo-data';
import { getStatusColor, formatDate } from '@/lib/utils';
import { Plus, FileText, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentLeavePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const student = demoStudents[0];
  const myLeaves = demoLeaveRequests.filter(l => l.student_id === student.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold tracking-tight">Leave Requests</h1><p className="text-muted-foreground">Apply for leave and track request status</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Apply for Leave</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Leave request submitted (demo)'); setDialogOpen(false); }}>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>From Date</Label><Input type="date" /></div><div className="space-y-2"><Label>To Date</Label><Input type="date" /></div></div>
              <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Please provide a detailed reason for leave..." rows={4} /></div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Submit Request</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {myLeaves.length === 0 ? (
        <Card className="border-0 shadow-sm"><CardContent className="py-16 text-center"><FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" /><p className="font-semibold text-lg">No leave requests yet</p><p className="text-sm text-muted-foreground">Click &quot;Apply for Leave&quot; to submit your first request</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {myLeaves.map(leave => (
            <Card key={leave.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{formatDate(leave.from_date)} — {formatDate(leave.to_date)}</span></div>
                  <Badge className={getStatusColor(leave.status)} variant="secondary">{leave.status}</Badge>
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-lg">{leave.reason}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" /> Submitted on {formatDate(leave.created_at, 'long')}
                  {leave.approved_at && <span>• Reviewed on {formatDate(leave.approved_at, 'long')}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
