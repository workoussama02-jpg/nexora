// How it works — 3-step visual guide
import { UserPlus, Palette, Download } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create an account & log in',
    description: 'Sign up in seconds with your email. No credit card required.',
  },
  {
    number: 2,
    icon: Palette,
    title: 'Customize your widget',
    description:
      'Pick colors, add your logo, write welcome text, enter your webhook URL — all with a live preview.',
  },
  {
    number: 3,
    icon: Download,
    title: 'Download & embed',
    description:
      'Download your files, upload the JS to any static host, paste the HTML snippet into your site.',
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
        <p className="mt-3 text-gray-400">Three simple steps to a live chat widget on your site.</p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-bold text-white">
                {step.number}
              </div>
              <step.icon className="mx-auto mt-4 h-10 w-10 text-brand-primary" />
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
