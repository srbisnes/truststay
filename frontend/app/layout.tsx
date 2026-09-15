import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { AITranslator } from "@/components/AITranslator";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustStay – Secure Decentralized Stays",
  description:
    "Trustless Airbnb alternative on Base. Escrow-protected bookings, on-chain reputation, crypto payments, AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
