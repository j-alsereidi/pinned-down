import React from "react";
import {
  Activity,
  ChevronLeft,
  LoaderCircle,
  Lock,
  Radio,
  Radar,
  ShieldCheck,
  Target,
  CheckCircle2,
  UserRound,
  ScanEye,
} from "lucide-react";
import { CountryCombobox } from "./src/components/CountryCombobox.jsx";
import { GoogleMapPanel } from "./src/components/GoogleMapPanel.jsx";

export const SeekingScreen = ({
  localPlayer,
  opponent,
  countryQuery,
  selectedCountry,
  countryOptions,
  onBack,
  onCountryQueryChange,
  onSelectCountry,
  onSubmitGuess,
  onMapCountryPick,
  onMapError,
  mapCenter,
  mapMarker,
  mapSessionKey,
  revealedHintImages,
  totalHintCount,
  guessHistory,
  waitingForTurnResolution,
  localSubmittedGuess,
  opponentSubmittedGuess,
  localCompleted,
  opponentCompleted,
  isBusy,
  statusMessage,
  currentScore,
  turnNumber,
  inlineError,
  turnIntroActive,
}) => {
  const controlsDisabled = turnIntroActive || waitingForTurnResolution || localCompleted;
  const actionDisabled = controlsDisabled || isBusy || !selectedCountry;
  const actionLabel = localCompleted
    ? "TARGET RESOLVED"
    : waitingForTurnResolution
      ? "GUESS LOCKED"
      : isBusy
        ? "TRANSMITTING"
        : `Lock ${selectedCountry?.name || "Country"}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] font-sans text-slate-50 selection:bg-red-500/30">
      <GoogleMapPanel
        key={`seek-map-${mapSessionKey}`}
        center={mapCenter}
        zoom={selectedCountry ? 5 : 2}
        marker={mapMarker}
        readOnly={turnIntroActive}
        allowCountryPicking
        fullscreen
        onCountryPick={onMapCountryPick}
        onMapError={onMapError}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070b]/72 via-transparent to-[#05070b]/76" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070b]/58 via-transparent to-[#05070b]/35" />

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
        <div className="pointer-events-none flex items-start justify-between p-6">
          <div className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1117]/76 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/15 bg-[#0f141d]/75 p-2 text-white/80 transition hover:bg-[#1a2230] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse bg-red-400" />
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">Phase 02</div>
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tight text-white drop-shadow-lg">Hunt Rival</h1>
            </div>
          </div>

          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0d1117]/76 px-4 py-3 text-right shadow-2xl backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/46">Current Score</div>
            <div className="text-2xl font-black tracking-wider text-white">
              {currentScore.toLocaleString()} <span className="text-sm text-red-400">PTS</span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">Connection Stable</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2">
          <div className="pointer-events-auto min-w-[16rem] rounded-[1.4rem] border border-white/12 bg-[#0d1117]/80 px-5 py-3 text-center shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-red-300">
              <Radar size={12} />
              Turn Indicator
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              {Array.from({ length: totalHintCount }, (_, index) => {
                const currentTurn = Math.min(turnNumber, totalHintCount);
                const step = index + 1;
                const isActive = step === currentTurn;
                const isResolved = step < currentTurn;

                return (
                  <div
                    key={step}
                    className={`h-2.5 w-12 rounded-full transition ${isActive ? "bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.55)]" : isResolved ? "bg-white/55" : "bg-white/12"}`}
                  />
                );
              })}
            </div>
            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/76">
              Turn {String(Math.min(turnNumber, totalHintCount)).padStart(2, "0")} / {String(totalHintCount).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="pointer-events-none flex flex-1 items-stretch justify-between gap-6 px-6 pb-8">
          <div className="pointer-events-auto flex w-full max-w-sm flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#0d1117]/80 p-3 shadow-2xl backdrop-blur-xl">
              <StatusPanel
                name={localPlayer?.displayName ?? "You"}
                label="Your Seek"
                state={localCompleted ? "Complete" : localSubmittedGuess ? "Guess Locked" : "Choosing"}
                highlight
              />
              <StatusPanel
                name={opponent?.displayName ?? "Opponent"}
                label="Rival Seek"
                state={opponentCompleted ? "Complete" : opponentSubmittedGuess ? "Guess Locked" : "Choosing"}
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/15 bg-[#0d1117]/80 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-2">
                <div className="flex items-center gap-2 text-white/86">
                  <ScanEye size={18} className="text-red-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Image Intel</h2>
                </div>
                <span className="rounded border border-white/12 px-2 py-0.5 text-[10px] font-mono text-white/46">1 REVEAL / ROUND</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: totalHintCount }, (_, index) => {
                  const hintImage = revealedHintImages[index];
                  const isVisible = Boolean(hintImage);
                  return (
                    <div
                      key={index}
                      className={`relative aspect-square overflow-hidden rounded-lg border ${isVisible ? "border-red-500/45 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.12)]" : "border-white/8 bg-black/55"}`}
                    >
                      {isVisible ? (
                        <img src={hintImage.imageUrl} alt={`Hint ${index + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <img src="/assets/world-map.svg" alt="Locked hint" className="h-full w-full object-cover opacity-12 grayscale" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/45 to-transparent" />
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-[#0b1118]/80 px-1.5 py-0.5 text-[9px] font-mono text-white/68">
                        {isVisible ? <ShieldCheck size={8} /> : <Lock size={8} />}
                        T-0{index + 1}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">
                        {isVisible ? `Image hint ${index + 1}` : "Locked"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex w-full max-w-md flex-col justify-end gap-4 self-stretch">
            <div className="rounded-[1.5rem] border border-white/15 bg-[#0d1117]/84 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/46">
                <Radar size={12} className="text-red-400" />
                Guess Controls
              </div>

              <CountryCombobox
                label="Guess Opponent Country"
                query={countryQuery}
                selectedOption={selectedCountry}
                options={countryOptions}
                placeholder="Start typing any country"
                emptyText="No countries matched this query."
                disabled={controlsDisabled}
                onQueryChange={onCountryQueryChange}
                onSelect={onSelectCountry}
              />

              <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
                <StatusPill label={selectedCountry ? `Selected ${selectedCountry.name}` : "No selection"} active={Boolean(selectedCountry)} />
                <StatusPill label={localSubmittedGuess ? "You submitted" : "You not submitted"} active={localSubmittedGuess} />
                <StatusPill label={opponentSubmittedGuess ? "Rival submitted" : "Rival pending"} active={opponentSubmittedGuess} />
              </div>

              <div className="mt-3 text-right text-[9px] font-mono italic text-white/42">
                {localCompleted
                  ? "Your target is resolved. Waiting for the rival to finish."
                  : waitingForTurnResolution
                    ? "Your guess is locked. Waiting for the rival guess to resolve the round."
                    : statusMessage}
              </div>
              {inlineError && <div className="mt-3 rounded-xl border border-red-500/20 bg-red-950/25 px-3 py-2 text-xs text-red-300">{inlineError}</div>}

              <button
                type="button"
                onClick={onSubmitGuess}
                disabled={actionDisabled}
                className={`group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-lg px-6 py-4 font-black transition-all ${localCompleted ? "cursor-default border border-emerald-400/45 bg-emerald-500/18 text-emerald-100 shadow-[0_0_32px_-10px_rgba(16,185,129,0.65)]" : actionDisabled ? "cursor-not-allowed border border-white/12 bg-white/6 text-white/38" : "bg-red-600 text-white hover:scale-[1.02] hover:bg-red-500 active:scale-95"}`}
              >
                {!localCompleted && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />}
                <div className="relative z-10 flex items-center gap-2">
                  {localCompleted ? <CheckCircle2 size={20} className="text-emerald-200" /> : isBusy ? <LoaderCircle size={20} className="animate-spin" /> : <Target size={20} className="opacity-90 group-hover:opacity-100" />}
                  <span className="text-xl uppercase italic tracking-tighter">
                    {actionLabel}
                  </span>
                </div>
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-white/15 bg-[#0d1117]/84 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/46">
                <Radio size={12} className="text-white/40" />
                Guess Log
              </div>

              <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                {guessHistory.length === 0 ? (
                  <div className="rounded border border-white/8 bg-white/6 p-3 text-xs text-white/52">
                    No guesses logged yet. Type to search a country or click the map to choose one.
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
          </div>
        </div>

        <div className="pointer-events-none px-6 pb-6 text-center">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1117]/78 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.28em] text-white/48 shadow-2xl backdrop-blur-xl">
            <ScanEye size={12} className="text-red-300" />
            Turn {Math.min(turnNumber, totalHintCount)} of {totalHintCount}
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusPanel({ name, label, state, highlight = false }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${highlight ? "border-red-500/28 bg-red-950/20" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/86">{name}</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-white/45">
            <UserRound size={11} className={highlight ? "text-red-300" : "text-white/45"} />
            <span>{label}</span>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${state === "Complete" || state === "Guess Locked" ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/58"}`}>
          {state}
        </span>
      </div>
    </div>
  );
}

function StatusPill({ label, active }) {
  return (
    <span className={`rounded-full border px-2 py-1 ${active ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/58"}`}>
      {label}
    </span>
  );
}

export default SeekingScreen;




