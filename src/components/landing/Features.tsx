// Features section — 6 key selling points
import { Eye, FileArchive, Server, Webhook, CircleDollarSign, Zap } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Live Preview',
    description: 'See exactly how your widget will look as you customize — instant updates, no guessing.',
  },
  {
    icon: FileArchive,
    title: 'Download-Ready Files',
    description: 'Get a ZIP with your customized JS widget and an HTML embed snippet, ready to deploy.',
  },
  {
    icon: Server,
    title: 'Self-Hosted',
    description: 'You own your files. Host them on Vercel, Netlify, or anywhere — total control.',
  },
  {
    icon: Webhook,
    title: 'Any Webhook / AI Agent',
    description: 'Works with any n8n webhook or AI agent endpoint. Bring your own backend logic.',
  },
  {
    icon: CircleDollarSign,
    title: 'No Monthly Widget Fees',
    description: 'Download once, use forever. No recurring charges for the widget itself.',
  },
  {
    icon: Zap,
    title: 'Easy Setup',
    description: 'Step-by-step instructions included. Get your widget live in under 5 minutes.',
  },
];

export default function Features() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Everything You Need</h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">A complete toolkit for creating beautiful chat widgets.</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 text-left transition-colors hover:border-brand-primary/30"
            >
              <feature.icon className="h-8 w-8 text-brand-primary" />
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
