// Hero section — headline, subheadline, CTA, and widget mockup
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left — Copy */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build &amp; Customize Your{' '}
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AI Chat Widget
            </span>{' '}
            in Minutes
          </h1>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
            Download the files, host them yourself, embed anywhere — no monthly
            fees for the widget.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-primary/25 transition-transform hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Right — Widget mockup */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 backdrop-blur-sm">
            {/* Mini browser chrome */}
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            {/* Widget preview illustration */}
            <div className="relative aspect-[380/500] overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-[#0f0f1a]">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <div className="h-8 w-8 rounded-full bg-brand-primary/30" />
                <span className="text-sm font-medium text-white">Your Bot</span>
              </div>
              {/* Welcome */}
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-lg font-semibold text-white">Hi, how can we help?</p>
                <div className="mt-4 w-full rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-medium text-white">
                  Send us a message
                </div>
                <p className="mt-2 text-xs text-gray-500">We typically respond right away</p>
              </div>
            </div>
          </div>
          {/* Floating toggle */}
          <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
