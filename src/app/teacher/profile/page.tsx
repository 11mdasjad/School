'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { getInitials } from '@/lib/utils';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Profile Settings</h1><p className="text-muted-foreground">Manage your account information</p></div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <CardContent className="-mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.full_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-700 capitalize">{user.role}</Badge>
                <Badge className="bg-emerald-100 text-emerald-700">{user.status}</Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <form onSubmit={e => { e.preventDefault(); toast.success('Profile updated (demo)'); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Full Name</Label><Input defaultValue={user.full_name} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label><Input defaultValue={user.email} type="email" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</Label><Input defaultValue={user.phone || ''} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Role</Label><Input value={user.role} disabled className="capitalize" /></div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
