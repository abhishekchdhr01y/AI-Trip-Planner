"use client";

import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import TripView from "./_components/TripView";
import MapBoxMap from "./_components/MapBoxMap";
import { MessageSquare, Calendar, MapPin, Sparkles } from "lucide-react";
import { TripPlan } from "./_components/types";

export default function CreateNewTripPage() {
  const [tripData, setTripData] = useState<TripPlan | null>(null);
  const [leftPaneView, setLeftPaneView] = useState<"chat" | "itinerary">("itinerary");
  const [mobileTab, setMobileTab] = useState<"chat" | "itinerary" | "map">("itinerary");

  const handleTripGenerated = (data?: TripPlan) => {
    if (data) {
      setTripData(data);
      setLeftPaneView("itinerary"); // Switch left pane to itinerary automatically
      setMobileTab("itinerary"); // Switch mobile tab to itinerary
    }
  };

  const hasTripCreated = tripData !== null;

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white overflow-hidden">
      
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xl font-bold tracking-tight text-white">Layla</span>
        </div>

        {/* Desktop View Switcher (Visible after trip creation) */}
        {hasTripCreated && (
          <div className="hidden md:flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setLeftPaneView("itinerary")}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-all ${
                leftPaneView === "itinerary"
                  ? "bg-amber-500 text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Itinerary
            </button>
            <button
              onClick={() => setLeftPaneView("chat")}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-all ${
                leftPaneView === "chat"
                  ? "bg-amber-500 text-black font-semibold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">

        {/* Mobile View Tabs (Only visible on mobile screens after trip creation) */}
        {hasTripCreated && (
          <div className="md:hidden flex border-b border-zinc-800 bg-zinc-950 shrink-0">
            <button
              onClick={() => setMobileTab("chat")}
              className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 ${
                mobileTab === "chat" ? "border-b-2 border-amber-500 text-amber-500 font-semibold" : "text-gray-400"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Chat
            </button>
            <button
              onClick={() => setMobileTab("itinerary")}
              className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 ${
                mobileTab === "itinerary" ? "border-b-2 border-amber-500 text-amber-500 font-semibold" : "text-gray-400"
              }`}
            >
              <Calendar className="w-4 h-4" /> Itinerary
            </button>
            <button
              onClick={() => setMobileTab("map")}
              className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 ${
                mobileTab === "map" ? "border-b-2 border-amber-500 text-amber-500 font-semibold" : "text-gray-400"
              }`}
            >
              <MapPin className="w-4 h-4" /> Map
            </button>
          </div>
        )}

        {/* Mobile Display Logic */}
        <div className="md:hidden w-full h-full overflow-y-auto">
          {!hasTripCreated ? (
            <ChatBox onTripReady={handleTripGenerated} />
          ) : (
            <>
              {mobileTab === "chat" && <ChatBox onTripReady={handleTripGenerated} />}
              {mobileTab === "itinerary" && <TripView trip={tripData} />}
              {mobileTab === "map" && (
                <div className="w-full h-full min-h-[calc(100vh-120px)]">
                  <MapBoxMap trip={tripData} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop Display Logic (50/50 Split) */}
        <div className="hidden md:flex w-full h-full">
          {!hasTripCreated ? (
            <>
              {/* Pre-trip creation: Left Chat, Right Map */}
              <div className="w-1/2 h-full overflow-y-auto border-r border-zinc-800 p-6">
                <ChatBox onTripReady={handleTripGenerated} />
              </div>
              <div className="w-1/2 h-full relative">
                <MapBoxMap trip={null} />
              </div>
            </>
          ) : (
            <>
              {/* Post-trip creation: Toggleable Left View (TripView/Chat), Fixed Right Map */}
              <div className="w-1/2 h-full overflow-y-auto border-r border-zinc-800 p-6">
                {leftPaneView === "itinerary" ? (
                  <TripView trip={tripData} />
                ) : (
                  <ChatBox onTripReady={handleTripGenerated} />
                )}
              </div>
              <div className="w-1/2 h-full relative">
                <MapBoxMap trip={tripData} />
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}