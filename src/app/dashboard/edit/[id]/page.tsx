// Edit widget page — customizer in edit mode, loads saved config
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@insforge/nextjs';
import { getWidget } from '@/lib/widgets';
import type { WidgetRow } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import CustomizerForm from '@/components/customizer/CustomizerForm';

export default function EditWidgetPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { showToast } = useToast();

  const [widget, setWidget] = useState<WidgetRow | null>(null);
  const [loading, setLoading] = useState(true);

  const widgetId = params.id as string;

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    async function load() {
      const { data, error } = await getWidget(widgetId, user!.id);
      if (error || !data) {
        showToast(error ?? 'Widget not found.', 'error');
        router.push('/dashboard');
        return;
      }
      setWidget(data);
      setLoading(false);
    }

    load();
  }, [widgetId, user?.id, isLoaded, router, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Edit Widget</h1>
      <CustomizerForm widget={widget} />
    </div>
  );
}
