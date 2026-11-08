import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oenodpay.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "oenodPay: all your money, one simple app",
  applicationName: "oenodPay",
  openGraph: {
    type: "website", siteName: "oenodPay", locale: "en_CA",
    title: "oenodPay: all your money, one simple app",
    description: "Send money abroad, pay bills, spend with a Visa debit card, travel and grow your savings. Launching first in Canada.",
  },
  twitter: { card: "summary_large_image", title: "oenodPay", description: "All your money, one simple app. Launching first in Canada." },
  description:
    "Send money abroad, pay bills, spend with a Visa debit card, travel, check your credit and grow your savings. One app, launching first in Canada.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}<CookieConsent /></body>
    </html>
  );
}
