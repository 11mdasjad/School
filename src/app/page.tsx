'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap, Shield, BarChart3, CalendarCheck, Users, Bell,
  ChevronRight, CheckCircle2, ArrowRight, Phone, Mail, MapPin, Star
} from 'lucide-react';

const features = [
  { icon: CalendarCheck, title: 'Smart Attendance', description: 'Mark daily or period-wise attendance with bulk actions, real-time tracking, and duplicate prevention.', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Role-Based Access', description: 'Secure access for Admin, Teacher, Student, and Parent with row-level security policies.', color: 'from-emerald-500 to-teal-500' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'Comprehensive dashboards with charts, trends, defaulter lists, and exportable reports.', color: 'from-purple-500 to-pink-500' },
  { icon: Bell, title: 'Instant Notifications', description: 'Real-time alerts for absences, leave updates, and school announcements to all stakeholders.', color: 'from-amber-500 to-orange-500' },
  { icon: Users, title: 'Parent Portal', description: 'Parents can monitor attendance, receive alerts, and submit leave requests for their children.', color: 'from-red-500 to-rose-500' },
  { icon: GraduationCap, title: 'Student Self-Service', description: 'Students view their attendance calendar, apply for leave, and track their attendance percentage.', color: 'from-indigo-500 to-violet-500' },
];

const stats = [
  { value: '726', label: 'Students Enrolled' },
  { value: '45', label: 'Expert Teachers' },
  { value: '13', label: 'Classes (Nursery–10)' },
  { value: 'CBSE', label: 'Affiliated Board' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Royal International Public School" width={40} height={40} className="w-10 h-10 object-contain" />
              <span className="font-bold text-lg hidden sm:block">Royal International</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow">
                  Get Started <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" /> CBSE Affiliated | Est. 2005 | Faridabad, Haryana
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Royal International
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Public School
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Secure attendance management portal for parents, teachers, and administration.
              Login with your registered mobile number to track and manage attendance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg px-8 py-6 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Login to Portal <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage school attendance efficiently and effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <Card key={feat.title} className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Dashboards for Everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built interfaces for every role in your school ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Admin', description: 'Full control over school data, analytics, and settings', icon: Shield, items: ['Manage all users', 'View school-wide analytics', 'Approve leave requests', 'Generate reports'], gradient: 'from-blue-600 to-indigo-600' },
              { role: 'Teacher', description: 'Mark attendance and manage assigned classes efficiently', icon: Users, items: ['Mark daily attendance', 'Period-wise tracking', 'Class analytics', 'Respond to leaves'], gradient: 'from-emerald-600 to-teal-600' },
              { role: 'Student', description: 'Track your attendance and submit leave requests', icon: GraduationCap, items: ['View attendance %', 'Calendar view', 'Apply for leave', 'View notifications'], gradient: 'from-purple-600 to-pink-600' },
              { role: 'Parent', description: 'Monitor your child\'s attendance and stay informed', icon: Users, items: ['Child attendance', 'Absence alerts', 'Submit leave', 'View reports'], gradient: 'from-amber-600 to-orange-600' },
            ].map((card) => (
              <Card key={card.role} className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />
                <CardContent className="p-6 pt-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.role}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className="mt-6 block">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Login as {card.role} <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
                Built for Modern Schools
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Royal International Public School (RIPS), established in 2005 in Faridabad, Haryana,
                is a CBSE-affiliated institution committed to academic excellence. This portal provides
                secure, phone-based access for parents, teachers, and administrators.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time attendance tracking with websockets',
                  'Row-level security for data isolation',
                  'Export reports to CSV and PDF',
                  'Mobile-responsive design for all devices',
                  'Audit trail for all attendance modifications',
                  'Multi-academic year support',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 lg:p-12">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="h-20 bg-blue-50 dark:bg-blue-900/20 rounded-lg" />
                      <div className="h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg" />
                      <div className="h-20 bg-purple-50 dark:bg-purple-900/20 rounded-lg" />
                    </div>
                    <div className="h-32 bg-muted/50 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Phone, label: 'Phone', value: '+91-129-4567890', href: 'tel:+911294567890' },
              { icon: Mail, label: 'Email', value: 'info@royalinternationalpublicschool.edu.in', href: 'mailto:info@royalinternationalpublicschool.edu.in' },
              { icon: MapPin, label: 'Address', value: 'Plot No. 45, Sector 15, Faridabad, Haryana - 121007', href: '#' },
            ].map(item => (
              <a key={item.label} href={item.href} className="block">
                <Card className="text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Royal International Public School" width={40} height={40} className="w-10 h-10 object-contain" />
              <div>
                <p className="font-bold text-white">Royal International Public School</p>
                <p className="text-xs">© 2025 All rights reserved | CBSE Affiliation No: 530987</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
