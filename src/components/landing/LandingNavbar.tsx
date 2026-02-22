// Landing page top navigation bar
'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function LandingNavbar() {
  return (
    <header className="fixed top-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      <nav className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-3 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <MessageSquare className="h-6 w-6 text-brand-primary" />
          Nexora
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Pricing
          </a>
          <Link href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
        <Link
          href="/signup"
          className="rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-medium text-white md:hidden"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
