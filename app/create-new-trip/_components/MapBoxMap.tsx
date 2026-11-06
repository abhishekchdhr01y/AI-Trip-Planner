"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TripPlan } from "./types";
import { LocateFixed } from "lucide-react";

type MapProps = {
  trip?: TripPlan | null;
  destination?: string | null;
  selectedLocation?: string | null;
};

export default function MapBoxMap({ trip, destination, selectedLocation }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mainCoords, setMainCoords] = useState<[number, number] | null>(null);

  const getAllPlaces = () => {
    if (!trip) return [];
    const places: { name: string; query: string }[] = [];
    const dest = trip.destination || "New York";

    trip.hotels?.forEach((hotel) => {
      if (hotel.name) {
        const query = `${hotel.name} ${hotel.area || ""} ${dest}`;
        places.push({ name: hotel.name, query });
      }
    });

    trip.days?.forEach((day) => {
      day.activities?.forEach((activity) => {
        if (activity.place) {
          const query = `${activity.place} ${dest}`;
          places.push({ name: activity.title || activity.place, query });
        }
      });
    });

    return places;
  };

  const targetQuery = selectedLocation || destination || trip?.destination || "New York";

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox public token is missing!");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0060, 40.7128],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      map.resize();
    });

    // Auto-resize listener whenever container changes size (essential for mobile view switching)
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        targetQuery
      )}.json?limit=1&access_token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!mapRef.current) return;
        if (data?.features?.length > 0) {
          const [lng, lat] = data.features[0].center;
          setMainCoords([lng, lat]);

          mapRef.current.flyTo({ center: [lng, lat], zoom: 12, essential: true });

          const mainMarker = new mapboxgl.Marker({ color: "#f59e0b" })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${targetQuery}</b>`))
            .addTo(mapRef.current);
          markersRef.current.push(mainMarker);

          const places = getAllPlaces();
          places.forEach((placeObj) => {
            fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                placeObj.query
              )}.json?proximity=${lng},${lat}&limit=1&access_token=${token}`
            )
              .then((res) => res.json())
              .then((placeData) => {
                if (!mapRef.current) return;
                if (placeData?.features?.length > 0) {
                  const [plng, plat] = placeData.features[0].center;

                  const marker = new mapboxgl.Marker({ color: "#ef4444" })
                    .setLngLat([plng, plat])
                    .setPopup(
                      new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<div style="color: black; font-weight: 600;">${placeObj.name}</div>`
                      )
                    )
                    .addTo(mapRef.current);

                  markersRef.current.push(marker);
                }
              })
              .catch((err) => console.error(`Failed to geocode place: ${placeObj.query}`, err));
          });
        }
      })
      .catch((err) => console.error("Main geocoding failed:", err));
  }, [trip, targetQuery]);

  const handleResetView = () => {
    if (mapRef.current && mainCoords) {
      mapRef.current.flyTo({
        center: mainCoords,
        zoom: 12,
        essential: true,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-full flex-1 bg-zinc-950 overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {mainCoords && (
        <button
          onClick={handleResetView}
          className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/90 border border-zinc-700 text-amber-500 shadow-md backdrop-blur-md transition hover:bg-zinc-800 hover:border-amber-500 active:scale-95"
          title="Recenter to destination"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}