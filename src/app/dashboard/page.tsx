// Dashboard page — widget list with table layout
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Download, Trash2 } from 'lucide-react';
import { useUser } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';
import { listWidgets, deleteWidget, countWidgets } from '@/lib/widgets';
import { MAX_FREE_WIDGETS } from '@/lib/constants';
import type { WidgetRow } from '@/lib/types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import EmptyState from '@/components/dashboard/EmptyState';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();

  const [widgets, setWidgets] = useState<WidgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WidgetRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadWidgets = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await listWidgets(user.id);
    if (error) {
      showToast(error, 'error');
    } else {
      setWidgets(data ?? []);
    }
    setLoading(false);
  }, [user?.id, showToast]);

  useEffect(() => {
    loadWidgets();
  }, [loadWidgets]);

  async function handleCreateClick() {
    if (!user?.id) return;
    const { count } = await countWidgets(user.id);
    if (count >= MAX_FREE_WIDGETS) {
      showToast(
        "You've reached the widget limit for the Free plan. Upgrade to Pro for unlimited widgets.",
        'error'
      );
      return;
    }
    router.push('/dashboard/new');
  }

  async function handleDownload(widget: WidgetRow) {
    setDownloadingId(widget.id);
    try {
      // Refresh session to ensure token is valid
      const { data: sessionData } = await insforge.auth.getCurrentSession();
      if (!sessionData?.session) {
        showToast('Your session has expired. Please sign in again.', 'error');
        router.push('/login');
        setDownloadingId(null);
        return;
      }

      const res = await fetch('/api/generate-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: widget.webhook_url,
          webhookRoute: widget.webhook_route,
          logoUrl: widget.logo_url ?? '',
          companyName: widget.company_name,
          welcomeText: widget.welcome_text,
          responseTimeText: widget.response_time_text ?? '',
          poweredByText: widget.powered_by_text,
          poweredByLink: widget.powered_by_link,
          primaryColor: widget.primary_color,
          secondaryColor: widget.secondary_color,
          backgroundColor: widget.background_color,
          fontColor: widget.font_color,
          position: widget.position,
          widgetName: widget.name,
          config: widget.config,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        showToast(body?.error ?? 'Download failed. Please try again.', 'error');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-widget-${widget.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Widget files downloaded!', 'success');
    } catch {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || !user?.id) return;
    setDeleting(true);
    const { error } = await deleteWidget(deleteTarget.id, user.id);
    if (error) {
      showToast(error, 'error');
    } else {
      setWidgets((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      showToast('Widget deleted.', 'success');
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  const firstName = user?.profile?.name?.split(' ')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {firstName ? `Hello, ${firstName}` : 'Hello there'} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your chat widgets</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          New Widget
        </Button>
      </div>

      {/* Stats banner */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        Total Widgets: <span className="font-semibold">{widgets.length} / {MAX_FREE_WIDGETS}</span>
        {widgets.length >= MAX_FREE_WIDGETS && (
          <span className="ml-2 text-brand-primary">
            &mdash; <button className="hover:underline font-medium">Upgrade to Pro</button> for unlimited widgets
          </span>
        )}
      </div>

      {widgets.length === 0 ? (
        <EmptyState onCreateClick={handleCreateClick} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Created</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {widgets.map((widget) => (
                  <tr key={widget.id} className="bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/edit/${widget.id}`}
                        className="font-medium text-brand-primary hover:underline"
                      >
                        {widget.name}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                        {widget.webhook_url}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatDate(widget.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/edit/${widget.id}`}
                          className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDownload(widget)}
                          disabled={downloadingId === widget.id}
                          className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-50"
                          title="Download"
                        >
                          <Download className={`h-4 w-4 ${downloadingId === widget.id ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(widget)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4"
              >
                <Link
                  href={`/dashboard/edit/${widget.id}`}
                  className="font-medium text-brand-primary hover:underline"
                >
                  {widget.name}
                </Link>
                <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                  {widget.webhook_url}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(widget.created_at)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/edit/${widget.id}`}
                      className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDownload(widget)}
                      disabled={downloadingId === widget.id}
                      className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition disabled:opacity-50"
                      title="Download"
                    >
                      <Download className={`h-4 w-4 ${downloadingId === widget.id ? 'animate-pulse' : ''}`} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(widget)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={!!deleteTarget}
        title="Delete Widget"
        message="Are you sure you want to delete this widget? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
