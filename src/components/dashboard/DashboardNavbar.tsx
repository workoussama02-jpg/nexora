// Dashboard navbar with profile avatar and user menu
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, Settings, ChevronDown } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import ThemeToggle from '@/components/ThemeToggle';
import SessionTimer from './SessionTimer';

interface DashboardNavbarProps {
  userEmail: string;
  userName: string;
}

const AVATAR_COLORS = [
  '#854fff', '#e53e3e', '#dd6b20', '#38a169', '#3182ce',
  '#805ad5', '#d53f8c', '#2b6cb0', '#319795', '#718096',
];

function getAvatarColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name: string, email: string): string {
  if (name) return name.charAt(0).toUpperCase();
  return email.charAt(0).toUpperCase();
}

export default function DashboardNavbar({ userEmail, userName }: DashboardNavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await insforge.auth.signOut();
    router.push('/login');
  }

  const avatarColor = getAvatarColor(userEmail);
  const initial = getInitial(userName, userEmail);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
          <MessageSquare className="h-6 w-6 text-brand-primary" />
          Nexora
        </Link>

        <div className="flex items-center gap-2">
          <SessionTimer />
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 dark:hover:bg-white/10"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {initial}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a2e] py-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="border-b border-gray-200 dark:border-white/10 px-4 py-3">
                  {userName ? (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                  ) : (
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-brand-primary hover:underline"
                    >
                      Set your name
                    </Link>
                  )}
                  <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
