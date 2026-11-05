"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type MapProps = {
  destination?: string | null;
  selectedLocation?: string | null;
};

export default function MapBoxMap({ destination, selectedLocation }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

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
      // Switched from dark-v11 to streets-v12 for a bright, colorful, and blue aesthetic
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.006, 40.7128], // Default NYC
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const targetQuery = selectedLocation || destination;
    if (!targetQuery || !mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        targetQuery
      )}.json?access_token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.features?.length > 0 && mapRef.current) {
          const [lng, lat] = data.features[0].center;

          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            essential: true,
          });

          if (markerRef.current) {
            markerRef.current.remove();
          }

          markerRef.current = new mapboxgl.Marker({ color: "#f59e0b" })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        }
      })
      .catch((err) => console.error("Geocoding failed:", err));
  }, [destination, selectedLocation]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-zinc-950 overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}