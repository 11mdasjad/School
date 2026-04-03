'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  GraduationCap, Users, UserCheck, CalendarCheck, TrendingUp, TrendingDown,
  Clock, AlertTriangle, CheckCircle2, XCircle, BarChart3, FileText
} from 'lucide-react';
import React from 'react';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, Users, UserCheck, CalendarCheck, TrendingUp, TrendingDown,
  Clock, AlertTriangle, CheckCircle2, XCircle, BarChart3, FileText,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color?: string;
  className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, color = 'blue', className }: StatCardProps) {
  const Icon = iconMap[icon] || BarChart3;

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  const bgClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-950/30',
    green: 'bg-emerald-50 dark:bg-emerald-950/30',
    red: 'bg-red-50 dark:bg-red-950/30',
    amber: 'bg-amber-50 dark:bg-amber-950/30',
    purple: 'bg-purple-50 dark:bg-purple-950/30',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/30',
  };

  return (
    <Card className={cn("overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200", bgClasses[color], className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                changeType === 'positive' && "text-emerald-600",
                changeType === 'negative' && "text-red-600",
                changeType === 'neutral' && "text-muted-foreground"
              )}>
                {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", colorClasses[color])}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
