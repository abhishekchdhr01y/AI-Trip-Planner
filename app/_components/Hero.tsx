"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe2, Landmark, Plane, Send } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-400 w-4 h-4 shrink-0" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="text-green-500 w-4 h-4 shrink-0" />,
  },
  {
    title: "Discover Hidden gems",
    icon: <Landmark className="text-orange-400 w-4 h-4 shrink-0" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="text-yellow-500 w-4 h-4 shrink-0" />,
  },
];

export default function Hero() {
  const { user } = useUser();
  const { openSignUp } = useClerk();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      openSignUp({});
      return;
    }
    router.push("/create-new-trip");
  };

  return (
    <div className="mx-auto mt-12 sm:mt-24 md:mt-32 flex flex-col w-full max-w-4xl items-center px-4 sm:px-6 gap-6 text-center">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Hey, I'm your personal <span className="text-yellow-200">trip Planner</span>
      </h1>

      <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
        Get personalized travel plans and book flights, stays, and experiences instantly!
      </p>

      <div className="w-full border border-zinc-800 rounded-xl relative bg-black shadow-2xl">
        <Textarea
          className="w-full h-32 sm:h-40 bg-black text-base sm:text-lg border-0 focus-visible:ring-0 p-4 resize-none pr-14"
          placeholder="Create a trip from Paris to New York"
        />

        <Button
          size={"icon"}
          variant="outline"
          className="absolute bottom-3 right-3 bg-zinc-900 border-zinc-700 hover:bg-amber-600 hover:text-white transition-colors"
          onClick={onSend}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
        {Suggestions.map((sug, index) => (
          <div
            key={index}
            onClick={onSend}
            className="flex items-center text-xs sm:text-sm gap-2 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 cursor-pointer rounded-full px-3 py-1.5 transition-colors"
          >
            {sug.icon}
            <span className="text-gray-200 font-medium">{sug.title}</span>
          </div>
        ))}
      </div>

      <div className="w-full mt-6 sm:mt-10 rounded-2xl overflow-hidden border border-zinc-800">
        <HeroVideoDialog
          className="w-full"
          animationStyle="from-center"
          videoSrc="https://www.example.com/dummy-video"
          thumbnailSrc="https://img.magnific.com/free-vector/flat-geometric-travel-youtube-thumbnail_23-2148907518.jpg?semt=ais_hybrid&w=740&q=80"
          thumbnailAlt="Dummy Video Thumbnail"
        />
      </div>
    </div>
  );
}