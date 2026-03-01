// Sidebar navigation for the dashboard
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, CreditCard, LifeBuoy, Settings2, BookOpen,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/docs', label: 'Documentation', icon: BookOpen },
];

const OPTIONS_ITEMS = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

const STORAGE_KEY = 'nexora-sidebar-state';

export default function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const isCollapsed = stored === 'collapsed';
    setCollapsed(isCollapsed);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? 'collapsed' : 'expanded');
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  // Prevent layout flash before localStorage is read
  if (!mounted) {
    return null;
  }

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType; exact?: boolean }) => {
    const active = isActive(item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-[#1a1a2e] border-r border-gray-200 dark:border-gray-700 shadow-sm"
      style={{
        width: collapsed ? 60 : 240,
        transition: 'width 200ms ease',
      }}
    >
      <nav className="flex flex-col gap-4 p-4 flex-1">
        {/* Menu group */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Menu
            </p>
          )}
          {MENU_ITEMS.map(renderNavItem)}
        </div>

        {/* Options group */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Options
            </p>
          )}
          {OPTIONS_ITEMS.map(renderNavItem)}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </nav>
    </aside>
  );
}
