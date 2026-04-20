import React from "react";
import {
  ChevronLeft,
  Fingerprint,
  Image as ImageIcon,
  LoaderCircle,
  Lock,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import { CountryCombobox } from "./src/components/CountryCombobox.jsx";
import { GoogleMapPanel } from "./src/components/GoogleMapPanel.jsx";

export const HidingScreen = ({
  localPlayer,
  opponent,
  currentRound,
  localReady,
  opponentReady,
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
  mapSensitivity,
  isLocked,
  isBusy,
  statusMessage,
  guessHistory,
  waitingForReady,
  canReady,
  onBack,
  onCountryQueryChange,
  onSelectCountry,
  onPlaceQueryChange,
  onSelectPrediction,
  onMapPlacePick,
  onConfirm,
  onReady,
}) => {
  const showPlaceDropdown = placeQuery.trim().length > 0 && !isLocked;
  const actionDisabled = waitingForReady
    ? !canReady || isBusy
    : isLocked || isBusy || !selectedPlace;
  const actionLabel = waitingForReady
    ? localReady
      ? "READY LOCKED"
      : isBusy
        ? "SYNCING..."
        : "READY FOR HUNT"
    : isLocked
      ? "LOCATION LOCKED"
      : isBusy
        ? "LOCKING..."
        : "HIDE HERE";
  const actionHandler = waitingForReady ? onReady : onConfirm;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#07090d] font-sans text-slate-50 selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-[#07090d]">
        <img
          src="/assets/world-map.svg"
          alt="Pinned Down tactical backdrop"
          className="h-full w-full scale-105 object-cover opacity-34 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070b]/78 via-transparent to-[#05070b]/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070b]/55 via-transparent to-[#05070b]/55" />
      </div>

      <div className="relative z-10 flex w-full items-start justify-between p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/15 bg-[#0f141d]/75 p-2 backdrop-blur-md transition-colors hover:bg-[#1a2230]"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                Phase 01
              </div>
              <h1 className="text-xl font-black italic tracking-tight text-white">
                SECURE LOCATION
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-[1.4rem] border border-white/15 bg-[#0d1117]/82 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2">
            <ReadyPanel
              name={localPlayer?.displayName ?? "You"}
              role={currentRound?.hiderId === localPlayer?.id ? "HIDER" : "SEEKER"}
              ready={localReady}
              highlight={currentRound?.hiderId === localPlayer?.id}
            />
            <ReadyPanel
              name={opponent?.displayName ?? "Opponent"}
              role={currentRound?.hiderId === opponent?.id ? "HIDER" : currentRound?.seekerId === opponent?.id ? "SEEKER" : "PENDING"}
              ready={opponentReady}
              highlight={currentRound?.hiderId === opponent?.id}
              pending={!opponent}
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

            <div className="relative mt-4">
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
                Google Place Search
              </label>
              <div className="flex items-center rounded-xl border border-white/15 bg-[#111722]/88 px-4 py-3 transition focus-within:border-red-500/50 hover:border-white/25">
                <Search size={16} className="mr-3 text-white/45" />
                <input
                  value={placeQuery}
                  disabled={!selectedCountry || isLocked}
                  onChange={(event) => onPlaceQueryChange(event.target.value)}
                  placeholder={selectedCountry ? "Search for any Google place in that country" : "Choose a country first"}
                  className="flex-1 bg-transparent text-sm font-semibold tracking-wide text-white outline-none placeholder:text-white/30"
                />
                {placeSearchBusy && <LoaderCircle size={16} className="animate-spin text-red-300" />}
              </div>

              {showPlaceDropdown && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-[#0b1118] p-2 shadow-2xl backdrop-blur-xl">
                  {placePredictions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-white/50">
                      {selectedCountry ? "No Google place predictions yet." : "Choose a country to enable place search."}
                    </div>
                  ) : (
                    placePredictions.map((prediction) => (
                      <button
                        key={prediction.id}
                        type="button"
                        onClick={() => onSelectPrediction(prediction)}
                        className="flex w-full items-start justify-between rounded-xl px-3 py-3 text-left text-white/78 transition hover:bg-white/7 hover:text-white"
                      >
                        <div>
                          <div className="font-semibold tracking-wide text-white/92">{prediction.primaryText}</div>
                          <div className="mt-1 text-xs text-white/50">{prediction.secondaryText || prediction.description}</div>
                        </div>
                        <MapPin size={14} className="mt-0.5 shrink-0 text-red-300" />
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedPlace && (
                <div className="mt-3 rounded-2xl border border-red-500/25 bg-red-950/28 px-4 py-3 text-sm text-white/82">
                  Armed Google place: <span className="font-semibold text-white">{selectedPlace.name}</span>
                </div>
              )}
              {placeSearchError && <div className="mt-3 text-xs text-red-300">{placeSearchError}</div>}
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/48">Coordinates Lock</div>
          <div className="text-sm font-black tracking-wider text-red-300">
            {selectedPlace ? `${selectedPlace.lat.toFixed(4)} / ${selectedPlace.lng.toFixed(4)}` : "Waiting for place selection"}
          </div>
          <div className="mt-2 text-xs font-medium uppercase tracking-wide text-white/62">
            {selectedCountry ? selectedCountry.name : "Select country"}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-6 pb-8 lg:grid-cols-[1.3fr_0.8fr]">
        <GoogleMapPanel
          center={mapCenter}
          zoom={selectedPlace ? 12 : selectedCountry ? 5 : 2}
          marker={mapMarker}
          readOnly={isLocked}
          allowPlacePicking={!isLocked}
          mapSensitivity={mapSensitivity}
          onPlacePick={onMapPlacePick}
        />

        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-red-500/25 bg-[#0d1117]/82 p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-800">
            <img
              src={selectedPlace?.previewImage || "/assets/world-map.svg"}
              alt={selectedPlace?.name || selectedCountry?.name || "Google Places preview"}
              className="h-full w-full object-cover opacity-88"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070b]/92 to-transparent" />
            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded border border-white/15 bg-[#0b1118]/72 px-2 py-1 backdrop-blur-md">
              <ImageIcon size={10} className="text-emerald-300" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                {isLocked ? "Google Place Locked" : "Live Google Preview"}
              </span>
            </div>
          </div>

          <div className="relative p-1">
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

          <div className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/78">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-red-300">
              <Radio size={12} /> Live Status
            </div>
            <div>{statusMessage}</div>
            {waitingForReady && (
              <div className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                Hide is locked. Both players need to press ready before the hunt begins.
              </div>
            )}
            {guessHistory.length > 0 && (
              <div className="mt-3 space-y-2">
                {guessHistory.map((guess) => (
                  <div key={`${guess.turn}-${guess.countryCode}`} className="flex items-center justify-between rounded-xl border border-white/12 bg-black/35 px-3 py-2 text-xs">
                    <span>Turn {guess.turn}: {guess.country}</span>
                    <span className="font-mono text-white/48">{guess.label} / {guess.distanceKm} KM</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex w-full flex-col items-center justify-end bg-gradient-to-t from-[#05070b] via-[#05070b]/80 to-transparent px-8 pb-12">
        <button
          type="button"
          onClick={actionHandler}
          disabled={actionDisabled}
          className={`group relative flex w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl px-8 py-5 font-black text-white shadow-[0_0_50px_-15px_rgba(220,38,38,0.6)] transition-all ${actionDisabled ? "cursor-not-allowed border border-white/12 bg-white/6 text-white/42" : "bg-red-600 hover:scale-[1.02] hover:bg-red-500 active:scale-95"}`}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <div className="relative z-10 flex items-center gap-3">
            {waitingForReady ? (
              localReady ? <ShieldCheck size={24} /> : isBusy ? <LoaderCircle size={24} className="animate-spin" /> : <Radio size={24} />
            ) : isLocked ? (
              <Lock size={24} />
            ) : isBusy ? (
              <LoaderCircle size={24} className="animate-spin" />
            ) : (
              <Fingerprint size={28} className="opacity-90 transition-opacity group-hover:opacity-100" />
            )}
            <span className="text-3xl uppercase italic tracking-tighter drop-shadow-md">
              {actionLabel}
            </span>
          </div>
        </button>

        <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/42">
          {waitingForReady
            ? `${localReady ? "You are ready" : "Press ready"} // ${opponentReady ? "Opponent ready" : "Opponent waiting"}`
            : `Selected target: ${selectedPlace?.name || selectedCountry?.name || "No Google place selected"}`}
        </div>
      </div>
    </div>
  );
};

function ReadyPanel({ name, role, ready, highlight, pending = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${highlight ? "border-red-500/30 bg-red-950/22" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/88">{name}</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-white/48">
            <UserRound size={11} className={highlight ? "text-red-300" : "text-white/45"} />
            <span>{pending ? "Awaiting Join" : role}</span>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${ready ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/58"}`}>
          {ready ? "Ready" : "Waiting"}
        </span>
      </div>
    </div>
  );
}

export default HidingScreen;
