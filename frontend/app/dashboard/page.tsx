"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Calendar, Home, Star, Shield } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
          <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
          <p className="text-slate-400 mb-6">Connect your wallet to see listings, bookings and reputation.</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Home, label: "My Listings", value: "0", href: "/list" },
            { icon: Calendar, label: "Active Bookings", value: "0", href: "/explore" },
            { icon: Star, label: "Reputation Points", value: "0", href: "#" },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition"
            >
              <s.icon className="w-6 h-6 text-sky-400 mb-3" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-sky-400" />
            <h2 className="font-semibold text-lg">How to go live</h2>
          </div>
          <ol className="space-y-3 text-sm text-slate-300 list-decimal list-inside">
            <li>Deploy contracts with Foundry to Base Sepolia (see README).</li>
            <li>Update addresses in <code className="text-sky-400">frontend/lib/contracts.ts</code>.</li>
            <li>Set your WalletConnect Project ID in <code className="text-sky-400">.env.local</code>.</li>
            <li>List a place → Book with real USDC → Confirm stay → Funds release automatically.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/list" className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-sm font-medium">
              Create first listing
            </Link>
            <a href="https://github.com/srbisnes/truststay" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 text-sm">
              View source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
