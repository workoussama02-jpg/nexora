// App-level providers — InsForge auth provider + Toast notifications
'use client';

import { InsforgeBrowserProvider } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InsforgeBrowserProvider client={insforge} afterSignInUrl="/dashboard">
      <ToastProvider>{children}</ToastProvider>
    </InsforgeBrowserProvider>
  );
}
