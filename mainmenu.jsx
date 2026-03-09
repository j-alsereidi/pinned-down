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

export const MainMenuScreen = ({ activeLobbyCode, onHost, onJoin }) => {
  return (
    <div className="min-h-screen w-full bg-[#050507] text-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />

        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] scale-110 translate-y-10"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            fill="white"
            d="M150,150 L160,140 L180,145 L200,130 L220,140 L250,140 L270,160 L280,190 L260,220 L230,230 L200,220 L180,240 L150,230 Z M400,100 L450,90 L500,100 L550,120 L580,160 L570,200 L530,240 L480,250 L430,230 L400,180 Z M700,200 L750,180 L800,190 L850,220 L860,270 L830,320 L780,330 L730,310 L700,260 Z"
            className="animate-pulse"
          />
          {[...Array(30)].map((_, index) => (
            <circle
              key={index}
              cx={(index * 31) % 1000}
              cy={(index * 47) % 500}
              r="1.5"
              fill="white"
              className="opacity-40"
            />
          ))}
        </svg>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-[2px] w-full animate-[scan_4s_linear_infinite]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse" />
          <div className="relative bg-black border-2 border-red-600/50 p-6 rounded-[2rem] shadow-[0_0_50px_-10px_rgba(220,38,38,0.5)] transform hover:scale-110 transition-transform duration-500 group">
            <MapPin
              size={72}
              strokeWidth={2.5}
              fill="#dc2626"
              className="text-white drop-shadow-2xl"
            />
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500" />
          </div>
        </div>

        <h1 className="text-8xl font-[900] tracking-tighter mb-2 italic flex items-center gap-4">
          <span className="text-white">PINNED</span>
          <span className="text-red-600 relative">
            DOWN!
            <span className="absolute -right-8 -top-2 text-xs font-mono text-red-500/50 tracking-widest">
              LIVE_OP
            </span>
          </span>
        </h1>

        <div className="flex items-center gap-4 px-4 py-1.5 bg-red-950/30 border border-red-500/20 rounded-full text-red-400 font-bold tracking-[0.3em] text-[10px] uppercase">
          <Zap size={12} fill="currentColor" />
          <span>Competitive Hide & Seek</span>
          <Zap size={12} fill="currentColor" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-5 w-full max-w-md px-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <button
          type="button"
          onClick={onHost}
          className="group relative w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 px-8 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-red-900/40"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center gap-5">
            <div className="bg-black/20 p-2.5 rounded-xl">
              <Swords size={24} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl leading-none uppercase tracking-tight">
                Initiate Duel
              </span>
              <span className="text-[10px] opacity-70 font-medium uppercase mt-1 tracking-wider">
                Host & Invite Others
              </span>
            </div>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={onJoin}
          className="group relative w-full bg-white/5 border-2 border-white/10 backdrop-blur-2xl text-white font-black py-6 px-8 rounded-2xl flex items-center justify-between overflow-hidden transition-all hover:bg-white/10 hover:border-red-500/50 hover:scale-[1.03] active:scale-95"
        >
          <div className="flex items-center gap-5">
            <div className="bg-red-600/10 p-2.5 rounded-xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Target size={24} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl leading-none uppercase tracking-tight">
                Join Game
              </span>
              <span className="text-[10px] opacity-50 font-medium uppercase mt-1 tracking-wider">
                Enter Game Code
              </span>
            </div>
          </div>
          <ChevronRight
            size={24}
            className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 px-12 flex justify-between items-center animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
              System Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] text-white/40 font-mono italic">
                ENCRYPTED_LINK_ACTIVE
              </span>
            </div>
            <div className="mt-2 text-[10px] text-white/30 font-mono">
              DEMO LOBBY // {activeLobbyCode}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all text-[10px] font-bold tracking-widest text-white/40 hover:text-white"
          >
            <Globe size={14} />
            RANKINGS
          </button>
          <button
            type="button"
            className="group p-3 bg-white/5 hover:bg-red-600 border border-white/5 rounded-xl transition-all duration-300 hover:rotate-90 shadow-lg"
          >
            <Settings size={20} className="text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="absolute top-10 left-10 flex gap-1 animate-pulse">
        <div className="w-1 h-4 bg-red-600" />
        <div className="w-1 h-4 bg-red-600/40" />
        <div className="w-1 h-4 bg-red-600/10" />
      </div>

      <div className="absolute top-10 right-10 text-right">
        <div className="text-[10px] font-mono text-white/20 leading-none">
          SECTOR_GRID
        </div>
        <div className="text-lg font-black text-white/40 leading-none">42-NX-09</div>
      </div>

      <style jsx>{`
        @keyframes scan {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenuScreen;
