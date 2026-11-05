"use client";

import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import TripView from "./_components/TripView";
import { TripPlan } from "./_components/types";
import { Compass, MessageSquare, Sparkles } from "lucide-react";

export default function CreateTripPage() {
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "itinerary">("chat");

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden bg-black text-white">
      {/* Mobile Tab Switcher (ONLY rendered on mobile after trip is generated) */}
      {currentTrip && (
        <div className="md:hidden flex border-b border-zinc-800 bg-zinc-950 p-2 gap-2 shrink-0 z-20">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
              mobileTab === "chat"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </button>
          <button
            onClick={() => setMobileTab("itinerary")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
              mobileTab === "itinerary"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Itinerary
          </button>
        </div>
      )}

      {/* Left Pane: ChatBox */}
      <div
        className={`w-full md:w-1/2 h-full border-r border-zinc-800 bg-black overflow-y-auto ${
          currentTrip && mobileTab === "itinerary" ? "hidden md:block" : "block"
        }`}
      >
        <ChatBox
          onTripReady={(trip) => {
            setCurrentTrip(trip);
            setMobileTab("itinerary");
          }}
        />
      </div>

      {/* Right Pane */}
      {currentTrip ? (
        <div
          className={`w-full md:w-1/2 h-full bg-zinc-950 overflow-y-auto p-4 sm:p-6 ${
            mobileTab === "chat" ? "hidden md:block" : "block"
          }`}
        >
          <TripView trip={currentTrip} />
        </div>
      ) : (
        
        <div className="hidden md:flex w-1/2 h-full bg-zinc-950 overflow-y-auto items-center justify-center p-6">
          <div className="text-center flex flex-col items-center max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
              <Compass className="h-8 w-8 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Your Itinerary Awaits
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Chat with Layla on the left to design your dream getaway. Once your personalized plan is ready, your hotels, daily schedules, and highlights will appear right here.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready when you are</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}