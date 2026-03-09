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
} from "lucide-react";

export const VictoryScreen = ({ onDisconnect, onRematch }) => {
  return (
    <div className="min-h-screen w-full bg-black text-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-[#020202] flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-[900] italic text-red-600/[0.03] whitespace-nowrap select-none pointer-events-none tracking-tighter drop-shadow-2xl">
          VICTORY
        </div>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover opacity-10 invert grayscale contrast-150 scale-110"
        />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent_0px,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            TARGET NEUTRALIZED!
          </h1>
        </div>

        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            <div className="flex flex-col items-center md:items-end text-right group">
              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2 flex items-center gap-2">
                <ShieldCheck size={12} className="text-green-500" /> Status: Active
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-1">
                Agent_Zero
              </h2>
              <div className="text-[10px] text-white/30 font-mono mb-6">
                ID: 8492-AX-LOCAL
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-red-200 relative z-10">
                  18,450 <span className="text-2xl text-red-500">PTS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 px-8">
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-red-500/50" />
              <div className="bg-red-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transform rotate-45">
                <Trophy size={32} className="text-white -rotate-45" fill="currentColor" />
              </div>
              <div className="w-px h-16 bg-gradient-to-t from-transparent to-red-500/50" />
            </div>

            <div className="flex flex-col items-center md:items-start text-left opacity-60 grayscale-[0.5] group hover:grayscale-0 transition-all">
              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2 flex items-center gap-2">
                <Skull size={12} className="text-red-500" /> Status: Eliminated
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white/80 mb-1">
                Rival_Ghost
              </h2>
              <div className="text-[10px] text-white/30 font-mono mb-6">
                ID: 9910-BX-REMOTE
              </div>

              <div className="text-6xl font-black tracking-tighter text-white/50">
                3,120 <span className="text-2xl text-white/30">PTS</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 w-full">
            <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6 flex items-center justify-center gap-2">
              <Zap size={14} /> Operation Telemetry <Zap size={14} />
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                <Crosshair size={16} className="text-red-500 mb-2" />
                <div className="text-xl font-black text-white">
                  950 <span className="text-xs text-white/50">KM</span>
                </div>
                <div className="text-[9px] font-mono text-white/30 uppercase mt-1">
                  Avg Distance
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                <MapPin size={16} className="text-red-500 mb-2" />
                <div className="text-xl font-black text-white">Japan</div>
                <div className="text-[9px] font-mono text-white/30 uppercase mt-1">
                  Target Sector
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                <Activity size={16} className="text-red-500 mb-2" />
                <div className="text-xl font-black text-white">Turn 3</div>
                <div className="text-[9px] font-mono text-white/30 uppercase mt-1">
                  Lethal Strike
                </div>
              </div>
              <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-center text-center">
                <Trophy size={16} className="text-red-500 mb-2" />
                <div className="text-xl font-black text-red-400">+15,330</div>
                <div className="text-[9px] font-mono text-red-500/60 uppercase mt-1">
                  Score Differential
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <button
            type="button"
            onClick={onRematch}
            className="group relative bg-red-600 hover:bg-red-500 text-white font-black py-5 px-10 rounded-2xl flex items-center gap-4 overflow-hidden transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xl tracking-tight uppercase italic">Rematch</span>
          </button>

          <button
            type="button"
            onClick={onDisconnect}
            className="group relative bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-5 px-10 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.05] active:scale-95 backdrop-blur-md"
          >
            <LogOut size={20} className="text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <span className="text-xl tracking-tight uppercase italic text-white/80 group-hover:text-white">
              Disconnect
            </span>
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-transparent to-red-600 opacity-20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
    </div>
  );
};

export default VictoryScreen;
