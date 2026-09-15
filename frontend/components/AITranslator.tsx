"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Languages, X, Bot } from "lucide-react";

type Msg = { id: string; role: "user" | "agent"; text: string; lang?: string };

const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
];

let msgCounter = 0;
function nextId() {
  msgCounter += 1;
  return `m-${Date.now()}-${msgCounter}`;
}

async function translateDemo(text: string, targetLang: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  const map: Record<string, Record<string, string>> = {
    es: { hello: "Hola", hi: "Hola", "thank you": "Gracias", "where is the key": "¿Dónde está la llave?", "check in": "Check-in", wifi: "WiFi", parking: "Estacionamiento" },
    en: { hola: "Hello", gracias: "Thank you", "dónde está la llave": "Where is the key?", "check-in": "Check-in" },
    pt: { hello: "Olá", hola: "Olá", "thank you": "Obrigado", gracias: "Obrigado" },
  };
  const lower = text.toLowerCase().trim();
  const dict = map[targetLang] || {};
  for (const [k, v] of Object.entries(dict)) {
    if (lower.includes(k)) return v;
  }
  return `[${targetLang.toUpperCase()}] ${text}`;
}

export function AITranslator() {
  const [open, setOpen] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "welcome", role: "agent", text: "TrustStay AI Agent — translate messages between guest and host. Type in any language." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setMsgs((m) => [...m, { id: nextId(), role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const translated = await translateDemo(userText, targetLang);
      setMsgs((m) => [...m, { id: nextId(), role: "agent", text: translated, lang: targetLang }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30 font-medium transition" aria-label="Open AI Translator">
        <Languages className="w-5 h-5" />
        <span className="hidden sm:inline">AI Translator</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/80">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-400" />
          <span className="font-semibold text-sm">TrustStay AI</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="text-xs bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-slate-200">
            {LANGS.map((l) => (<option key={l.code} value={l.code}>{l.label}</option>))}
          </select>
          <button type="button" onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded" aria-label="Close">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-sky-500 text-white rounded-br-md" : "bg-white/10 text-slate-200 rounded-bl-md"}`}>
              {m.role === "agent" && m.lang && (<span className="text-[10px] uppercase tracking-wider text-sky-400 block mb-0.5">→ {m.lang}</span>)}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (<div className="text-xs text-slate-500 flex items-center gap-2"><MessageSquare className="w-3 h-3 animate-pulse" /> Translating…</div>)}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type in any language…" className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500" />
        <button type="button" onClick={send} disabled={loading || !input.trim()} className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 transition" aria-label="Send">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
