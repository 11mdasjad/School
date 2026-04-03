'use client';

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
  pageSize: initialPageSize = 10,
  onRowClick,
  actions,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Filter
  let filtered = data;
  if (search && searchKey) {
    const lowerSearch = search.toLowerCase();
    filtered = data.filter(row => {
      const val = row[searchKey];
      return String(val ?? '').toLowerCase().includes(lowerSearch);
    });
  } else if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = data.filter(row =>
      Object.values(row).some(v => String(v ?? '').toLowerCase().includes(lowerSearch))
    );
  }

  // Sort
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  // Paginate
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "font-semibold text-xs uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none hover:text-foreground",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-blue-600">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, i) => (
                <TableRow
                  key={i}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Showing {start + 1}-{Math.min(start + pageSize, filtered.length)} of {filtered.length}</span>
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map(s => (
                  <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">per page</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium">
              {page} / {totalPages || 1}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
