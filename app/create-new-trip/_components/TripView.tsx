"use client"

import React, { useState, useEffect } from 'react'
import { MapPin, Calendar, Wallet, Users, Hotel, ExternalLink, ImageIcon } from 'lucide-react'
import { TripPlan, Hotel as HotelType } from './types'

function HotelCard({ hotel, destination }: { hotel: HotelType; destination: string }) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hotel.geoQuery || `${hotel.name} ${hotel.area} ${destination}`
  )}`

  useEffect(() => {
    let isMounted = true
    const fetchHotelPhoto = async () => {
      try {
        setLoading(true)
        const searchQuery = `${hotel.name} ${hotel.area || ''} ${destination}`
        const res = await fetch(`/api/google-place?query=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        
        if (isMounted && data?.photoUrl) {
          setImageUrl(data.photoUrl)
        }
      } catch (err) {
        console.error("Failed to fetch real hotel photo", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchHotelPhoto()
    return () => {
      isMounted = false
    }
  }, [hotel.name, hotel.area, destination])

  return (
    <a
      href={mapsUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 w-full'
    >
      <div className='relative h-36 sm:h-40 w-full overflow-hidden bg-zinc-800'>
        {loading ? (
          <div className='flex h-full w-full items-center justify-center text-gray-500 animate-pulse'>
            <ImageIcon className='h-6 w-6 opacity-40' />
          </div>
        ) : (
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
            alt={hotel.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            }}
            className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
          />
        )}
        <span className='absolute bottom-2 right-2 rounded-md bg-zinc-950/80 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-amber-400 backdrop-blur-sm'>
          {hotel.priceRange}
        </span>
      </div>

      <div className='flex flex-1 flex-col justify-between p-3 sm:p-3.5'>
        <div>
          <div className='flex items-start justify-between gap-2'>
            <p className='font-semibold text-white text-sm sm:text-base group-hover:text-amber-500 transition line-clamp-1'>
              {hotel.name}
            </p>
            <ExternalLink className='h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-amber-500' />
          </div>
          <p className='mt-1 flex items-center gap-1 text-xs text-gray-400 line-clamp-1'>
            <MapPin className='h-3.5 w-3.5 shrink-0 text-amber-500' /> {hotel.area}
          </p>
        </div>

        <p className='mt-3 text-[11px] font-medium text-amber-500 underline underline-offset-2 opacity-80 group-hover:opacity-100'>
          Open in Google Maps →
        </p>
      </div>
    </a>
  )
}

export default function TripView({ trip }: { trip: TripPlan | null }) {
  if (!trip) {
    return (
      <div className='flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-gray-500 p-6 text-center text-sm sm:text-base'>
        Your trip will appear here
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto rounded-2xl bg-zinc-950 p-4 sm:p-6 text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full'>
      <h2 className='text-2xl sm:text-3xl font-bold text-amber-500 tracking-tight break-words'>{trip.title}</h2>
      <p className='mt-1 text-xs sm:text-sm text-gray-400 break-words'>
        {trip.origin} → {trip.destination}
      </p>

      <div className='mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm'>
        <span className='flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1'>
          <Calendar className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0' />
          {trip.duration}
        </span>
        <span className='flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1'>
          <Wallet className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0' />
          {trip.budget}
        </span>
        <span className='flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1'>
          <Users className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0' />
          {trip.groupSize}
        </span>
      </div>

      <h3 className='mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center gap-2 text-lg sm:text-xl font-semibold'>
        <Hotel className='h-5 w-5 text-amber-500 shrink-0' /> Recommended Hotels
      </h3>

      <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {trip.hotels?.map((h, idx) => (
          <HotelCard key={`${h.name}-${idx}`} hotel={h} destination={trip.destination} />
        ))}
      </div>

      <h3 className='mt-6 sm:mt-8 mb-3 text-lg sm:text-xl font-semibold'>Itinerary</h3>
      <div className='flex flex-col gap-4 sm:gap-5'>
        {trip.days?.map((d) => (
          <div key={d.day} className='rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 sm:p-4'>
            <p className='mb-3 text-base sm:text-lg font-bold'>
              <span className='text-amber-500'>Day {d.day}</span> · {d.title}
            </p>
            <div className='flex flex-col gap-3 border-l-2 border-amber-500/60 pl-3 sm:pl-4'>
              {d.activities?.map((a, i) => (
                <div key={i} className='space-y-1'>
                  <p className='text-[10px] sm:text-xs uppercase tracking-wide text-amber-500 font-semibold'>{a.time}</p>
                  <p className='font-semibold text-sm sm:text-base'>{a.title}</p>
                  <p className='text-xs sm:text-sm text-gray-400'>{a.description}</p>
                  {a.place && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${a.place} ${trip.destination}`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-1 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 hover:underline break-words'
                    >
                      <MapPin className='h-3 w-3 text-amber-500 shrink-0' /> {a.place}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}