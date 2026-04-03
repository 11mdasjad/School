import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = new Date(date);
  if (format === 'iso') return d.toISOString().split('T')[0];
  if (format === 'long') return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getAttendanceColor(status: string): string {
  const colors: Record<string, string> = {
    present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    excused: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    leave: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getAttendanceDotColor(status: string): string {
  const colors: Record<string, string> = {
    present: 'bg-emerald-500',
    absent: 'bg-red-500',
    late: 'bg-amber-500',
    excused: 'bg-blue-500',
    leave: 'bg-purple-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-700',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function calculatePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        const str = String(val ?? '');
        return str.includes(',') ? `"${str}"` : str;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
