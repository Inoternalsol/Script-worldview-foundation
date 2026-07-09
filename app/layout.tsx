import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scriptworldview.org'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Script Worldview Foundation — Shaping Minds, Transforming Communities',
    template: '%s | Script Worldview Foundation',
  },
  description:
    'A faith-inspired Nigerian NGO advancing education, humanitarian response, community development, and youth empowerment across Plateau State and Nigeria since 2016.',
  keywords: [
    'NGO Nigeria', 'Script Worldview Foundation', 'education Nigeria', 'humanitarian aid Plateau State',
    'community development', 'youth empowerment', 'Jos Nigeria NGO', 'donate Nigeria',
  ],
  authors: [{ name: 'Script Worldview Foundation', url: APP_URL }],
  creator: 'Script Worldview Foundation',
  publisher: 'Script Worldview Foundation',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: APP_URL,
    siteName: 'Script Worldview Foundation',
    title: 'Script Worldview Foundation — Shaping Minds, Transforming Communities',
    description: 'A faith-inspired Nigerian NGO advancing education, humanitarian response, and sustainable community development since 2016.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Script Worldview Foundation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Script Worldview Foundation',
    description: 'Advancing education, humanitarian response, and community development across Nigeria.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="relative min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
