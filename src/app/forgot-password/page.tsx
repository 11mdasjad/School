'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    toast.success('Password reset link sent via SMS to +91 ' + data.phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-extrabold">Forgot Password?</CardTitle>
          <CardDescription>
            {sent ? 'Check your phone for a reset link' : 'Enter your registered mobile number to reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a password reset link via SMS to your registered mobile number.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground select-none pointer-events-none">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium border-r pr-2">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9000000001"
                    {...form.register('phone')}
                    className="h-11 pl-[5.5rem]"
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link via SMS'}
              </Button>
              <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3 h-3 inline mr-1" /> Back to Login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
