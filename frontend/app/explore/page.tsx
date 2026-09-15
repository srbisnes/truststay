"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { MOCK_LISTINGS } from "@/lib/mock-data";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState(1);

  const filtered = MOCK_LISTINGS.filter((l) => {
    const matchQuery =
      !query ||
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.location.toLowerCase().includes(query.toLowerCase());
    const matchGuests = l.maxGuests >= guests;
    return matchQuery && matchGuests;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explore stays</h1>
          <p className="text-slate-400">All bookings protected by on-chain escrow. No scams.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="City, country or title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400 whitespace-nowrap">Guests</label>
            <input
              type="number"
              min={1}
              max={16}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-20 px-3 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 font-medium transition">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            {filtered.length} stay{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No stays match your search. Try different filters.
          </div>
        )}
      </div>
    </div>
  );
}
