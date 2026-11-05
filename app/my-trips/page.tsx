"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'

export default function MyTripsPage() {
  const { user } = useUser()
  const userId = user?.id || ""

  const trips = useQuery(api.trips.getUserTrips, { userId })

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Trips</h1>
        </div>

        {trips === undefined && (
          <p className="text-gray-400">Loading your trips...</p>
        )}

        {trips && trips.length === 0 && (
          <div className="border border-zinc-800 rounded-xl p-10 text-center bg-zinc-900/40">
            <p className="text-gray-400 mb-4">You haven't generated any trips yet.</p>
            <Link href="/create-new-trip">
              <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg">
                Create Your First Trip
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips?.map((trip: any) => (
            <Link key={trip._id} href={`/my-trips/${trip._id}`}>
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-amber-500/50 transition-colors cursor-pointer h-full">
                <h2 className="text-xl font-bold text-amber-500 mb-2">
                  {trip.destination || "Saved Trip"}
                </h2>
                <p className="text-xs text-gray-500">
                  Created: {new Date(trip.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}