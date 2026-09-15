"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ArrowDownUp, Info } from "lucide-react";
import { estimateEthToUsdc } from "@/lib/swap";

export function SwapPanel({ onUsdcReady }: { onUsdcReady?: (amount: number) => void }) {
  const { isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState("0.05");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const eth = parseFloat(ethAmount) || 0;
  const estimatedUsdc = estimateEthToUsdc(eth);

  async function handleSwap() {
    if (!isConnected || eth <= 0) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("done");
    onUsdcReady?.(Number(estimatedUsdc.toFixed(2)));
  }

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-sky-400" />
          Swap to USDC
        </h3>
        <span className="text-xs text-slate-500">Uniswap V3 · Base</span>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">You pay (ETH)</label>
        <input type="number" step="0.001" min="0" value={ethAmount} onChange={(e) => { setEthAmount(e.target.value); setStatus("idle"); }} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-sky-500" />
      </div>
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
          <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">You receive (USDC est.)</label>
        <div className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-sky-300 font-medium">
          ≈ {estimatedUsdc.toFixed(2)} USDC
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <p>Estimate only. After contracts are live, this calls Uniswap Router on Base.</p>
      </div>
      <button onClick={handleSwap} disabled={!isConnected || status === "loading" || eth <= 0} className="w-full py-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/30 disabled:opacity-40 text-sky-300 font-medium text-sm transition">
        {status === "loading" ? "Swapping…" : status === "done" ? "✓ USDC ready (demo)" : "Swap ETH → USDC"}
      </button>
    </div>
  );
}
