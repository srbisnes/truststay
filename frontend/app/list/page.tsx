"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Home, Shield, Upload } from "lucide-react";
import { buildListingMetadata, uploadListingToIPFS } from "@/lib/ipfs";

export default function ListPage() {
  const { isConnected } = useAccount();
  const [form, setForm] = useState({
    title: "", location: "", price: "", deposit: "", maxGuests: "2", description: "", amenities: "WiFi, Kitchen",
  });
  const [status, setStatus] = useState<"idle" | "uploading" | "loading" | "success">("idle");
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;
    setError(null);
    setStatus("uploading");
    try {
      const metadata = buildListingMetadata({
        title: form.title,
        description: form.description,
        location: form.location,
        maxGuests: Number(form.maxGuests) || 2,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      });
      const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
      const { cid: uploadedCid } = await uploadListingToIPFS(metadata, { pinataJwt: pinataJwt || undefined });
      setCid(uploadedCid);
      setStatus("loading");
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Home className="w-8 h-8 text-sky-400" /> List your place
          </h1>
          <p className="text-slate-400 mt-2">Metadata goes to IPFS. Price & deposit are stored on-chain in ListingRegistry.</p>
        </div>
        {!isConnected ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="mb-4 text-slate-300">Connect your wallet to create a listing</p>
            <ConnectButton />
          </div>
        ) : status === "success" ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <h2 className="text-xl font-semibold text-emerald-300">Listing ready</h2>
            <p className="text-slate-300 text-sm">IPFS CID: <code className="text-sky-400 break-all">{cid}</code></p>
            <p className="text-slate-400 text-sm">After deploying contracts, this will call createListing with the CID.</p>
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
              <label className="text-sm text-slate-400 block mb-1.5">Amenities (comma separated)</label>
              <input value={form.amenities} onChange={(e) => update("amenities", e.target.value)} placeholder="WiFi, Kitchen, Pool" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:outline-none focus:border-sky-500" />
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm text-sky-200">
              <Upload className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Metadata is uploaded to IPFS first. Set NEXT_PUBLIC_PINATA_JWT for real Pinata uploads.</p>
            </div>
            {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>}
            <button type="submit" disabled={status === "uploading" || status === "loading"} className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 font-semibold transition">
              {status === "uploading" ? "Uploading to IPFS…" : status === "loading" ? "Creating on-chain listing…" : "Upload + Create listing"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
