import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustStay – Secure Decentralized Stays",
  description:
    "Trustless Airbnb alternative on Base. Escrow-protected bookings, on-chain reputation, crypto + ARS, AI agents. No scams. Worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
