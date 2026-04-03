'use client';

import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {icon || <FileX className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          {action.label}
        </Button>
      )}
    </div>
  );
}
