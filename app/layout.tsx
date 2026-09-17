import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hydro - Enterprise Smart Hydroponic IoT Platform",
  description: "Platform pemantauan dan pengontrolan sistem hidroponik presisi berbasis IoT skala industri",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} antialiased dark`}>
      <body className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans">{children}</body>
    </html>
  );
}
