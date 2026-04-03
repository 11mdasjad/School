'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/auth-store';
import { DEMO_CREDENTIALS, ROLES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, ArrowLeft, Shield, Users, GraduationCap, UserCheck, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

const roleIcons = { admin: Shield, teacher: Users, student: GraduationCap, parent: UserCheck };
const roleColors = {
  admin: 'from-blue-600 to-indigo-600 hover:shadow-blue-500/30',
  teacher: 'from-emerald-600 to-teal-600 hover:shadow-emerald-500/30',
  student: 'from-purple-600 to-pink-600 hover:shadow-purple-500/30',
  parent: 'from-amber-600 to-orange-600 hover:shadow-amber-500/30',
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.phone, data.password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      toast.success(`Welcome back, ${user?.full_name}!`);
      router.push(`/${user?.role}`);
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const creds = DEMO_CREDENTIALS[role];
    form.setValue('phone', creds.phone);
    form.setValue('password', creds.password);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-center px-12 lg:px-16 text-white">
          <Image src="/logo.png" alt="Royal International Public School" width={80} height={80} className="w-20 h-20 object-contain mb-8 drop-shadow-lg" />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Royal International<br />Public School
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-md">
            Attendance management portal for parents, teachers, and administration. Login with your registered mobile number.
          </p>
          <div className="space-y-4">
            {[
              '726 Students | 45 Teachers | 13 Classes',
              'Secure parent phone login',
              'Attendance tracking & analytics',
              'Leave management system',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in with your registered mobile number</p>
          </div>

          {/* Demo Role Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {ROLES.map(role => {
              const Icon = roleIcons[role.value];
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleDemoLogin(role.value)}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedRole === role.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-border hover:border-blue-300 hover:bg-muted/50"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow", roleColors[role.value])}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{role.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground">or enter credentials</span></div>
          </div>

          {/* Login Form */}
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...form.register('password')}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-base font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </div>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <Card className="mt-6 border-dashed bg-muted/30">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Login Credentials:</p>
              <div className="grid grid-cols-1 gap-1.5 text-xs text-muted-foreground">
                {Object.entries(DEMO_CREDENTIALS).map(([role, creds]) => (
                  <div key={role} className="flex items-center gap-2">
                    <span className="capitalize font-semibold text-foreground w-14">{role}:</span>
                    <span className="font-mono">{creds.phone}</span>
                    <span className="text-muted-foreground/70">({creds.name})</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Password: <span className="font-mono">{'[role]123'}</span></p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
