// Confirmation dialog/modal
'use client';

import { useEffect, useRef } from 'react';
import Button from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function Modal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}: ModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div
        className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a2e] p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
