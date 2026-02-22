// Empty dashboard state
'use client';

import { MessageSquarePlus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8">
        <MessageSquarePlus className="h-16 w-16 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold">You haven&apos;t created any widgets yet.</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first chat widget.
      </p>
      <Button onClick={onCreateClick} className="mt-6">
        Create New Widget
      </Button>
    </div>
  );
}
