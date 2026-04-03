'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoLeaveRequests, demoStudents, getProfileById } from '@/lib/demo-data';
import { getInitials, getStatusColor, formatDate } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function LeaveRequestsPage() {
  const [leaves, setLeaves] = useState(demoLeaveRequests);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action, approved_at: new Date().toISOString() } : l));
    toast.success(`Leave request ${action}`);
  };

  const renderLeaves = (filter: string) => {
    const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);
    if (filtered.length === 0) return <p className="text-center py-12 text-muted-foreground">No {filter} leave requests</p>;

    return filtered.map(leave => {
      const student = demoStudents.find(s => s.id === leave.student_id);
      const profile = student ? getProfileById(student.profile_id) : null;
      const requester = getProfileById(leave.requested_by);

      return (
        <Card key={leave.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <Avatar className="w-11 h-11 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">{profile ? getInitials(profile.full_name) : '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">Requested by: {requester?.full_name} ({requester?.role})</p>
                  </div>
                  <Badge className={getStatusColor(leave.status)} variant="secondary">{leave.status}</Badge>
                </div>
                <div className="mt-2 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm"><strong>Dates:</strong> {formatDate(leave.from_date)} — {formatDate(leave.to_date)}</p>
                  <p className="text-sm mt-1"><strong>Reason:</strong> {leave.reason}</p>
                </div>
                {leave.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleAction(leave.id, 'approved')}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(leave.id, 'rejected')}>
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Leave Requests</h1><p className="text-muted-foreground">Review and manage student leave requests</p></div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pending">Pending <Badge variant="secondary" className="ml-2">{leaves.filter(l => l.status === 'pending').length}</Badge></TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">{renderLeaves('pending')}</TabsContent>
        <TabsContent value="approved" className="space-y-4">{renderLeaves('approved')}</TabsContent>
        <TabsContent value="rejected" className="space-y-4">{renderLeaves('rejected')}</TabsContent>
        <TabsContent value="all" className="space-y-4">{renderLeaves('all')}</TabsContent>
      </Tabs>
    </div>
  );
}
