"use client";

import { use, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Star, Users, Shield, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { SwapPanel } from "@/components/SwapPanel";

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = MOCK_LISTINGS.find((l) => l.id === Number(id));
  const { isConnected } = useAccount();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showSwap, setShowSwap] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Listing not found</h1>
          <Link href="/explore" className="text-sky-400 hover:underline">Back to explore</Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  const total = nights * listing.pricePerNight + listing.deposit;

  async function handleBook() {
    if (!isConnected) return;
    if (!checkIn || !checkOut || nights < 1) {
      setStatus("error");
      setMessage("Please select valid check-in and check-out dates.");
      return;
    }
    setStatus("loading");
    setMessage("Approving USDC + creating escrow booking…");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
    setMessage(`Booking simulated! ${nights} night(s) · ${total} USDC locked in escrow.`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to explore
        </Link>
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden">
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{listing.title}</h1>
                  <p className="text-slate-400 mt-1">{listing.location}</p>
                </div>
                <div className="flex items-center gap-1 text-sm shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-slate-500">({listing.reviews})</span>
                </div>
              </div>
              <p className="mt-4 text-slate-300 leading-relaxed">{listing.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {listing.amenities.map((a) => (
                  <span key={a} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">{a}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-6 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Up to {listing.maxGuests} guests</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-sky-400" /> Escrow protected</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="sticky top-24 space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${listing.pricePerNight}</span>
                  <span className="text-slate-400">USDC / night</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-500" />
                  </div>
                </div>
                {nights > 0 && (
                  <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                    <div className="flex justify-between"><span className="text-slate-400">${listing.pricePerNight} × {nights} nights</span><span>${listing.pricePerNight * nights}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Security deposit</span><span>${listing.deposit}</span></div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-white/10"><span>Total (escrow)</span><span className="text-sky-400">${total} USDC</span></div>
                  </div>
                )}
                {!isConnected ? (
                  <div className="pt-2"><ConnectButton /></div>
                ) : (
                  <>
                    <button type="button" onClick={() => setShowSwap((s) => !s)} className="w-full py-2 rounded-xl border border-white/15 hover:bg-white/5 text-sm text-slate-300">
                      {showSwap ? "Hide swap" : "Need USDC? Swap ETH → USDC"}
                    </button>
                    <button onClick={handleBook} disabled={status === "loading"} className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 font-semibold transition flex items-center justify-center gap-2">
                      {status === "loading" ? "Processing…" : (<><Calendar className="w-4 h-4" /> Book with Escrow</>)}
                    </button>
                  </>
                )}
                {message && (
                  <p className={`text-sm p-3 rounded-xl ${
                    status === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : status === "error" ? "bg-red-500/10 text-red-300 border border-red-500/20"
                    : "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  }`}>{message}</p>
                )}
                <p className="text-xs text-slate-500 text-center">Funds stay in escrow until both confirm. Deposit returns automatically.</p>
              </div>
              {showSwap && <SwapPanel />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
