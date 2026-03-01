// Billing page
'use client';

import { CreditCard, Check } from 'lucide-react';

const FEATURES = [
  'Unlimited widgets',
  'All customization options',
  'Download & self-host widget files',
  'All tabs: Bubble, Tooltip, Window, Footer, Advanced, Welcome Page',
  'Interactive preview',
  'Clone & manage widgets',
  'Light & dark mode',
  'No credit card required',
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="rounded-xl border border-brand-primary/30 bg-brand-primary/5 dark:bg-brand-primary/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 dark:bg-brand-primary/25">
            <CreditCard className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">Free Plan</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">All Features Included</p>
          </div>
          <span className="ml-auto rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold text-brand-primary">
            Active
          </span>
        </div>

        <ul className="space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Check className="h-4 w-4 text-brand-primary flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 opacity-60">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">Pro Plan</p>
          <span className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Advanced analytics, priority support, and team collaboration — coming in a future update.
        </p>
      </div>
    </div>
  );
}
