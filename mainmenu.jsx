import React from "react";
import {
  MapPin,
  Swords,
  Target,
  Settings,
  Globe,
  ChevronRight,
  Zap,
} from "lucide-react";

export const MainMenuScreen = ({
  activeLobbyCode,
  playerName,
  connectionState,
  onHost,
  onJoin,
  onOpenSettings,
  onOpenRankings,
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050507] font-sans text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/assets/world-map.svg"
          alt="Pinned Down world map"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18] contrast-125"
        />
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-red-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent" />
      </div>

      <div className="relative z-10 mb-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-600 opacity-30 blur-3xl" />
          <div className="relative rounded-[2rem] border-2 border-red-600/50 bg-black p-6 shadow-[0_0_50px_-10px_rgba(220,38,38,0.5)] transition-transform duration-500 hover:scale-110">
            <MapPin
              size={72}
              strokeWidth={2.5}
              fill="#dc2626"
              className="text-white drop-shadow-2xl"
            />
          </div>
        </div>

        <h1 className="mb-2 flex items-center gap-4 text-8xl font-[900] italic tracking-tighter">
          <span className="text-white">PINNED</span>
          <span className="relative text-red-600">
            DOWN!
            <span className="absolute -right-8 -top-2 text-xs font-mono tracking-widest text-red-500/50">
              LIVE_OP
            </span>
          </span>
        </h1>

        <div className="flex items-center gap-4 rounded-full border border-red-500/20 bg-red-950/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
          <Zap size={12} fill="currentColor" />
          <span>Competitive Hide & Seek</span>
          <Zap size={12} fill="currentColor" />
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-5 px-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <button
          type="button"
          onClick={onHost}
          className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-red-600 px-8 py-6 font-black text-white shadow-2xl shadow-red-900/40 transition-all hover:scale-[1.03] hover:bg-red-500 active:scale-95"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          <div className="flex items-center gap-5">
            <div className="rounded-xl bg-black/20 p-2.5">
              <Swords size={24} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl uppercase leading-none tracking-tight">Initiate Duel</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider opacity-70">
                Host & Invite Others
              </span>
            </div>
          </div>
          <ChevronRight size={24} className="transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={onJoin}
          className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 px-8 py-6 font-black text-white backdrop-blur-2xl transition-all hover:scale-[1.03] hover:border-red-500/50 hover:bg-white/10 active:scale-95"
        >
          <div className="flex items-center gap-5">
            <div className="rounded-xl bg-red-600/10 p-2.5 text-red-500 transition-colors group-hover:bg-red-600 group-hover:text-white">
              <Target size={24} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl uppercase leading-none tracking-tight">Join Game</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider opacity-50">
                Enter Game Code
              </span>
            </div>
          </div>
          <ChevronRight size={24} className="opacity-30 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </button>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 flex items-center justify-between px-12 animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
              System Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${connectionState === "connected" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-white/30"}`} />
              <span className="text-[10px] font-mono italic text-white/40">
                {connectionState === "connected" ? "ENCRYPTED_LINK_ACTIVE" : "SERVER_STANDBY"}
              </span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-white/30">
              AGENT // {playerName}
            </div>
            <div className="mt-1 text-[10px] font-mono text-white/30">
              LAST ROOM // {activeLobbyCode || "----"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenRankings}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-widest text-white/40 transition-all hover:bg-white/10 hover:text-white"
          >
            <Globe size={14} />
            RANKINGS
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="group rounded-xl border border-white/5 bg-white/5 p-3 shadow-lg transition-all duration-300 hover:rotate-90 hover:bg-red-600"
          >
            <Settings size={20} className="text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuScreen;
