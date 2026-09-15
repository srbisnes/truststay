import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { AITranslator } from "@/components/AITranslator";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustStay – Secure Decentralized Stays",
  description:
    "Trustless Airbnb alternative on Base. Escrow-protected bookings, on-chain reputation, crypto + ARS, AI agents. No scams. Worldwide.",
  openGraph: {
    title: "TrustStay",
    description: "Rent homes worldwide. No one gets scammed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-950 text-white">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <AITranslator />
        </Providers>
      </body>
    </html>
  );
}
