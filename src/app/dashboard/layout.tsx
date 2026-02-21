// Dashboard layout — auth guard + navbar wrapper
'use client';

import { useUser } from '@insforge/nextjs';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import Spinner from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardNavbar userEmail={user?.email ?? ''} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
