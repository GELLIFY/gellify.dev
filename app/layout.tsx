import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://gellify.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "GELLIFY.dev",
    template: "%s | GELLIFY.dev",
  },
  description: "Frontend developer, optimist, community builder.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col tracking-tight min-h-screen`}
        >
          <Navbar />
          <main className="w-full overflow-hidden top-(--header-height) h-[calc(100svh-var(--header-height))]!">
            {children}
          </main>
          {/* <Footer /> */}
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
