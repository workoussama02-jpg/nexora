// Support page stub
'use client';

import { LifeBuoy } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 dark:bg-brand-primary/20">
        <LifeBuoy className="h-8 w-8 text-brand-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Support</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        Need help? Contact our support team or browse the knowledge base. Coming soon.
      </p>
    </div>
  );
}
