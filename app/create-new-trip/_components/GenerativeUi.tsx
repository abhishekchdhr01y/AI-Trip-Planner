"use client";

import React, { useState } from "react";
import {
  Check,
  Coins,
  Compass,
  Camera,
  Gem,
  Heart,
  Landmark,
  Loader2,
  Minus,
  Moon,
  PartyPopper,
  Plus,
  Sparkles,
  Sun,
  User,
  Users,
  Utensils,
  Wallet,
  Mountain,
} from "lucide-react";

type Props = { onSelect: (text: string) => void };

const card =
  "group flex flex-col items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 p-3 sm:p-4 text-center transition hover:-translate-y-1 hover:border-amber-500 hover:bg-zinc-800 w-full";

const groups = [
  { icon: User, title: "Solo", sub: "1 person" },
  { icon: Heart, title: "Couple", sub: "2 people" },
  { icon: Users, title: "Family", sub: "3 to 5 people" },
  { icon: PartyPopper, title: "Friends", sub: "5 to 10 people" },
];

export function GroupSizeUi({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4 w-full">
      {groups.map(({ icon: Icon, title, sub }) => (
        <button
          key={title}
          className={card}
          onClick={() => onSelect(`${title} (${sub})`)}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 transition group-hover:scale-110 shrink-0" />
          <p className="font-semibold text-white text-xs sm:text-base">{title}</p>
          <p className="text-[10px] sm:text-xs text-gray-400">{sub}</p>
        </button>
      ))}
    </div>
  );
}

const budgets = [
  { icon: Coins, title: "Low", sub: "Stay economical" },
  { icon: Wallet, title: "Medium", sub: "Balanced comfort" },
  { icon: Gem, title: "High", sub: "Luxury experience" },
];

export function BudgetUi({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
      {budgets.map(({ icon: Icon, title, sub }) => (
        <button
          key={title}
          className={card}
          onClick={() => onSelect(`${title} budget`)}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 transition group-hover:scale-110 shrink-0" />
          <p className="font-semibold text-white text-xs sm:text-base">{title}</p>
          <p className="text-[10px] sm:text-xs text-gray-400">{sub}</p>
        </button>
      ))}
    </div>
  );
}

export function TripDurationUi({ onSelect }: Props) {
  const [days, setDays] = useState(5);
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3.5 sm:p-4 w-full">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {[3, 5, 7, 10, 14].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-full border px-3 sm:px-4 py-1 text-xs sm:text-sm transition ${
              days === d
                ? "border-amber-500 bg-amber-600 text-white"
                : "border-zinc-600 text-gray-300 hover:border-amber-500"
            }`}
          >
            {d} days
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setDays((d) => Math.max(1, d - 1))}
            className="rounded-full border border-zinc-600 p-1.5 sm:p-2 hover:border-amber-500"
          >
            <Minus className="h-4 w-4 text-white" />
          </button>
          <span className="w-16 sm:w-20 text-center text-xl sm:text-2xl font-bold text-white">
            {days}
          </span>
          <button
            onClick={() => setDays((d) => Math.min(30, d + 1))}
            className="rounded-full border border-zinc-600 p-1.5 sm:p-2 hover:border-amber-500"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>

        <button
          onClick={() => onSelect(`${days} days`)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-xs sm:text-sm text-white transition hover:bg-amber-500"
        >
          <Check className="h-4 w-4" /> Confirm
        </button>
      </div>
    </div>
  );
}

const interestList = [
  { icon: Mountain, label: "Adventure" },
  { icon: Camera, label: "Sightseeing" },
  { icon: Landmark, label: "Cultural" },
  { icon: Utensils, label: "Food" },
  { icon: Moon, label: "Nightlife" },
  { icon: Sun, label: "Relaxation" },
  { icon: Compass, label: "Hidden gems" },
];

export function InterestsUi({ onSelect }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (l: string) =>
    setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3.5 sm:p-4 w-full">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {interestList.map(({ icon: Icon, label }) => {
          const active = picked.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition ${
                active
                  ? "border-amber-500 bg-amber-600 text-white"
                  : "border-zinc-600 text-gray-300 hover:border-amber-500"
              }`}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> {label}
            </button>
          );
        })}
      </div>

      <button
        disabled={picked.length === 0}
        onClick={() => onSelect(picked.join(", "))}
        className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-xs sm:text-sm text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Check className="h-4 w-4" /> Continue
      </button>
    </div>
  );
}

type FinalProps = {
  onGenerate: () => void;
  generating: boolean;
};

export function FinalUi({ onGenerate, generating }: FinalProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-600 bg-zinc-900 p-3.5 sm:p-4 w-full">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 shrink-0" />
        <p className="text-white text-xs sm:text-base font-medium">
          Your trip details are ready!
        </p>
      </div>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-xs sm:text-sm text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Building itinerary...
          </>
        ) : (
          "View my trip"
        )}
      </button>
    </div>
  );
}

export function renderGenerativeUi(
  ui: string | undefined,
  onSelect: (t: string) => void,
  final?: { onGenerate: () => void; generating: boolean }
) {
  switch (ui) {
    case "groupSize":
      return <GroupSizeUi onSelect={onSelect} />;
    case "budget":
      return <BudgetUi onSelect={onSelect} />;
    case "TripDuration":
      return <TripDurationUi onSelect={onSelect} />;
    case "interests":
      return <InterestsUi onSelect={onSelect} />;
    case "Final":
      return final ? (
        <FinalUi onGenerate={final.onGenerate} generating={final.generating} />
      ) : null;
    default:
      return null;
  }
}