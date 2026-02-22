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
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <SideNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
