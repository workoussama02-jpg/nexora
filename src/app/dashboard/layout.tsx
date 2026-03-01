// Dashboard layout — auth guard + navbar + sidebar wrapper
'use client';

import { useUser } from '@insforge/nextjs';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import SideNav from '@/components/dashboard/SideNav';
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
      <DashboardNavbar
        userEmail={user?.email ?? ''}
        userName={user?.profile?.name ?? ''}
      />
      <SideNav />
      <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
