// Documentation page — comprehensive guide for Nexora users
'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const TOC = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'widget-settings', label: 'Widget Settings Tab' },
  { id: 'bubble-tab', label: 'Bubble Tab' },
  { id: 'tooltip-tab', label: 'Tooltip Tab' },
  { id: 'welcome-page-tab', label: 'Welcome Page Tab' },
  { id: 'window-tab', label: 'Window Tab' },
  { id: 'footer-tab', label: 'Footer Tab' },
  { id: 'advanced-tab', label: 'Advanced Tab' },
  { id: 'downloading-deploying', label: 'Downloading & Deploying' },
  { id: 'dashboard-actions', label: 'Dashboard Actions' },
  { id: 'faq', label: 'FAQ' },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-semibold text-gray-900 dark:text-white">{name}: </span>
      {children}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
        {n}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 p-4">
      <p className="font-semibold text-gray-900 dark:text-white mb-1">{q}</p>
      <p className="text-gray-600 dark:text-gray-400">{a}</p>
    </div>
  );
}

export default function DocsPage() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="flex gap-8">
      {/* Desktop sticky TOC */}
      <aside className="hidden xl:block w-52 shrink-0">
        <nav className="sticky top-8 space-y-1">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Contents
          </p>
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 max-w-3xl">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20">
            <BookOpen className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to build and deploy your chat widget.</p>
          </div>
        </div>

        {/* Mobile TOC toggle */}
        <div className="xl:hidden mb-6">
          <button
            onClick={() => setTocOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Table of Contents
            {tocOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {tocOpen && (
            <nav className="mt-1 rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setTocOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* ── Getting Started ─────────────────────────────── */}
        <Section id="getting-started" title="Getting Started">
          <p>
            <strong>What is Nexora?</strong> Nexora is a no-code chat widget builder that lets you create, customize, and deploy an AI-powered chat widget on any website — no coding experience required. You connect your own AI backend (such as an n8n workflow) and Nexora generates a plug-and-play JavaScript file you can embed anywhere.
          </p>
          <p className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">How it works — 3 steps</p>
          <div className="space-y-3">
            <Step n={1}><strong>Create</strong> — Give your widget a name on the dashboard and click "New Widget".</Step>
            <Step n={2}><strong>Customize</strong> — Use the visual customizer to design every aspect of your widget: colors, branding, messaging, and behavior.</Step>
            <Step n={3}><strong>Download &amp; Deploy</strong> — Download the generated ZIP file, host the JS file (Vercel recommended), and paste the embed snippet into your website's HTML.</Step>
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">Quick start guide</p>
          <div className="space-y-3">
            <Step n={1}>Click <strong>"New Widget"</strong> on the dashboard to open the customizer.</Step>
            <Step n={2}>Enter a <strong>Widget Name</strong> and your <strong>Webhook URL</strong> in the Widget Settings tab.</Step>
            <Step n={3}>Customize the look and feel using the other tabs. The live preview on the right updates instantly.</Step>
            <Step n={4}>Click <strong>"Save"</strong> to store your changes in the cloud, then <strong>"Download Files"</strong> to get the ZIP.</Step>
            <Step n={5}>Follow the <a href="#downloading-deploying" className="text-brand-primary underline">Downloading &amp; Deploying</a> guide to go live.</Step>
          </div>
        </Section>

        {/* ── Widget Settings ──────────────────────────────── */}
        <Section id="widget-settings" title="Widget Settings Tab">
          <Field name="Widget Name">Internal label for your own reference. Not displayed to visitors. Use a descriptive name like <em>"Website Support Bot"</em> or <em>"E-commerce FAQ Widget"</em>.</Field>
          <Field name="Webhook URL">The URL your n8n workflow (or any AI agent endpoint) listens on. Every user message is forwarded here as a POST request. Must start with <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">http://</code> or <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">https://</code>. Example: <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">https://yourn8n.app.n8n.cloud/webhook/abc123</code>.</Field>
          <Field name="Route">An optional routing identifier sent alongside every message in the request payload. Defaults to <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">"general"</code>. Useful when a single webhook handles multiple intents — e.g., <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">"support"</code> vs <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">"sales"</code>.</Field>
          <Field name="Logo URL">A publicly accessible URL to your brand logo. Supported formats: PNG, JPG, SVG. Host it on Imgur, Cloudinary, or your own CDN — it must be reachable by any browser without authentication.</Field>
          <Field name="Company / Bot Name">The name displayed in the widget header and welcome screen.</Field>
          <Field name="Response Time Text">A short subtext visible on the welcome screen beneath the company name. Example: <em>"We usually respond in a few minutes"</em>.</Field>
        </Section>

        {/* ── Bubble Tab ───────────────────────────────────── */}
        <Section id="bubble-tab" title="Bubble Tab">
          <p>The Bubble is the floating button users click to open the chat window.</p>
          <Field name="Border Radius Style"><strong>Circle</strong> — perfectly round button (most common). <strong>Rounded</strong> — slightly rounded square. <strong>None</strong> — sharp square corners.</Field>
          <Field name="Background Color">The fill color of the bubble. Use your brand's primary color for best recognition.</Field>
          <Field name="Custom Icon URL">Paste the URL of an SVG or PNG to replace the default chat icon. Leave this empty to use the default speech-bubble icon.</Field>
          <Field name="Custom Icon Size">Controls how much of the bubble area the icon occupies (as a percentage). 60–80% is recommended for most icons.</Field>
          <Field name="Bubble Size">The diameter of the floating button in pixels. Default is 60px — avoid going below 48px for accessibility.</Field>
          <Field name="Position">Distance from the screen edges (bottom and right/left). Adjust if the bubble overlaps other page elements.</Field>
          <Field name="Auto Open">Automatically opens the chat window when the page loads. Use sparingly — unexpected pop-ups can be intrusive.</Field>
          <Field name="Open Delay">Seconds to wait after page load before auto-opening. A delay of 5–10 seconds is recommended if you use Auto Open.</Field>
          <Field name="Toggle Animation">Adds subtle animated effects to the bubble (pulse, bounce, etc.) to draw the visitor's attention.</Field>
        </Section>

        {/* ── Tooltip Tab ──────────────────────────────────── */}
        <Section id="tooltip-tab" title="Tooltip Tab">
          <p>A small speech bubble that appears next to the chat bubble to prompt engagement.</p>
          <Field name="Display Tooltip">Toggle to show or hide the tooltip globally.</Field>
          <Field name="Hide on Mobile">Recommended: ON. Tooltips on mobile can overlap content and feel intrusive on small screens.</Field>
          <Field name="Message">The text inside the tooltip. Keep it short and actionable. Example: <em>"Need help? Chat with us!"</em> or <em>"Ask me anything 👋"</em>.</Field>
          <Field name="Background Color">The tooltip bubble's fill color.</Field>
          <Field name="Text Color">The color of the tooltip text.</Field>
          <Field name="Font Size">Controls tooltip text size in pixels.</Field>
        </Section>

        {/* ── Welcome Page Tab ─────────────────────────────── */}
        <Section id="welcome-page-tab" title="Welcome Page Tab">
          <p>The welcome screen is the first thing users see when they open the chat widget, before sending any message.</p>
          <Field name="Welcome Text">The main greeting message on the welcome screen. Example: <em>"Hi there 👋 How can we help you today?"</em></Field>
          <Field name="Custom Button Text">The label on the "Send us a message" call-to-action button. Default: <em>"Send us a message"</em>.</Field>
          <Field name="Logo">Choose whether to show your brand logo on the welcome screen, its position (left / center / right), and an optional entrance animation.</Field>
          <Field name="Button Animation">A subtle animation on the CTA button to draw user attention and encourage them to start a conversation.</Field>
        </Section>

        {/* ── Window Tab ───────────────────────────────────── */}
        <Section id="window-tab" title="Window Tab">
          <p>Controls the appearance and behavior of the main chat window.</p>
          <Field name="Window Height / Width">Drag the sliders to set the chat window size in pixels. Height: 300–800px. Width: 300–600px. The live preview updates in real time.</Field>
          <Field name="Background Color">The background color of the chat message area.</Field>
          <Field name="Border Radius">Rounded corner radius of the chat window.</Field>
          <Field name="Header">Customize the header bar: title text, avatar image, and social media icon links.</Field>
          <Field name="Starter Prompts">Add 2–4 clickable suggestion chips that appear on the welcome screen. Best practice: add your most common questions (e.g., "What are your hours?", "How do I return an item?").</Field>
          <Field name="Bot / User Message Colors">Set the background and text color for bot messages and user messages independently.</Field>
          <Field name="Timestamps">Toggle to show the time each message was sent, below each bubble.</Field>
          <Field name="Shadow / Glow">Adds a soft box shadow around the chat window. Useful for making the widget stand out on busy pages.</Field>
          <Field name="Typing Indicator">Shows three animated dots while the bot is processing a response. Strongly recommended — it provides visual feedback that the system is working.</Field>
          <Field name="Refresh Button">Adds a button in the header that lets users restart the conversation from scratch.</Field>
          <Field name="Send Button">Customize the icon or style of the message send button.</Field>
          <Field name="Emoji Picker">Enables an emoji picker button in the message input bar.</Field>
          <Field name="Max Characters">Set a character limit for user messages. Leave at 0 for no limit.</Field>
        </Section>

        {/* ── Footer Tab ───────────────────────────────────── */}
        <Section id="footer-tab" title="Footer Tab">
          <p>The footer appears at the bottom of the chat window, typically used for branding.</p>
          <Field name="Footer Text">The label before your brand name. Example: <em>"Powered by"</em>.</Field>
          <Field name="Company Name">Your brand or company name shown in the footer link.</Field>
          <Field name="Company Link">The URL users are taken to when they click your brand name in the footer.</Field>
          <Field name="Logo in Footer">Optionally display a small logo image next to the brand name.</Field>
          <Field name="Text Color">The color of the footer text.</Field>
          <Field name="Custom HTML Mode">For advanced users: replace the entire footer with your own HTML markup. Useful for adding custom disclaimers, legal links, or styling.</Field>
        </Section>

        {/* ── Advanced Tab ─────────────────────────────────── */}
        <Section id="advanced-tab" title="Advanced Tab">
          <Field name="Language Selector">Let users switch between English (EN), French (FR), and Arabic (AR) inside the widget. Selecting Arabic automatically switches the widget to a right-to-left (RTL) layout.</Field>
          <Field name="Color Transitions">Animates gradient color shifts on the header, CTA buttons, and message bubbles. Creates a dynamic, eye-catching effect.</Field>
          <Field name="Falling Effect">A decorative particle animation — logos or shapes rain gently inside the widget. Use sparingly; avoid on professional support widgets.</Field>
          <Field name="Custom Cursor">Replaces the mouse cursor when hovering inside the widget area with a custom image URL.</Field>
          <Field name="Custom CSS">Inject your own CSS rules directly into the widget. Overrides any built-in styles. Use this for edge cases only — most styling is covered by the visual options above. Example: <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">.chat-bubble {"{"} font-family: 'Georgia', serif; {"}"}</code></Field>
        </Section>

        {/* ── Downloading & Deploying ───────────────────────── */}
        <Section id="downloading-deploying" title="Downloading & Deploying Your Widget">
          <div className="space-y-3">
            <Step n={1}>Click <strong>"Download Files"</strong> in the customizer, or the <strong>Download icon</strong> on a widget row in the dashboard. A ZIP file will be saved to your computer.</Step>
            <Step n={2}>
              Open the ZIP. It contains two files:
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li><code className="bg-gray-100 dark:bg-white/10 px-1 rounded">chat-widget.js</code> — The customized widget script. Host this on any static file server.</li>
                <li><code className="bg-gray-100 dark:bg-white/10 px-1 rounded">embed.html</code> — A ready-made embed snippet to paste into your website.</li>
              </ul>
            </Step>
            <Step n={3}>
              <strong>Host the JS file on Vercel (recommended):</strong>
              <ol className="mt-2 ml-4 space-y-1 list-decimal">
                <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary inline-flex items-center gap-1">vercel.com <ExternalLink className="h-3 w-3" /></a> and create a free account.</li>
                <li>Create a new project → drag-and-drop only the <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">chat-widget.js</code> file.</li>
                <li>Copy the deployed file URL (e.g., <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">https://your-project.vercel.app/chat-widget.js</code>).</li>
              </ol>
            </Step>
            <Step n={4}>Open <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">embed.html</code> in a text editor, find <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">YOUR_CHAT_WIDGET_JS_URL_HERE</code>, and replace it with your Vercel URL.</Step>
            <Step n={5}>Copy all the HTML from <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">embed.html</code> and paste it just before the closing <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">&lt;/body&gt;</code> tag in your website's HTML. Save and publish — your widget is now live!</Step>
          </div>
          <div className="mt-4 rounded-lg bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 p-4">
            <p className="font-semibold text-brand-primary mb-1">Tip: Re-deploying after edits</p>
            <p>After editing your widget in Nexora, click Download again, then re-upload only the new <code className="bg-brand-primary/10 px-1 rounded">chat-widget.js</code> to Vercel. The URL stays the same — visitors will automatically get the updated widget within minutes thanks to Vercel's CDN cache invalidation.</p>
          </div>
        </Section>

        {/* ── Dashboard Actions ─────────────────────────────── */}
        <Section id="dashboard-actions" title="Dashboard Actions">
          <p>Each widget row in the dashboard has four action buttons:</p>
          <div className="space-y-3 mt-2">
            <Field name="Edit (Pencil icon)">Opens the full visual customizer with the widget's current configuration pre-loaded. All changes are saved when you click "Save" inside the customizer.</Field>
            <Field name="Clone (Copy icon)">Creates an exact duplicate of the widget. The copy appears at the top of your list with the name <em>"[Original Name] (Copy)"</em>. Use this to A/B test variations or quickly spin up a new widget based on an existing one.</Field>
            <Field name="Download (Download icon)">Generates and downloads the widget ZIP immediately — no need to open the customizer first. Uses the most recently saved configuration.</Field>
            <Field name="Delete (Trash icon)">Permanently removes the widget from your account. You will be asked to confirm before deletion. <strong>This action cannot be undone.</strong></Field>
          </div>
        </Section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <Section id="faq" title="FAQ">
          <div className="space-y-3">
            <QA
              q="Can I use the widget without any technical knowledge?"
              a="Yes! Once a developer or you has set up the initial embed snippet on your website, no further coding is required. All changes are made visually in Nexora."
            />
            <QA
              q="Does Nexora host my widget files?"
              a="No. You download the files and host them yourself (e.g., on Vercel for free). This gives you full control over your widget's availability, performance, and privacy."
            />
            <QA
              q="What is a Webhook URL?"
              a="It's the endpoint of your AI workflow (e.g., built in n8n). When a user sends a message, the widget POSTs it to this URL, your workflow generates a reply, and the widget displays it. Your workflow is responsible for the AI logic."
            />
            <QA
              q="Can I change my widget after downloading?"
              a="Yes! Edit it in Nexora, click Download again, and re-upload the new chat-widget.js to your hosting. Your embed snippet stays the same."
            />
            <QA
              q="Why is my bot not responding?"
              a="Make sure your n8n workflow is active and the Webhook URL is correct. Test the webhook directly using a tool like Postman or curl. Also check that CORS is enabled on your n8n workflow for your website's domain."
            />
            <QA
              q="Is there a limit to how many widgets I can create?"
              a="No! All features are included in the Free plan with no limits on the number of widgets."
            />
            <QA
              q="The widget appears in the preview but not on my website — why?"
              a="Double-check that the chat-widget.js URL in your embed snippet is correct and publicly accessible. Open the URL directly in a browser — you should see JavaScript code, not a 404 error."
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
