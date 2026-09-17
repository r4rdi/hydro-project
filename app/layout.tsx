import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hydro - Enterprise Smart Hydroponic IoT Platform",
  description: "Platform pemantauan dan pengontrolan sistem hidroponik presisi berbasis IoT skala industri",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col">{children}</body>
    </html>
  );
}
