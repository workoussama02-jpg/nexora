// Billing page stub
'use client';

import { CreditCard } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 dark:bg-brand-primary/20">
        <CreditCard className="h-8 w-8 text-brand-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Billing</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Manage your subscription, view invoices, and update your payment method. Coming soon.
      </p>
    </div>
  );
}
