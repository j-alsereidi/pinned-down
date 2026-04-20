import React, { useEffect, useRef, useState } from "react";
import { MapPin, MousePointerClick, Satellite } from "lucide-react";
import { loadGoogleMaps, getGoogleMapsApiKey } from "../game/googleMaps.js";
import { normalizeGooglePlaceDetails } from "../game/placeDetails.js";

function getCountryComponent(result) {
  return result?.address_components?.find((component) => component.types?.includes("country")) ?? null;
}

function clamp(value, min, max) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function getCursorPulsePosition(event, container) {
  if (!container) {
    return { x: 48, y: 48 };
  }

  const rect = container.getBoundingClientRect();
  const padding = 24;
  const minX = padding;
  const maxX = Math.max(padding, rect.width - padding);
  const minY = padding;
  const maxY = Math.max(padding, rect.height - padding);
  const domEvent = event?.domEvent;

  if (domEvent && typeof domEvent.clientX === "number" && typeof domEvent.clientY === "number") {
    return {
      x: clamp(domEvent.clientX - rect.left, minX, maxX),
      y: clamp(domEvent.clientY - rect.top, minY, maxY),
    };
  }

  if (typeof event?.pixel?.x === "number" && typeof event?.pixel?.y === "number") {
    return {
      x: clamp(event.pixel.x, minX, maxX),
      y: clamp(event.pixel.y, minY, maxY),
    };
  }

  return {
    x: clamp(rect.width / 2, minX, maxX),
    y: clamp(rect.height / 2, minY, maxY),
  };
}

export function GoogleMapPanel({
  center,
  zoom = 4,
  marker,
  readOnly = false,
  allowPlacePicking = false,
  allowCountryPicking = false,
  fullscreen = false,
  onPlacePick,
  onCountryPick,
  onMapError,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placesServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const manualCameraRef = useRef(false);
  const initializedRef = useRef(false);
  const cursorPulseTimeoutRef = useRef(null);
  const callbacksRef = useRef({ onPlacePick, onCountryPick, onMapError });
  const flagsRef = useRef({ readOnly, allowPlacePicking, allowCountryPicking });
  const [fatalError, setFatalError] = useState("");
  const [hintVisible, setHintVisible] = useState(true);
  const [cursorPulse, setCursorPulse] = useState(null);

  useEffect(() => {
    callbacksRef.current = { onPlacePick, onCountryPick, onMapError };
  }, [onCountryPick, onMapError, onPlacePick]);

  useEffect(() => {
    flagsRef.current = { readOnly, allowPlacePicking, allowCountryPicking };
  }, [allowCountryPicking, allowPlacePicking, readOnly]);

  useEffect(() => () => {
    if (cursorPulseTimeoutRef.current) {
      clearTimeout(cursorPulseTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    function flashCursorQuestion(event) {
      const position = getCursorPulsePosition(event, mapContainerRef.current);
      const token = `${Date.now()}-${Math.random()}`;
      setCursorPulse({ ...position, token });

      if (cursorPulseTimeoutRef.current) {
        clearTimeout(cursorPulseTimeoutRef.current);
      }

      cursorPulseTimeoutRef.current = setTimeout(() => {
        setCursorPulse((current) => (current?.token === token ? null : current));
      }, 650);
    }

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
            { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#f4f7fb" }] },
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
        geocoderRef.current = new google.maps.Geocoder();

        mapRef.current.addListener("dragstart", () => {
          if (initializedRef.current) {
            manualCameraRef.current = true;
          }
        });
        mapRef.current.addListener("zoom_changed", () => {
          if (initializedRef.current) {
            manualCameraRef.current = true;
          }
        });

        mapRef.current.addListener("click", (event) => {
          const { readOnly: currentReadOnly, allowPlacePicking: canPickPlace, allowCountryPicking: canPickCountry } = flagsRef.current;
          if (currentReadOnly) {
            return;
          }

          if (canPickPlace && event.placeId && placesServiceRef.current) {
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
                  "user_ratings_total",
                ],
              },
              (result, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
                  callbacksRef.current.onMapError?.("Could not load the clicked Google place.");
                  return;
                }

                const normalized = normalizeGooglePlaceDetails(result, null);
                if (!normalized) {
                  callbacksRef.current.onMapError?.("Clicked place did not include enough country/location data.");
                  return;
                }

                callbacksRef.current.onMapError?.("");
                callbacksRef.current.onPlacePick?.(normalized);
              },
            );
            return;
          }

          if (canPickCountry && event.latLng && geocoderRef.current) {
            geocoderRef.current.geocode({ location: event.latLng }, (results, status) => {
              if (status !== "OK" || !results?.length) {
                callbacksRef.current.onMapError?.("");
                flashCursorQuestion(event);
                return;
              }

              const countryComponent = results
                .map(getCountryComponent)
                .find(Boolean);

              if (!countryComponent?.short_name) {
                callbacksRef.current.onMapError?.("");
                flashCursorQuestion(event);
                return;
              }

              callbacksRef.current.onMapError?.("");
              callbacksRef.current.onCountryPick?.(countryComponent.short_name.toUpperCase());
            });
          }
        });

        initializedRef.current = true;
      } catch (mapError) {
        if (!cancelled) {
          const message = mapError.message || "Google Maps failed to initialize.";
          setFatalError(message);
          callbacksRef.current.onMapError?.(message);
        }
      }
    }

    initializeMap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.setOptions({ clickableIcons: allowPlacePicking });
  }, [allowPlacePicking]);

  useEffect(() => {
    if (!mapRef.current || !center || manualCameraRef.current) {
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
  const containerClasses = fullscreen
    ? "absolute inset-0 overflow-hidden bg-[#0d1117]"
    : "relative h-[24rem] w-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#0d1117] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]";

  return (
    <div className={containerClasses}>
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

      {allowPlacePicking && !readOnly && hintVisible && !apiKeyMissing && !fatalError && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-white/15 bg-[#0b1118]/80 px-4 py-3 text-xs text-white/75 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold text-white/85">
            <MousePointerClick size={14} className="text-red-300" />
            Click Google place labels on the map
          </div>
          <div className="mt-1 text-white/55">Picking a place here auto-fills both the country and place fields.</div>
        </div>
      )}

      {allowCountryPicking && !readOnly && !apiKeyMissing && !fatalError && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-white/15 bg-[#0b1118]/80 px-4 py-3 text-xs text-white/75 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold text-white/85">
            <MousePointerClick size={14} className="text-red-300" />
            Click anywhere on the map to choose a country
          </div>
          <div className="mt-1 text-white/55">Selecting from the map updates the country picker but does not submit the guess.</div>
        </div>
      )}

      {cursorPulse && (
        <div
          className="pointer-events-none absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/60 bg-[#101723]/88 text-lg font-black text-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.28)] animate-[ping_0.2s_ease-out_1]"
          style={{ left: `${cursorPulse.x}px`, top: `${cursorPulse.y}px` }}
          aria-hidden="true"
        >
          ?
        </div>
      )}

      {(apiKeyMissing || fatalError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#05070b]/55 p-6 text-center text-sm text-white/75 backdrop-blur-sm">
          <div className="max-w-sm rounded-[1.5rem] border border-red-500/25 bg-[#0b1118]/85 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">Map Setup Required</div>
            <div className="mt-3 leading-relaxed">
              {fatalError || "Add VITE_GOOGLE_MAPS_API_KEY to .env and restart the app to enable the live Google map."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleMapPanel;
