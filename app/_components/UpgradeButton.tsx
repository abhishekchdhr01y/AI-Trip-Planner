"use client";

import React, { useState } from "react";
import axios from "axios";
import { Crown, Loader2 } from "lucide-react";

export default function UpgradeButton({ onSuccess }: { onSuccess: () => void }) {
  const [checking, setChecking] = useState(false);
  const [notYet, setNotYet] = useState(false);

  const checkPlan = async () => {
    setChecking(true);
    setNotYet(false);
    try {
      const { data } = await axios.get("/api/plan");
      if (data.plan === "pro") {
        onSuccess();
      } else {
        setNotYet(true);
      }
    } catch (error) {
      console.error("Error checking plan:", error);
      setNotYet(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-600/80 bg-zinc-900 p-3 sm:p-4 w-full">
      <div className="flex items-center gap-3">
        <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm sm:text-base truncate">
            Upgrade to Pro
          </p>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            Plan up to 10 trips per day
          </p>
        </div>
      </div>

      <a
        href="/#pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-amber-600 px-4 py-2 text-center font-semibold text-sm sm:text-base text-white transition hover:bg-amber-500"
      >
        View plans
      </a>

      <button
        onClick={checkPlan}
        disabled={checking}
        className="flex items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 py-2 text-xs sm:text-sm text-white transition hover:border-amber-500 disabled:opacity-60"
      >
        {checking ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Checking...
          </>
        ) : (
          "I've upgraded, continue"
        )}
      </button>

      {notYet && (
        <p className="text-xs sm:text-sm text-amber-400 text-center">
          Not Pro yet. If you just paid, wait a few seconds and try again.
        </p>
      )}
    </div>
  );
}