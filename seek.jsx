import React from "react";
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  LoaderCircle,
  Lock,
  Radio,
  Radar,
  ShieldCheck,
  Target,
  Unlock,
  UserRound,
  ScanEye,
} from "lucide-react";
import { CountryCombobox } from "./src/components/CountryCombobox.jsx";
import { GoogleMapPanel } from "./src/components/GoogleMapPanel.jsx";

export const SeekingScreen = ({
  localPlayer,
  opponent,
  currentRound,
  localReady,
  opponentReady,
  countryQuery,
  selectedCountry,
  countryOptions,
  onBack,
  onCountryQueryChange,
  onSelectCountry,
  onSubmitGuess,
  onReady,
  mapCenter,
  mapMarker,
  mapSensitivity,
  revealedHints,
  totalHintCount,
  guessHistory,
  waitingForLocation,
  waitingForReady,
  canReady,
  isBusy,
  statusMessage,
  currentScore,
  turnNumber,
}) => {
  const visibleCount = Math.min(revealedHints.length, totalHintCount);
  const controlsDisabled = waitingForLocation || waitingForReady;
  const actionDisabled = waitingForLocation
    ? true
    : waitingForReady
      ? !canReady || isBusy
      : isBusy || !selectedCountry;
  const actionLabel = waitingForLocation
    ? "Waiting For Hider"
    : waitingForReady
      ? localReady
        ? "READY LOCKED"
        : isBusy
          ? "SYNCING"
          : "READY FOR HUNT"
      : isBusy
        ? "Transmitting"
        : `Lock ${selectedCountry?.name || "Country"}`;
  const actionHandler = waitingForReady ? onReady : onSubmitGuess;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#07090d] font-sans text-slate-50 selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-[#07090d]">
        <img
          src="/assets/world-map.svg"
          alt="World Map"
          className="h-full w-full translate-y-12 scale-125 object-cover opacity-24 contrast-150"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070b]/88 via-transparent to-[#05070b]/88" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070b]/76 via-transparent to-[#05070b]/76" />
      </div>

      <div className="relative z-10 flex w-full items-start justify-between p-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/15 bg-[#0f141d]/75 p-2 text-white/80 transition hover:bg-[#1a2230] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="h-2 w-2 animate-pulse bg-red-400" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">Phase 02</div>
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white drop-shadow-lg">Hunt Rival</h1>
        </div>

        <div className="absolute left-1/2 top-6 flex -translate-x-1/2 flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <Radar size={16} className="animate-spin-slow text-red-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/58">Signal Intercept</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((slot) => (
              <div key={slot} className={`h-2 w-12 ${slot <= turnNumber ? "bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.55)]" : "bg-white/12"}`} />
            ))}
          </div>
          <div className="mt-2 text-sm font-black uppercase tracking-widest text-white/82">
            Turn {turnNumber} <span className="text-white/34">//</span> 04
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/46">Current Score</div>
          <div className="text-2xl font-black tracking-wider text-white">
            {currentScore.toLocaleString()} <span className="text-sm text-red-400">PTS</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">Connection Stable</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid flex-1 grid-cols-1 gap-6 px-6 pb-8 xl:grid-cols-[320px_1fr_360px]">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/15 bg-[#0d1117]/80 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <ReadyPanel
              name={localPlayer?.displayName ?? "You"}
              role={currentRound?.seekerId === localPlayer?.id ? "SEEKER" : "HIDER"}
              ready={localReady}
              highlight={currentRound?.seekerId === localPlayer?.id}
            />
            <ReadyPanel
              name={opponent?.displayName ?? "Opponent"}
              role={currentRound?.seekerId === opponent?.id ? "SEEKER" : currentRound?.hiderId === opponent?.id ? "HIDER" : "PENDING"}
              ready={opponentReady}
              highlight={currentRound?.seekerId === opponent?.id}
              pending={!opponent}
            />
          </div>

          <div className="flex items-center justify-between border-b border-white/12 pb-2">
            <div className="flex items-center gap-2 text-white/86">
              <ScanEye size={18} className="text-red-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Recon Data</h2>
            </div>
            <span className="rounded border border-white/12 px-2 py-0.5 text-[10px] font-mono text-white/46">AUTO-DECRYPT</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: totalHintCount }, (_, index) => {
              const hint = revealedHints[index];
              const isVisible = Boolean(hint);
              return (
                <div
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${isVisible ? "border-red-500/45 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.12)]" : "border-white/8 bg-black/55"}`}
                >
                  <img src="/assets/world-map.svg" alt="Hint background" className={`h-full w-full object-cover ${isVisible ? "opacity-35" : "opacity-12 grayscale"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/70 to-transparent" />
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-[#0b1118]/80 px-1.5 py-0.5 text-[9px] font-mono text-white/68">
                    {isVisible ? <Unlock size={8} /> : <Lock size={8} />}
                    T-0{index + 1}
                  </div>
                  {isVisible ? (
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">{hint.title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-white/80">{hint.text}</div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Lock size={20} className="text-white/24" />
                      <div className="text-[9px] font-mono tracking-widest text-white/34">LOCKED</div>
                    </div>
                  )}
                  {index === visibleCount - 1 && isVisible && (
                    <div className="absolute right-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                      <AlertTriangle size={8} className="mr-1 inline-block" /> NEW
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/8 bg-white/6 p-3 text-[10px] font-mono leading-relaxed text-white/48">
            <span className="font-bold text-red-300">SYSTEM NOTE:</span> Wrong guesses unlock more intel. Type to search any country from the live country list.
          </div>
        </div>

        <GoogleMapPanel
          center={mapCenter}
          zoom={selectedCountry ? 5 : 2}
          marker={mapMarker}
          mapSensitivity={mapSensitivity}
        />

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/15 bg-[#0d1117]/82 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/46">
              <Radio size={12} className="text-white/40" />
              Trajectory Analysis
            </div>

            <div className="flex flex-col gap-2">
              {guessHistory.length === 0 ? (
                <div className="rounded border border-white/8 bg-white/6 p-3 text-xs text-white/52">
                  No guesses logged yet. Type to search a country and lock it in.
                </div>
              ) : (
                guessHistory.map((guess) => (
                  <div key={`${guess.turn}-${guess.countryCode}`} className="flex items-center justify-between rounded border border-white/8 bg-white/6 p-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-black px-1.5 py-0.5 text-[10px] font-bold text-white/34">T{guess.turn}</div>
                      <div className="text-xs font-medium text-white/84">{guess.country}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-white/60">{guess.distanceKm} KM</span>
                      <span className="rounded border border-white/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-300">{guess.label}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border-2 border-red-500/30 bg-[#0d1117]/84 p-5 shadow-[0_0_30px_rgba(220,38,38,0.15)] backdrop-blur-2xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

            <CountryCombobox
              label="Set Coordinates (Country)"
              query={countryQuery}
              selectedOption={selectedCountry}
              options={countryOptions}
              placeholder="Start typing any country"
              emptyText="No countries matched this query."
              disabled={controlsDisabled}
              onQueryChange={onCountryQueryChange}
              onSelect={onSelectCountry}
            />

            <div className="mt-2 text-right text-[9px] font-mono italic text-white/42">
              {waitingForLocation
                ? "Awaiting hidden location lock"
                : waitingForReady
                  ? "Location locked. Both players must ready up before the hunt begins."
                  : statusMessage}
            </div>

            <button
              type="button"
              onClick={actionHandler}
              disabled={actionDisabled}
              className={`group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-lg px-6 py-4 font-black transition-all ${actionDisabled ? "cursor-not-allowed border border-white/12 bg-white/6 text-white/38" : "bg-red-600 text-white hover:scale-[1.02] hover:bg-red-500 active:scale-95"}`}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative z-10 flex items-center gap-2">
                {waitingForReady ? (
                  localReady ? <ShieldCheck size={20} /> : isBusy ? <LoaderCircle size={20} className="animate-spin" /> : <Radio size={20} className="opacity-90 group-hover:opacity-100" />
                ) : isBusy ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  <Target size={20} className="opacity-90 group-hover:opacity-100" />
                )}
                <span className="text-xl uppercase italic tracking-tighter">
                  {actionLabel}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ReadyPanel({ name, role, ready, highlight, pending = false }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${highlight ? "border-red-500/28 bg-red-950/20" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/86">{name}</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
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

export default SeekingScreen;
