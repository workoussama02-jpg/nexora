// Support page — FAQ, contact, and help resources
'use client';

import { useState } from 'react';
import {
  LifeBuoy, Mail, MessageSquare, ChevronDown, ChevronUp,
  BookOpen, Zap, Shield, Settings2, Code2, HelpCircle,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How do I create my first widget?',
    answer: 'Go to the Dashboard and click "New Widget". Fill in your webhook URL, company name, colors, and other settings. Click "Create Widget" to save, then download the generated files.',
    icon: Zap,
  },
  {
    question: 'What is the webhook URL?',
    answer: 'The webhook URL is the endpoint your chatbot backend listens on (e.g., from n8n, Make, or a custom API). The widget sends user messages to this URL and displays the response.',
    icon: Code2,
  },
  {
    question: 'How do I install the widget on my website?',
    answer: 'After creating a widget, download the ZIP file from the Dashboard. Extract the files and add the <script> tag to your website\'s HTML before the closing </body> tag. Full instructions are included in the download.',
    icon: Settings2,
  },
  {
    question: 'Can I customize the widget appearance?',
    answer: 'Yes — you can change colors, position, welcome text, logo, bubble style, starter prompts, social links, language, and many more options. Use the visual editor when creating or editing a widget.',
    icon: MessageSquare,
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Your widget configurations are stored securely and tied to your account. Messages go directly from the widget to your webhook — Nexora does not store conversation data.',
    icon: Shield,
  },
  {
    question: 'How many widgets can I create?',
    answer: 'On the current plan you can create multiple widgets. Each widget has its own configuration and can be deployed independently on different websites.',
    icon: HelpCircle,
  },
  {
    question: 'Can I use the widget with n8n?',
    answer: 'Absolutely. Nexora widgets are designed to work seamlessly with n8n webhook triggers. Set your n8n webhook URL as the widget\'s webhook URL and connect any AI model or workflow.',
    icon: Zap,
  },
  {
    question: 'How do I update an existing widget?',
    answer: 'Go to the Dashboard, click the edit icon on the widget you want to change, update the settings, and save. Then re-download the ZIP to get the updated files.',
    icon: Settings2,
  },
];

function FaqItem({ item }: { item: typeof FAQ_ITEMS[number] }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 transition hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20">
          <Icon className="h-4 w-4 text-brand-primary" />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
          {item.question}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </div>
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {item.answer}
          </p>
        </div>
      )}
    </button>
  );
}

export default function SupportPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Find answers to common questions or reach out to our team.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <a
          href="mailto:support@nexora.chat"
          className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 p-6 text-center transition hover:border-brand-primary hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 transition group-hover:bg-brand-primary/20">
            <Mail className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Us</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">support@nexora.chat</p>
          </div>
        </a>

        <a
          href="/dashboard/docs"
          className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 p-6 text-center transition hover:border-brand-primary hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 transition group-hover:bg-brand-primary/20">
            <BookOpen className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Documentation</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Guides &amp; reference</p>
          </div>
        </a>

        <a
          href="https://discord.gg/nexora"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 p-6 text-center transition hover:border-brand-primary hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 transition group-hover:bg-brand-primary/20">
            <LifeBuoy className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Community</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Join our Discord</p>
          </div>
        </a>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Quick answers to the most common questions.
        </p>
        <div className="mt-4 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.question} item={item} />
          ))}
        </div>
      </div>

      {/* Still need help */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-brand-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Still need help?
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Our team typically responds within a few hours on business days.
            </p>
          </div>
          <a
            href="mailto:support@nexora.chat"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 shrink-0"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
