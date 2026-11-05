"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignUpButton, UserButton } from "@clerk/nextjs";

const Nav_components = [
  { name: "My Trips", path: "/my-trips" },
  { name: "AI Generator", path: "/create-new-trip" },
  { name: "Pricing", path: "/pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const isCreateTripPage = pathname === "/create-new-trip";

  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between bg-black text-white border-b border-zinc-800/80">
      {/* Logo */}
      <Link href={"/"} className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
        <Image
          src="/trip-logo.svg"
          alt="Trip Planner logo"
          width={28}
          height={28}
          className="group-hover:scale-105 transition-transform sm:w-8 sm:h-8"
        />
        <h1 className="text-xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
          Layla
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-6 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.6)] backdrop-blur-md">
        {Nav_components.map((Nav) => {
          const isActive = pathname === Nav.path;
          return (
            <Link key={Nav.path} href={Nav.path}>
              <span
                className={`px-4 lg:px-5 py-2 rounded-full text-sm lg:text-base font-semibold transition-all duration-300 block ${
                  isActive
                    ? "bg-amber-500/20 text-amber-400 shadow-inner"
                    : "text-gray-300 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {Nav.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <button className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-105">
              Start Planning
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          {isCreateTripPage ? (
            <Link href={"/my-trips"}>
              <button className="bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:scale-105">
                My Trips
              </button>
            </Link>
          ) : (
            <Link href={"/create-new-trip"}>
              <button className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-105">
                Create New Trip
              </button>
            </Link>
          )}

          <div className="border border-zinc-800 rounded-full p-0.5 bg-zinc-900 flex items-center justify-center">
            <UserButton />
          </div>
        </Show>
      </div>
    </header>
  );
}