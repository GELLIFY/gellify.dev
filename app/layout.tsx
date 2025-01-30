import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import { Analytics } from '@vercel/analytics/react';
import {Navbar} from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gellify.dev'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'GELLIFY.dev',
    template: '%s | GELLIFY.dev',
  },
  description: 'Frontend developer, optimist, community builder.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${inter.className}`}>
        <body className="antialiased flex flex-col tracking-tight min-h-screen">
          <Navbar />
          <main className="w-full overflow-hidden top-[--header-height] !h-[calc(100svh-var(--header-height))]">
            {children}
          </main>
          {/* <Footer /> */}
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}

function Footer() {
  const links = [
    { name: '@gellifygroup', url: 'https://x.com/gellifygroup' },
    { name: 'youtube', url: 'https://www.youtube.com/@gellifygroup4917' },
    { name: 'linkedin', url: 'https://it.linkedin.com/company/gellify' },
    { name: 'github', url: 'https://github.com/GELLIFY' },
  ];

  return (
    <footer className="mt-12 mb-6 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
