'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { NAV_ITEMS } from '@/constants';
import { cn, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, GraduationCap, Users, UserCheck, School, BookOpen,
  ClipboardList, CalendarCheck, BarChart3, FileText, Calendar, Bell,
  Settings, History, User, Menu, LogOut, ChevronLeft, Search, Moon, Sun
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GraduationCap, Users, UserCheck, School, BookOpen,
  ClipboardList, CalendarCheck, BarChart3, FileText, Calendar, Bell,
  Settings, History, User,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!mounted || !user) return null;

  const navItems = NAV_ITEMS[user.role] || [];
  const unreadNotifications = 3;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0",
        collapsed && !mobile && "justify-center px-2"
      )}>
        <Image src="/logo.png" alt="Royal International Public School" width={36} height={36} className="w-9 h-9 object-contain shrink-0" />
        {(!collapsed || mobile) && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm leading-tight truncate">Royal International</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Public School</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || (item.href !== `/${user.role}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:text-white",
                collapsed && !mobile && "justify-center px-2"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-white")} />
              {(!collapsed || mobile) && (
                <>
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn("border-t border-sidebar-border p-3", collapsed && !mobile && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && !mobile && "justify-center")}>
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || mobile) && (
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate">{user.full_name}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
                  <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SidebarContent mobile />
              </SheetContent>
            </Sheet>

            {/* Collapse button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
            </Button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-[280px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => router.push(`/${user.role}/notifications`)}>
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            <Separator orientation="vertical" className="h-8 mx-1" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 h-auto py-1.5 rounded-full" />}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-tight">{user.full_name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/${user.role}/profile`)}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${user.role}/notifications`)}>
                  <Bell className="w-4 h-4 mr-2" /> Notifications
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
