'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoNotifications } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { Plus, Bell, BellDot } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold tracking-tight">Notifications</h1><p className="text-muted-foreground">Send and manage school notifications</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Plus className="w-4 h-4 mr-2" /> Send Notification</Button> } />
          <DialogContent><DialogHeader><DialogTitle>Send Notification</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Notification sent (demo)'); setDialogOpen(false); }}>
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Notification title" /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Notification message..." rows={4} /></div>
              <div className="space-y-2"><Label>Send to</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Users</SelectItem><SelectItem value="admin">Admins</SelectItem><SelectItem value="teacher">Teachers</SelectItem><SelectItem value="student">Students</SelectItem><SelectItem value="parent">Parents</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Send</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <Card key={notif.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500' : ''}`} onClick={() => markRead(notif.id)}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-muted' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                {notif.is_read ? <Bell className="w-5 h-5 text-muted-foreground" /> : <BellDot className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm ${notif.is_read ? 'font-medium' : 'font-bold'}`}>{notif.title}</p>
                  {!notif.is_read && <Badge className="bg-blue-500 text-white text-[10px]">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[11px] text-muted-foreground">{formatDate(notif.created_at, 'long')}</p>
                  {notif.recipient_role && <Badge variant="outline" className="text-[10px]">{notif.recipient_role}</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
