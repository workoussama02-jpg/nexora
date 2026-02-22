// App-level providers — InsForge auth provider + Toast notifications + Theme
'use client';

import { InsforgeBrowserProvider } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InsforgeBrowserProvider client={insforge} afterSignInUrl="/dashboard">
        <ToastProvider>{children}</ToastProvider>
      </InsforgeBrowserProvider>
    </ThemeProvider>
  );
}
