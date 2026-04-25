import React from "react";
import {
  Copy,
  Radar,
  Radio,
  ShieldAlert,
  Swords,
  UserCheck,
  Wifi,
  X,
  Zap,
  Activity,
} from "lucide-react";
import { TechGlobeBackdrop } from "./src/components/TechGlobeBackdrop.jsx";

const globeScale = 1.12;
const globeOpacity = 0.15;
const globeYOffset = 30;

export const HostLobbyScreen = ({
  copied,
  lobbyCode,
  localPlayer,
  opponent,
  statusMessage,
  roundNumber,
  canStart,
  isBusy,
  onBack,
  onCopyCode,
  onStartRound,
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050507] font-sans text-slate-50 selection:bg-red-500/30">
      <TechGlobeBackdrop
        globeScale={globeScale}
        globeOpacity={globeOpacity}
        globeYOffset={globeYOffset}
        gridOpacity={0.04}
        ringOpacity={0.1}
      />

      <div className="relative z-10 flex w-full items-start justify-between p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="group rounded-lg border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-red-900/40 hover:text-red-300"
          >
            <X size={20} className="transition-transform group-hover:rotate-90" />
          </button>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Deployment Setup
            </div>
            <h1 className="text-xl font-black uppercase italic tracking-tight">
              Mission Lobby
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/45">
            Round Status
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Radio size={14} className="animate-pulse text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-green-400">
              Round {roundNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="relative flex w-full max-w-4xl flex-col items-center">
          <div className="relative mb-16 flex flex-col items-center">
            <div className="pointer-events-none absolute -inset-20 rounded-full bg-red-600/10 blur-[80px]" />

            <div className="mb-6 flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-4 py-1.5 backdrop-blur-md">
              <Zap size={12} className="text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-300">
                Secure Link Established
              </span>
              <Zap size={12} className="text-red-400" />
            </div>

            <h2 className="mb-4 text-[10px] font-mono uppercase tracking-widest text-white/55">
              Share this room code with your rival
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                {lobbyCode.split("").map((char, index) => (
                  <div
                    key={index}
                    className="relative flex h-28 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-red-500/50 bg-black/60 shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50" />
                    <span className="relative z-10 font-mono text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onCopyCode}
                className="group flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                <Copy size={24} className="text-white/60 group-hover:text-white" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/55">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-2xl">
            <div className="absolute left-1/2 top-0 h-1 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            <PlayerCard
              icon={<UserCheck size={32} className="text-white" />}
              title={localPlayer?.displayName ?? "Agent_Zero"}
              subtitle={statusMessage}
              statusLabel="Connected"
              connected
              accent="green"
            />

            <div className="flex flex-col items-center justify-center px-4">
              <div className="relative rounded-full border border-white/10 bg-black p-4 shadow-2xl">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                <Swords size={24} className="relative z-10 text-white/55" />
              </div>
            </div>

            <PlayerCard
              icon={<Radar size={32} className="animate-spin-slow text-red-400" />}
              title={opponent?.displayName ?? "..."}
              subtitle={opponent ? "Live opponent linked" : "SCANNING_FREQUENCIES..."}
              statusLabel={opponent ? "Connected" : "Awaiting Signal"}
              connected={Boolean(opponent?.connected)}
              accent="red"
              dimmed={!opponent}
              scanning={!opponent}
            />
          </div>

          <div className="mt-6 text-[10px] font-mono uppercase tracking-[0.24em] text-red-300">
            {statusMessage}
          </div>

          <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Disconnect
            </button>
            <button
              type="button"
              onClick={onStartRound}
              disabled={!canStart || isBusy}
              className={`flex-1 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.2em] transition ${canStart && !isBusy ? "bg-red-600 text-white hover:bg-red-500" : "cursor-not-allowed border border-white/10 bg-white/5 text-white/35"}`}
            >
              {canStart ? (isBusy ? "Starting..." : "Start Hide Phase") : opponent ? "Host Starts Match" : "Awaiting Rival"}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-2 rounded border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/25">
        <ShieldAlert size={12} className="text-yellow-400" />
        Visibility: Local Room Sync
      </div>
    </div>
  );
};

function PlayerCard({ icon, title, subtitle, statusLabel, connected = false, accent, dimmed = false, scanning = false }) {
  const accentClass = accent === "green"
    ? "border-green-500/35 bg-emerald-950/18"
    : "border-red-500/25 bg-red-950/22";
  const barClass = accent === "green"
    ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
    : "bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.6)]";

  return (
    <div className={`relative flex items-center gap-6 overflow-hidden rounded-2xl border p-6 ${accentClass} ${dimmed ? "opacity-75" : ""}`}>
      {scanning ? <div className="absolute left-0 top-0 h-1 w-full bg-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-[scan_2s_linear_infinite]" /> : null}
      <div className={`absolute left-0 top-0 h-full w-1 ${barClass}`} />
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-black/45">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="mb-1 flex items-center gap-2">
          {scanning ? <Wifi size={12} className="animate-pulse text-red-400" /> : <Wifi size={12} className={connected ? "text-green-400" : "animate-pulse text-red-400"} />}
          <span className={`text-[10px] font-mono uppercase tracking-widest ${scanning ? "animate-pulse text-red-400" : connected ? "text-green-400" : "animate-pulse text-red-400"}`}>
            {statusLabel}
          </span>
        </div>
        <h3 className={`text-2xl font-black uppercase tracking-tight ${dimmed ? "italic text-white/40" : "text-white"}`}>
          {title}
        </h3>
        <span className="mt-1 text-[10px] font-mono text-white/35">
          {subtitle}
        </span>
      </div>

      {scanning ? (
        <style>{`
          @keyframes scan {
            0% { transform: translateY(0); opacity: 1; }
            50% { opacity: 0.5; }
            100% { transform: translateY(100px); opacity: 0; }
          }
        `}</style>
      ) : null}
    </div>
  );
}

export default HostLobbyScreen;
