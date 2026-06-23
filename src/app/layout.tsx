import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Lockd.AI — Lock in. Level up.",
  description: "Turn any notes, PDF, YouTube video, or lecture into flashcards, podcasts, gossip breakdowns, and more — powered by AI.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Lockd.AI — Lock in. Level up.",
    description: "AI-powered study tool for students. Free forever.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full bg-zinc-950 text-zinc-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
