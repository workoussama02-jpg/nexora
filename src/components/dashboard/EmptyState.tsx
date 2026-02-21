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
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <MessageSquarePlus className="h-12 w-12 text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold text-white">You haven&apos;t created any widgets yet.</h2>
      <p className="mt-2 text-sm text-gray-400">
        Create your first chat widget and start customizing it.
      </p>
      <Button onClick={onCreateClick} className="mt-6">
        Create New Widget
      </Button>
    </div>
  );
}
