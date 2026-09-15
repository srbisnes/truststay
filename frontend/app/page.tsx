"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Shield,
  Globe,
  Zap,
  Users,
  Lock,
  Coins,
  MessageSquare,
  Calendar,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Built on Base · Escrow · Zero Scams
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Rent homes worldwide.{" "}
              <span className="text-sky-400">No one gets scammed.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              Trustless escrow on Base. On-chain availability, reputation points, crypto payments and AI translation between guest and host.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition"
              >
                Explore stays
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/list"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-medium transition"
              >
                List your place
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Lock, title: "Trustless Escrow", desc: "Money locked until both parties confirm." },
            { icon: Calendar, title: "On-chain Calendar", desc: "Double-booking is impossible." },
            { icon: Zap, title: "Ultra-low fees", desc: "Base L2 · protocol fee 1.5%." },
            { icon: Globe, title: "Worldwide + ARS", desc: "Any EVM wallet. Fiat ramps ready." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition">
              <item.icon className="w-8 h-8 text-sky-400 mb-4" />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">Neither guest nor host can be scammed.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Host lists", desc: "Metadata on IPFS, price & deposit on-chain." },
            { step: "02", title: "Guest books", desc: "USDC into escrow. Dates marked occupied." },
            { step: "03", title: "Confirm & release", desc: "Both confirm. Funds release. Deposit returns." },
          ].map((s) => (
            <div key={s.step} className="relative">
              <div className="text-5xl font-bold text-sky-500/20 absolute -top-2 left-0">{s.step}</div>
              <div className="pt-10">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/5 border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Built-in protection</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Anti-scam", text: "Escrow + dual confirmation + dispute window." },
              { icon: Coins, title: "Crypto native", text: "USDC on Base. Swap ETH when needed." },
              { icon: Star, title: "Reputation", text: "Soulbound points for hosts and guests." },
              { icon: MessageSquare, title: "AI Translator", text: "Guest ↔ host in any language." },
              { icon: Users, title: "Direct contact", text: "Message after booking. No middleman." },
              { icon: Calendar, title: "Live availability", text: "See if dates are free instantly." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-white/5">
                <f.icon className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {isConnected ? "Connected. Explore or list a place." : "Connect your wallet to begin"}
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Production architecture on Base. Escrow, reputation and calendar on-chain.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <ConnectButton />
          <Link href="/explore" className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 text-sm font-medium">
            Browse stays
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-xs font-bold text-white">TS</div>
            TrustStay
          </div>
          <a href="https://github.com/srbisnes/truststay" className="hover:text-sky-400">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
