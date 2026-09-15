"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
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
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-sm">
              TS
            </div>
            <span className="font-semibold text-lg tracking-tight">TrustStay</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm text-slate-300 hover:text-white hidden sm:block">
              How it works
            </a>
            <a href="#security" className="text-sm text-slate-300 hover:text-white hidden sm:block">
              Security
            </a>
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Built on Base • Ethereum Security • Zero Scams
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
              Rent homes worldwide.{" "}
              <span className="text-sky-400">No one gets scammed.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              TrustStay is a decentralized Airbnb alternative. Funds are locked in transparent smart
              contracts until both guest and host confirm. On-chain availability, reputation points,
              crypto + ARS ramps, and AI agents with automatic translation.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition"
              >
                Explore stays
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/srbisnes/truststay"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-medium transition"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Lock,
              title: "Trustless Escrow",
              desc: "Money locked until both parties confirm. No one can run with the funds.",
            },
            {
              icon: Calendar,
              title: "On-chain Calendar",
              desc: "Double-booking is mathematically impossible. Real availability.",
            },
            {
              icon: Zap,
              title: "Ultra-low fees",
              desc: "Base L2 = cents per transaction. Protocol fee only 1.5%.",
            },
            {
              icon: Globe,
              title: "Worldwide + ARS",
              desc: "Any EVM wallet. Crypto native + ARS on-ramp support.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition"
            >
              <item.icon className="w-8 h-8 text-sky-400 mb-4" />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">How TrustStay protects both sides</h2>
        <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">
          Designed so neither the guest nor the host can be left angry or scammed.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Host lists",
              desc: "Property metadata on IPFS, price & deposit on-chain. Availability windows recorded.",
            },
            {
              step: "02",
              title: "Guest books & pays",
              desc: "USDC (or swapped) goes into escrow. Dates marked occupied. Impossible to double-book.",
            },
            {
              step: "03",
              title: "Stay & release",
              desc: "Both confirm after stay (or dispute window). Funds auto-release to host, deposit returns to guest. Points awarded.",
            },
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

      {/* Features grid */}
      <section id="security" className="bg-white/5 border-y border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you asked for + more</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Anti-scam by design", text: "Escrow + dual confirmation + dispute window. No trust required." },
              { icon: Coins, title: "Crypto + ARS ramps", text: "Native USDC/ETH. Swaps via Uniswap. Fiat on-ramps (Transak-style) ready for integration." },
              { icon: Star, title: "Reputation Points", text: "Soulbound points. Good hosts & guests rise. Bad actors are visible on-chain." },
              { icon: MessageSquare, title: "AI Agents + Translator", text: "Automatic translation between guest & host. Booking assistant in any language." },
              { icon: Users, title: "Direct contact", text: "Once booked, guest and host can message securely. Platform never holds private keys." },
              { icon: Calendar, title: "Live availability", text: "Select place + dates and instantly see if free and when it liberates." },
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

      {/* CTA */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {isConnected ? "You're ready. Start building or list your first stay." : "Connect your wallet to begin"}
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Contracts are production-ready architecture (Foundry + OpenZeppelin). Frontend is live on Vercel.
          Deploy contracts to Base Sepolia or Mainnet after your audit.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <ConnectButton />
          <a
            href="https://github.com/srbisnes/truststay"
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 text-sm font-medium"
          >
            Full source code
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
              TS
            </div>
            TrustStay – Security-first decentralized stays
          </div>
          <div>
            Built on Base • EVM • MIT License •{" "}
            <a href="https://github.com/srbisnes/truststay" className="hover:text-sky-400">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
