import React from "react";
import {
  Activity,
  Crosshair,
  LoaderCircle,
  LogOut,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export const VictoryScreen = ({
  localPlayer,
  opponent,
  localScore,
  opponentScore,
  result,
  onDisconnect,
  onRematch,
  rematchPending,
  isBusy,
}) => {
  const localWon = result?.winnerId === localPlayer?.id;
  const localRound = result?.local;
  const opponentRound = result?.opponent;
  const title = localWon ? "ROUND WON" : "ROUND LOST";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black font-sans text-slate-50 selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#020202]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-[900] italic tracking-tighter text-red-600/[0.03] drop-shadow-2xl">
          VICTORY
        </div>
        <img
          src="/assets/world-map.svg"
          alt="World Map"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-10 contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] md:text-8xl">
            {title}
          </h1>
          <div className="mt-3 text-sm font-mono uppercase tracking-[0.3em] text-red-300">
            Seek score resolved this round
          </div>
        </div>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-3xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <PlayerScoreCard
              playerName={localPlayer?.displayName}
              score={localScore}
              won={localWon}
              subtitle={localRound?.found ? `Found on turn ${localRound.foundOnTurn}` : "Target not found"}
            />

            <div className="flex flex-col items-center justify-center gap-4 px-8">
              <div className="h-16 w-px bg-gradient-to-b from-transparent to-red-500/50" />
              <div className="rotate-45 rounded-2xl bg-red-600 p-4 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <Trophy size={32} className="-rotate-45 text-white" fill="currentColor" />
              </div>
              <div className="h-16 w-px bg-gradient-to-t from-transparent to-red-500/50" />
            </div>

            <PlayerScoreCard
              playerName={opponent?.displayName ?? "Disconnected Rival"}
              score={opponentScore}
              won={!localWon}
              subtitle={opponentRound?.found ? `Found on turn ${opponentRound.foundOnTurn}` : "Target not found"}
              muted
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 lg:grid-cols-2">
            <BreakdownCard
              title="Your Seek Breakdown"
              topValue={`${localRound?.seek?.score ?? 0} PTS`}
              rows={[
                ["Target country", localRound?.seek?.targetCountry ?? "Unknown"],
                ["Attempts score", `${localRound?.seek?.attemptsScore ?? 0}`],
                ["Distance score", `${localRound?.seek?.distanceScore ?? 0}`],
                ["Time score", `${localRound?.seek?.timeScore ?? 0}`],
                ["Obscurity bonus", `${localRound?.seek?.obscurityBonus ?? 0}`],
                ["Target reviews", localRound?.seek?.reviewCount == null ? "Unknown" : `${localRound.seek.reviewCount}`],
              ]}
            />
            <BreakdownCard
              title="Seek Telemetry"
              topValue={`${localRound?.seek?.baseSeekScore ?? 0} Base`}
              rows={[
                ["Target place", localRound?.seek?.targetPlace ?? "Unknown"],
                ["Obscurity rate", formatPercent(localRound?.seek?.obscurityRate ?? 0)],
                ["Time", `${Math.round((localRound?.seek?.totalGuessTimeMs ?? 0) / 1000)} sec`],
                ["Avg distance", `${localRound?.seek?.averageDistance ?? 0} km`],
                ["Closest distance", `${localRound?.seek?.closestDistance ?? 0} km`],
                ["Guesses used", `${localRound?.seek?.attemptsUsed ?? 0}`],
              ]}
            />
          </div>

          <div className="mt-8 w-full border-t border-white/10 pt-8">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <Zap size={14} /> Operation Telemetry <Zap size={14} />
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <TelemetryCard icon={<Crosshair size={16} className="text-red-500" />} value={`${localRound?.seek?.closestDistance ?? 0} KM`} label="Closest Guess" />
              <TelemetryCard icon={<MapPin size={16} className="text-red-500" />} value={localRound?.seek?.targetCountry ?? "Unknown"} label="Rival Country" />
              <TelemetryCard icon={<Activity size={16} className="text-red-500" />} value={`Turn ${localRound?.foundOnTurn ?? 4}`} label={localRound?.found ? "Find Turn" : "Max Turns Used"} />
              <TelemetryCard icon={<ShieldCheck size={16} className="text-red-500" />} value={`+${Math.abs(localScore - opponentScore).toLocaleString()}`} label="Score Differential" emphasis />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <button
            type="button"
            onClick={onRematch}
            disabled={isBusy || rematchPending}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-10 py-5 font-black transition-all ${isBusy || rematchPending ? "cursor-not-allowed border border-white/10 bg-white/5 text-white/40" : "bg-red-600 text-white shadow-[0_0_40px_-10px_rgba(220,38,38,0.8)] hover:scale-[1.05] hover:bg-red-500 active:scale-95"}`}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {isBusy ? <LoaderCircle size={20} className="animate-spin" /> : <RefreshCcw size={20} className="transition-transform duration-500 group-hover:rotate-180" />}
            <span className="text-xl uppercase italic tracking-tight">
              {rematchPending ? "Rematch Pending" : "Rematch"}
            </span>
          </button>

          <button
            type="button"
            onClick={onDisconnect}
            className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 font-black text-white backdrop-blur-md transition-all hover:scale-[1.05] hover:bg-white/10 active:scale-95"
          >
            <LogOut size={20} className="text-white/50 transition-all group-hover:-translate-x-1 group-hover:text-white" />
            <span className="text-xl uppercase italic tracking-tight text-white/80 group-hover:text-white">
              Disconnect
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

function PlayerScoreCard({ playerName, score, won, subtitle, muted = false }) {
  return (
    <div className={`group flex flex-col items-center ${muted ? "text-left opacity-75" : "text-right"} md:${muted ? "items-start" : "items-end"}`}>
      <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
        <ShieldCheck size={12} className={won ? "text-green-500" : "text-white/30"} />
        Status: {won ? "Round Winner" : "Round Challenger"}
      </div>
      <h2 className="mb-1 text-3xl font-black uppercase tracking-tight text-white">
        {playerName}
      </h2>
      <div className="mb-3 text-[10px] font-mono text-white/35">{subtitle}</div>
      <div className="relative">
        <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
        <div className="relative z-10 bg-gradient-to-b from-white to-red-200 bg-clip-text text-6xl font-black tracking-tighter text-transparent">
          {score.toLocaleString()} <span className="text-2xl text-red-500">PTS</span>
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, topValue, rows }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">{title}</div>
      <div className="mt-3 text-2xl font-black tracking-tight text-white">{topValue}</div>
      <div className="mt-4 space-y-2 text-sm text-white/78">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/25 px-3 py-2">
            <span className="text-white/58">{label}</span>
            <span className="font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TelemetryCard({ icon, value, label, emphasis = false }) {
  return (
    <div className={`flex flex-col items-center rounded-xl border p-4 text-center ${emphasis ? "border-red-500/20 bg-red-600/10" : "border-white/5 bg-white/5"}`}>
      <div className="mb-2">{icon}</div>
      <div className={`text-xl font-black ${emphasis ? "text-red-400" : "text-white"}`}>{value}</div>
      <div className={`mt-1 text-[9px] font-mono uppercase ${emphasis ? "text-red-500/60" : "text-white/30"}`}>{label}</div>
    </div>
  );
}

export default VictoryScreen;
