import React from "react";
import {
  ChevronLeft,
  Fingerprint,
  Image as ImageIcon,
  LoaderCircle,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import { CountryCombobox } from "./src/components/CountryCombobox.jsx";
import { GoogleMapPanel } from "./src/components/GoogleMapPanel.jsx";

export const HidingScreen = ({
  localPlayer,
  opponent,
  countryQuery,
  selectedCountry,
  countryOptions,
  placeQuery,
  selectedPlace,
  placePredictions,
  placeSearchBusy,
  placeSearchError,
  mapCenter,
  mapMarker,
  mapSessionKey,
  isLocked,
  isBusy,
  statusMessage,
  opponentHideLocked,
  onBack,
  onCountryQueryChange,
  onSelectCountry,
  onPlaceQueryChange,
  onSelectPrediction,
  onMapPlacePick,
  onMapError,
  onConfirm,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] font-sans text-slate-50 selection:bg-red-500/30">
      <GoogleMapPanel
        key={`hide-map-${mapSessionKey}`}
        center={mapCenter}
        zoom={selectedPlace ? 12 : selectedCountry ? 5 : 2}
        marker={mapMarker}
        readOnly={isLocked}
        allowPlacePicking={!isLocked}
        fullscreen
        onPlacePick={onMapPlacePick}
        onMapError={onMapError}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070b]/60 via-transparent to-[#05070b]/75" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070b]/55 via-transparent to-[#05070b]/30" />

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
        <div className="pointer-events-none flex items-start justify-between p-6">
          <div className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1117]/76 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/15 bg-[#0f141d]/75 p-2 transition-colors hover:bg-[#1a2230]"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                Phase 01
              </div>
              <h1 className="text-xl font-black italic tracking-tight text-white">
                SECURE YOUR HIDE
              </h1>
            </div>
          </div>

          <div className="pointer-events-auto hidden rounded-2xl border border-white/10 bg-[#0d1117]/76 px-4 py-3 text-right shadow-2xl backdrop-blur-xl md:block">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/48">Coordinates Lock</div>
            <div className="text-sm font-black tracking-wider text-red-300">
              {selectedPlace ? `${selectedPlace.lat.toFixed(4)} / ${selectedPlace.lng.toFixed(4)}` : "Waiting for place selection"}
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wide text-white/62">
              {selectedCountry ? selectedCountry.name : "Select country"}
            </div>
          </div>
        </div>

        <div className="pointer-events-none flex flex-1 items-stretch justify-between gap-6 px-6 pb-8">
          <div className="pointer-events-auto relative z-30 flex w-full max-w-md flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 rounded-[1.4rem] border border-white/15 bg-[#0d1117]/82 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2">
              <StatusPanel
                name={localPlayer?.displayName ?? "You"}
                label="Your Hide"
                state={isLocked ? "Locked" : "Selecting"}
                highlight
              />
              <StatusPanel
                name={opponent?.displayName ?? "Opponent"}
                label="Rival Hide"
                state={opponent ? (opponentHideLocked ? "Locked" : "Selecting") : "Waiting"}
              />
            </div>

            <div className="rounded-[1.4rem] border border-white/15 bg-[#0d1117]/82 p-4 shadow-2xl backdrop-blur-xl">
              <CountryCombobox
                label="Target Country"
                query={countryQuery}
                selectedOption={selectedCountry}
                options={countryOptions}
                placeholder="Start typing a country"
                emptyText="No countries matched this query."
                disabled={isLocked}
                onQueryChange={onCountryQueryChange}
                onSelect={onSelectCountry}
              />

              <div className="mt-4">
                <CountryCombobox
                  label="Google Place Search"
                  query={placeQuery}
                  selectedOption={selectedPlace}
                  options={placePredictions}
                  placeholder={selectedCountry ? "Search for any Google place in that country" : "Choose a country first"}
                  emptyText={selectedCountry ? "No Google place predictions yet." : "Choose a country to enable place search."}
                  disabled={!selectedCountry || isLocked}
                  onQueryChange={onPlaceQueryChange}
                  onSelect={onSelectPrediction}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option) => option.primaryText ?? option.name ?? option.description}
                  getOptionDescription={(option) => option.secondaryText ?? option.description ?? ""}
                  selectionLabel={selectedPlace?.name ?? ""}
                />
                {placeSearchBusy && <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.24em] text-red-300">Loading Google Places…</div>}
                {placeSearchError && <div className="mt-2 text-xs text-red-300">{placeSearchError}</div>}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto relative z-10 hidden w-full max-w-sm flex-col gap-4 lg:flex">
            <div className="overflow-hidden rounded-[1.75rem] border border-red-500/25 bg-[#0d1117]/82 p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-800">
                <img
                  src={selectedPlace?.previewImage || "/assets/world-map.svg"}
                  alt={selectedPlace?.name || selectedCountry?.name || "Google Places preview"}
                  className="h-full w-full object-cover opacity-88"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070b]/92 to-transparent" />
                <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded border border-white/15 bg-[#0b1118]/72 px-2 py-1 backdrop-blur-md">
                  <ImageIcon size={10} className="text-emerald-300" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                    {isLocked ? "Hide Locked" : "Live Google Preview"}
                  </span>
                </div>
              </div>

              <div className="relative mt-4 p-1">
                <h3 className="mb-1 text-base font-bold uppercase leading-tight tracking-tight text-white">
                  {selectedPlace?.name || selectedCountry?.name || "Choose a country and place"}
                </h3>
                <p className="mb-3 flex items-center gap-1 text-xs font-medium text-white/60">
                  <Target size={12} className="text-red-400" />
                  {selectedPlace?.formattedAddress || selectedCountry?.officialName || "Google Places will fill this in after selection."}
                </p>

                <div className="flex gap-2 text-[10px] font-mono">
                  <div className="flex-1 rounded border border-white/8 bg-white/7 p-2">
                    <span className="mb-0.5 block text-white/38">SOURCE</span>
                    <span className="text-white/88">Google Places</span>
                  </div>
                  <div className="flex-1 rounded border border-white/8 bg-white/7 p-2">
                    <span className="mb-0.5 block text-white/38">COUNTRY</span>
                    <span className="text-yellow-300">{selectedCountry?.code || "--"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none px-6 pb-8">
          <div className="pointer-events-auto mx-auto flex w-full max-w-5xl items-end justify-between gap-6">
            <div className="max-w-md rounded-2xl border border-white/12 bg-[#0d1117]/82 px-4 py-3 text-sm text-white/78 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-red-300">
                <UserRound size={12} /> Live Status
              </div>
              <div>{statusMessage}</div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLocked || isBusy || !selectedPlace}
                className={`group relative flex w-full min-w-[22rem] items-center justify-center overflow-hidden rounded-2xl px-8 py-5 font-black text-white shadow-[0_0_50px_-15px_rgba(220,38,38,0.6)] transition-all ${isLocked || isBusy || !selectedPlace ? "cursor-not-allowed border border-white/12 bg-white/6 text-white/42" : "bg-red-600 hover:scale-[1.02] hover:bg-red-500 active:scale-95"}`}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <div className="relative z-10 flex items-center gap-3">
                  {isLocked ? <ShieldCheck size={24} /> : isBusy ? <LoaderCircle size={24} className="animate-spin" /> : <Fingerprint size={28} className="opacity-90 transition-opacity group-hover:opacity-100" />}
                  <span className="text-3xl uppercase italic tracking-tighter drop-shadow-md">
                    {isLocked ? "HIDE LOCKED" : isBusy ? "LOCKING..." : "HIDE HERE"}
                  </span>
                </div>
              </button>

              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/42">
                {isLocked
                  ? opponentHideLocked
                    ? "Both hides locked // Seek phase loading"
                    : "Hide locked // Waiting for rival"
                  : `Selected target: ${selectedPlace?.name || selectedCountry?.name || "No Google place selected"}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusPanel({ name, label, state, highlight = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${highlight ? "border-red-500/30 bg-red-950/22" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/88">{name}</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-white/48">
            <UserRound size={11} className={highlight ? "text-red-300" : "text-white/45"} />
            <span>{label}</span>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${state === "Locked" ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/58"}`}>
          {state}
        </span>
      </div>
    </div>
  );
}

export default HidingScreen;

