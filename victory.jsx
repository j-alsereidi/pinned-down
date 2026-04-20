import React from "react";
import {
  Trophy,
  Skull,
  Crosshair,
  MapPin,
  RefreshCcw,
  LogOut,
  ShieldCheck,
  Activity,
  Zap,
  LoaderCircle,
} from "lucide-react";

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
  const title = result?.found ? "TARGET NEUTRALIZED!" : "TARGET SURVIVED!";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black font-sans text-slate-50 selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#020202]">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-[900] italic tracking-tighter text-red-600/[0.03] drop-shadow-2xl">
          VICTORY
        </div>
        <img
          src="/assets/world-map.svg"
          alt="World Map"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-10 contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] md:text-8xl">
            {title}
          </h1>
          <div className="mt-3 text-sm font-mono uppercase tracking-[0.3em] text-red-300">
            {result?.targetCountry} // round resolved in {result?.totalTurnsUsed} turns
          </div>
        </div>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-3xl">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <div className="group flex flex-col items-center text-right md:items-end">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                <ShieldCheck size={12} className={localWon ? "text-green-500" : "text-white/30"} /> Status: {localWon ? "Victorious" : "Defeated"}
              </div>
              <h2 className="mb-1 text-3xl font-black uppercase tracking-tight text-white">
                {localPlayer?.displayName}
              </h2>
              <div className="mb-6 text-[10px] font-mono text-white/30">ROOM: {localPlayer?.id?.slice(0, 8)}</div>
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
                <div className="relative z-10 bg-gradient-to-b from-white to-red-200 bg-clip-text text-6xl font-black tracking-tighter text-transparent">
                  {localScore.toLocaleString()} <span className="text-2xl text-red-500">PTS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 px-8">
              <div className="h-16 w-px bg-gradient-to-b from-transparent to-red-500/50" />
              <div className="rotate-45 rounded-2xl bg-red-600 p-4 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <Trophy size={32} className="-rotate-45 text-white" fill="currentColor" />
              </div>
              <div className="h-16 w-px bg-gradient-to-t from-transparent to-red-500/50" />
            </div>

            <div className="group flex flex-col items-center text-left opacity-70 grayscale-[0.3] transition-all hover:grayscale-0 md:items-start">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                <Skull size={12} className="text-red-500" /> Status: {localWon ? "Eliminated" : "Victorious"}
              </div>
              <h2 className="mb-1 text-3xl font-black uppercase tracking-tight text-white/80">
                {opponent?.displayName ?? "Disconnected Rival"}
              </h2>
              <div className="mb-6 text-[10px] font-mono text-white/30">REMOTE LINK</div>
              <div className="text-6xl font-black tracking-tighter text-white/50">
                {opponentScore.toLocaleString()} <span className="text-2xl text-white/30">PTS</span>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full border-t border-white/10 pt-8">
            <h3 className="mb-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <Zap size={14} /> Operation Telemetry <Zap size={14} />
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                <Crosshair size={16} className="mb-2 text-red-500" />
                <div className="text-xl font-black text-white">
                  {result?.averageDistance ?? 0} <span className="text-xs text-white/50">KM</span>
                </div>
                <div className="mt-1 text-[9px] font-mono uppercase text-white/30">Avg Distance</div>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                <MapPin size={16} className="mb-2 text-red-500" />
                <div className="text-xl font-black text-white">{result?.targetCountry}</div>
                <div className="mt-1 text-[9px] font-mono uppercase text-white/30">Target Sector</div>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                <Activity size={16} className="mb-2 text-red-500" />
                <div className="text-xl font-black text-white">Turn {result?.scoreBreakdown?.foundOnTurn ?? 4}</div>
                <div className="mt-1 text-[9px] font-mono uppercase text-white/30">
                  {result?.found ? "Lethal Strike" : "Target Escaped"}
                </div>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-red-500/20 bg-red-600/10 p-4 text-center">
                <Trophy size={16} className="mb-2 text-red-500" />
                <div className="text-xl font-black text-red-400">
                  +{Math.abs(localScore - opponentScore).toLocaleString()}
                </div>
                <div className="mt-1 text-[9px] font-mono uppercase text-red-500/60">Score Differential</div>
              </div>
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

export default VictoryScreen;
