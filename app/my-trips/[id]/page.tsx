"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TripView from "@/app/create-new-trip/_components/TripView";
import MapBoxMap from "@/app/create-new-trip/_components/MapBoxMap";
import Link from "next/link";
import { ArrowLeft, Map, MessageSquare } from "lucide-react";

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as Id<"trips">;

  const tripRecord = useQuery(
    api.trips.getTripById,
    tripId ? { tripId } : "skip"
  );
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  if (tripRecord === undefined) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-lg">
          Loading your trip itinerary...
        </p>
      </div>
    );
  }

  if (!tripRecord) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-red-500">Trip not found.</p>
        <Link
          href="/my-trips"
          className="text-amber-500 underline hover:text-amber-400"
        >
          Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top navbar */}
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0 h-[57px]">
        <Link
          href="/my-trips"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Back to My Trips</span>
        </Link>
        <h1 className="text-base sm:text-lg font-bold text-amber-500 truncate max-w-[180px] sm:max-w-none">
          {tripRecord.destination}
        </h1>
        <div className="w-8 sm:w-24" />
      </div>

      {/* Split screen layout */}
      <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden relative">
        {/* Left Column: Itinerary Details */}
        <div
          className={`w-full lg:w-1/2 h-full overflow-y-auto p-4 sm:p-6 border-r border-zinc-800 bg-black ${
            showMapMobile ? "hidden lg:block" : "block"
          }`}
        >
          <TripView trip={tripRecord.tripData} />
        </div>

        {/* Right Column: Interactive Mapbox Map */}
        <div
          className={`relative w-full lg:w-1/2 h-full bg-zinc-950 ${
            showMapMobile ? "block" : "hidden lg:block"
          }`}
        >
          <MapBoxMap
            destination={tripRecord.destination}
            selectedLocation={activeLocation}
          />
        </div>
      </div>

      {/* Floating Toggle Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowMapMobile((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(245,158,11,0.5)] border border-amber-400/30 backdrop-blur-md transition-all active:scale-95"
        >
          {showMapMobile ? (
            <>
              <MessageSquare className="h-4 w-4" />
              <span>Show Itinerary</span>
            </>
          ) : (
            <>
              <span>Show Map</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}