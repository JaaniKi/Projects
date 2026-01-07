import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "../components/shared/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Quiz",
  description: "Real-time music quiz party game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-50`}
      >
        {/* Global header */}
        <TopBar />

        {/* Background */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,130,246,0.25),transparent_60%)]" />

        {/* Content */}
        <main className="relative mx-auto min-h-[calc(100vh-64px)] max-w-4xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
