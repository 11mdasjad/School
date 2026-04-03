'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { demoSchoolSettings } from '@/lib/demo-data';
import { School, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(demoSchoolSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully (demo)');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-extrabold tracking-tight">School Settings</h1><p className="text-muted-foreground">Configure school information and preferences</p></div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"><School className="w-5 h-5 text-white" /></div>
              <CardTitle>School Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>School Name</Label><Input value={settings.school_name} onChange={e => setSettings(s => ({ ...s, school_name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={settings.contact_email || ''} onChange={e => setSettings(s => ({ ...s, contact_email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Contact Phone</Label><Input value={settings.contact_phone || ''} onChange={e => setSettings(s => ({ ...s, contact_phone: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Input value={settings.address || ''} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Attendance Policy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Attendance Percentage</Label>
              <Input type="number" min={0} max={100} value={settings.minimum_attendance_percentage} onChange={e => setSettings(s => ({ ...s, minimum_attendance_percentage: Number(e.target.value) }))} />
              <p className="text-xs text-muted-foreground">Students below this percentage will be flagged as defaulters.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
