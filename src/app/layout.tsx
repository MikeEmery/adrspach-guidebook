import type { Metadata, Viewport } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Little Adrspach - Climbing Guide",
  description:
    "Mobile-friendly climbing guide for Little Adrspach. 46 routes across 8 walls.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#2c1810] text-[#a69585] text-center text-sm py-6">
          <div className="max-w-5xl mx-auto px-4">
            <p className="font-semibold text-[#d4c4b0] mb-1">Little Adrspach</p>
            <p>2025 Edition &middot; Paddle in, climb up, enjoy the rock</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
