"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Home, Shield } from "lucide-react";

export default function ListPage() {
  const { isConnected } = useAccount();
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    deposit: "",
    maxGuests: "2",
    description: "",
    ipfsCID: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Home className="w-8 h-8 text-sky-400" />
            List your place
          </h1>
          <p className="text-slate-400 mt-2">
            Create an on-chain listing. Price and deposit are stored in the smart contract. Photos & description go to IPFS.
          </p>
        </div>

        {!isConnected ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="mb-4 text-slate-300">Connect your wallet to create a listing</p>
            <ConnectButton />
          </div>
        ) : status === "success" ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <h2 className="text-xl font-semibold text-emerald-300 mb-2">Listing created (simulated)</h2>
            <p className="text-slate-300 text-sm">
              After you deploy the contracts and set the addresses in <code className="text-sky-400">lib/contracts.ts</code>, this form will send a real transaction to ListingRegistry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Title</label>
              <input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Modern loft in Palermo" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Location</label>
              <input required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Buenos Aires, Argentina" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Price / night (USDC)</label>
                <input required type="number" min="1" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Deposit (USDC)</label>
                <input required type="number" min="0" value={form.deposit} onChange={(e) => update("deposit", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Max guests</label>
                <input required type="number" min="1" max="20" value={form.maxGuests} onChange={(e) => update("maxGuests", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Description</label>
              <textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500 resize-none" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">IPFS CID (optional for now)</label>
              <input value={form.ipfsCID} onChange={(e) => update("ipfsCID", e.target.value)} placeholder="Qm..." className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm text-sky-200">
              <Shield className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Your listing will be registered on-chain. Guests pay into escrow. You only receive funds after both parties confirm the stay.</p>
            </div>
            <button type="submit" disabled={status === "loading"} className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 font-semibold transition">
              {status === "loading" ? "Creating listing..." : "Create listing on-chain"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
