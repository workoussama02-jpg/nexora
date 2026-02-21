// Dashboard page — widget list with CRUD actions
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useUser } from '@insforge/nextjs';
import { listWidgets, deleteWidget, countWidgets } from '@/lib/widgets';
import { MAX_FREE_WIDGETS } from '@/lib/constants';
import type { WidgetRow } from '@/lib/types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import WidgetCard from '@/components/dashboard/WidgetCard';
import EmptyState from '@/components/dashboard/EmptyState';

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

  function handleEdit(id: string) {
    router.push(`/dashboard/edit/${id}`);
  }

  async function handleDownload(widget: WidgetRow) {
    setDownloadingId(widget.id);
    try {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Widgets</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          New Widget
        </Button>
      </div>

      {widgets.length === 0 ? (
        <EmptyState onCreateClick={handleCreateClick} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              onEdit={handleEdit}
              onDownload={handleDownload}
              onDelete={setDeleteTarget}
              downloading={downloadingId === widget.id}
            />
          ))}
        </div>
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
