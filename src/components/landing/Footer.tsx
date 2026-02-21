// Landing page footer
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <MessageSquare className="h-5 w-5 text-brand-primary" />
          Nexora
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
          <Link href="/signup" className="hover:text-white transition-colors">
            Sign Up
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-5xl text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Nexora. All rights reserved.
      </div>
    </footer>
  );
}
