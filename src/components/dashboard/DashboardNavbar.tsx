// Dashboard navbar with user menu
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, ChevronDown } from 'lucide-react';
import { insforge } from '@/lib/insforge';

interface DashboardNavbarProps {
  userEmail: string;
}

export default function DashboardNavbar({ userEmail }: DashboardNavbarProps) {
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

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
          <MessageSquare className="h-6 w-6 text-brand-primary" />
          Nexora
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="hidden sm:inline">{userEmail}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#1a1a2e] py-1 shadow-xl">
              <div className="border-b border-white/10 px-4 py-2 sm:hidden">
                <p className="truncate text-sm text-gray-400">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
