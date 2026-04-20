import React, { useEffect, useRef, useState } from "react";
import { MapPin, MousePointerClick, Satellite } from "lucide-react";
import { loadGoogleMaps, getGoogleMapsApiKey } from "../game/googleMaps.js";
import { normalizeGooglePlaceDetails } from "../game/placeDetails.js";

export function GoogleMapPanel({
  center,
  zoom = 4,
  marker,
  readOnly = false,
  allowPlacePicking = false,
  onPlacePick,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [error, setError] = useState("");
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      try {
        const google = await loadGoogleMaps();
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: center ?? { lat: 20, lng: 0 },
          zoom,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          disableDefaultUI: true,
          clickableIcons: allowPlacePicking,
          backgroundColor: "#0d1117",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#111722" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#111722" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#d4d9e2" }] },
            { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#5b6576" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#f4f7fb" }] },
            { featureType: "poi.business", stylers: [{ visibility: "on" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#253142" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#18202d" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#e5e7eb" }] },
            { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#d1d5db" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#14304d" }] },
          ],
        });

        placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);

        mapRef.current.addListener("click", (event) => {
          if (!allowPlacePicking || readOnly || !event.placeId || !placesServiceRef.current) {
            return;
          }

          event.stop();
          setHintVisible(false);
          placesServiceRef.current.getDetails(
            {
              placeId: event.placeId,
              fields: [
                "name",
                "formatted_address",
                "geometry",
                "photos",
                "types",
                "address_components",
              ],
            },
            (result, status) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
                setError("Could not load the clicked Google place.");
                return;
              }

              const normalized = normalizeGooglePlaceDetails(result, null);
              if (!normalized) {
                setError("Clicked place did not include enough country/location data.");
                return;
              }

              setError("");
              onPlacePick?.(normalized);
            },
          );
        });
      } catch (mapError) {
        if (!cancelled) {
          setError(mapError.message || "Google Maps failed to initialize.");
        }
      }
    }

    initializeMap();
    return () => {
      cancelled = true;
    };
  }, [allowPlacePicking, onPlacePick, readOnly]);

  useEffect(() => {
    if (!mapRef.current || !center) {
      return;
    }

    mapRef.current.panTo(center);
    mapRef.current.setZoom(zoom);
  }, [center?.lat, center?.lng, zoom]);

  useEffect(() => {
    if (!mapRef.current || !marker) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: marker.position,
        title: marker.title,
        animation: window.google.maps.Animation.DROP,
      });
    } else {
      markerRef.current.setPosition(marker.position);
      markerRef.current.setTitle(marker.title);
      markerRef.current.setMap(mapRef.current);
    }
  }, [marker?.position?.lat, marker?.position?.lng, marker?.title]);

  const apiKeyMissing = !getGoogleMapsApiKey();

  return (
    <div className="relative h-[24rem] w-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#0d1117] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]">
      <div ref={mapContainerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-[#07090d]/90 to-transparent px-4 py-4">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#111722]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
          <Satellite size={12} className="text-red-400" />
          Google Maps Live View
        </div>
        {marker && (
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-[#111722]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-red-200 backdrop-blur-md">
            <MapPin size={12} />
            {readOnly ? "Locked" : marker.title}
          </div>
        )}
      </div>

      {allowPlacePicking && !readOnly && hintVisible && !apiKeyMissing && !error && (
        <div className="pointer-events-none absolute left-4 bottom-4 rounded-2xl border border-white/15 bg-[#0b1118]/80 px-4 py-3 text-xs text-white/75 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold text-white/85">
            <MousePointerClick size={14} className="text-red-300" />
            Click Google place labels on the map
          </div>
          <div className="mt-1 text-white/55">Picking a place here auto-fills both the country and place fields.</div>
        </div>
      )}

      {(apiKeyMissing || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#05070b]/80 p-6 text-center text-sm text-white/75 backdrop-blur-sm">
          <div className="max-w-sm rounded-[1.5rem] border border-red-500/25 bg-[#0b1118]/85 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">Map Setup Required</div>
            <div className="mt-3 leading-relaxed">
              {error || "Add VITE_GOOGLE_MAPS_API_KEY to .env and restart the app to enable the live Google map."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleMapPanel;
