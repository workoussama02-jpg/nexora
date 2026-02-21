// Root layout — global providers, Geist font, Tailwind styles
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nexora — Build & Customize Your AI Chat Widget',
  description:
    'Create, customize, and download a production-ready chat widget for your website. Connect any n8n webhook or AI agent — no monthly fees.',
  openGraph: {
    title: 'Nexora — Build & Customize Your AI Chat Widget',
    description:
      'Create, customize, and download a production-ready chat widget for your website.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-[#0a0a0f] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
