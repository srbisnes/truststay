"use client";

import Link from "next/link";
import { Star, Users } from "lucide-react";
import type { MockListing } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: MockListing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-sky-500/40 transition-all hover:shadow-xl hover:shadow-sky-500/5"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur text-xs font-medium text-white">
          ${listing.pricePerNight} / night
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-sky-300 transition">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-200">{listing.rating}</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-1">{listing.location}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {listing.maxGuests} guests
          </span>
          <span>·</span>
          <span>{listing.reviews} reviews</span>
        </div>
      </div>
    </Link>
  );
}
