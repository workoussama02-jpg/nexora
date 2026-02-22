// Post-download deployment instructions modal
'use client';

import { X, ExternalLink } from 'lucide-react';

interface DeployInstructionsProps {
  open: boolean;
  onClose: () => void;
}

export default function DeployInstructions({ open, onClose }: DeployInstructionsProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a2e] p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold">Deploy Your Widget</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Follow these 3 steps to get your chat widget live on your website.</p>

        <ol className="mt-6 space-y-6">
          <li>
            <h3 className="font-semibold">1. Upload <code className="text-brand-primary">chat-widget.js</code> to Vercel</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>Create a free <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Vercel account <ExternalLink className="inline h-3 w-3" /></a>.</p>
              <p>Create a new project and upload the <code className="text-brand-primary">chat-widget.js</code> file.</p>
              <p>Copy the deployed URL, e.g.:</p>
              <div className="mt-1 rounded-lg bg-gray-100 dark:bg-black/40 p-3 font-mono text-xs text-gray-600 dark:text-gray-300">
                https://your-project.vercel.app/chat-widget.js
              </div>
            </div>
          </li>

          <li>
            <h3 className="font-semibold">2. Update the HTML snippet</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>Open <code className="text-brand-primary">embed.html</code> from the downloaded ZIP.</p>
              <p>Find <code className="text-yellow-600 dark:text-yellow-400">YOUR_CHAT_WIDGET_JS_URL_HERE</code> and replace it with your Vercel URL.</p>
            </div>
          </li>

          <li>
            <h3 className="font-semibold">3. Paste into your website</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>Copy the full contents of <code className="text-brand-primary">embed.html</code>.</p>
              <p>Paste it before the closing <code className="text-yellow-600 dark:text-yellow-400">&lt;/body&gt;</code> tag in your website&apos;s HTML.</p>
              <p>Save and publish — your widget is live!</p>
            </div>
          </li>
        </ol>

        <div className="mt-6 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-center">
          <a
            href="#"
            className="text-sm text-brand-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Watch tutorial video (coming soon)
          </a>
        </div>
      </div>
    </div>
  );
}
