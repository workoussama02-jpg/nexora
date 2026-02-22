// Widget card for dashboard list
'use client';

import { Pencil, Download, Trash2 } from 'lucide-react';
import type { WidgetRow } from '@/lib/types';

interface WidgetCardProps {
  widget: WidgetRow;
  onEdit: (id: string) => void;
  onDownload: (widget: WidgetRow) => void;
  onDelete: (widget: WidgetRow) => void;
  downloading?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function WidgetCard({ widget, onEdit, onDownload, onDelete, downloading }: WidgetCardProps) {
  return (
    <div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5 transition hover:border-brand-primary/30 hover:bg-gray-100 dark:hover:bg-white/[0.07]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{widget.name}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created {formatDate(widget.created_at)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(widget.id)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-white/10"
          title="Edit widget"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDownload(widget)}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50"
          title="Download files"
        >
          <Download className={`h-4 w-4 ${downloading ? 'animate-pulse' : ''}`} />
          Download
        </button>
        <button
          onClick={() => onDelete(widget)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
          title="Delete widget"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
