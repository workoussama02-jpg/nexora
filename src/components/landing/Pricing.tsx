// Pricing section — Free and Pro (Coming Soon) cards
import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '1 widget',
      'All customization options',
      'Download ZIP files',
      'Powered By branding included',
    ],
    cta: 'Get Started',
    href: '/signup',
    disabled: false,
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'TBD',
    description: 'For power users and agencies',
    features: [
      'Unlimited widgets',
      'Remove or customize Powered By',
      'Priority support',
      'Future premium features',
    ],
    cta: 'Coming Soon',
    href: '#',
    disabled: true,
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
        <p className="mt-3 text-gray-400">Start free. Upgrade when you need more.</p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 text-left ${
                tier.highlighted
                  ? 'border-brand-primary/40 bg-brand-primary/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                  Coming Soon
                </span>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{tier.description}</p>
              <p className="mt-4 text-4xl font-bold">
                {tier.price}
                {tier.price !== 'TBD' && <span className="text-lg font-normal text-gray-400">/forever</span>}
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {tier.disabled ? (
                  <button
                    disabled
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <Link
                    href={tier.href}
                    className="block w-full rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    {tier.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
