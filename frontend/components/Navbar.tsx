"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/list", label: "List your place" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-sm text-white">
              TS
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">TrustStay</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition ${
                  pathname === l.href ? "text-sky-400 font-medium" : "text-slate-300 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>
    </nav>
  );
}
