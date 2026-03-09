import React from "react";
import {
  Radio,
  ShieldAlert,
  Wifi,
  Copy,
  UserCheck,
  Radar,
  X,
  Activity,
  Zap,
  Swords,
} from "lucide-react";

export const HostLobbyScreen = ({
  copied,
  lobbyCode,
  onBack,
  onCopyCode,
  onGoHide,
  onGoJoin,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050507] text-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center pointer-events-none">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.05] invert grayscale contrast-150 scale-125 translate-y-8"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-red-500/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-red-600/20 rounded-full animate-ping shadow-[0_0_50px_rgba(220,38,38,0.2)]"
          style={{ animationDuration: "3s" }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent_0px,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      <div className="relative z-10 w-full p-6 flex items-start justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-black/40 border border-white/10 rounded-lg hover:bg-red-900/40 hover:text-red-400 transition-colors backdrop-blur-md group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
          <div>
            <div className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase">
              Deployment Setup
            </div>
            <h1 className="text-xl font-black italic tracking-tight uppercase">
              Host Operation
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Network Status
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Radio size={14} className="text-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500 font-bold tracking-wide uppercase">
              Connection Stable
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-1000 delay-100">
        <div className="w-full max-w-4xl flex flex-col items-center relative">
          <div className="flex flex-col items-center mb-16 relative">
            <div className="absolute -inset-20 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-2 px-4 py-1.5 bg-red-950/40 border border-red-500/30 rounded-full mb-6 backdrop-blur-md">
              <Zap size={12} className="text-red-500" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-400">
                Secure Link Established
              </span>
              <Zap size={12} className="text-red-500" />
            </div>

            <h2 className="text-[10px] font-mono text-white/50 tracking-widest uppercase mb-4">
              Provide this cipher to your rival
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                {lobbyCode.split("").map((char, index) => (
                  <div
                    key={index}
                    className="w-20 h-28 bg-black/60 backdrop-blur-xl border-2 border-red-500/50 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-7xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] relative z-10">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onCopyCode}
                className="h-28 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group"
              >
                <Copy size={24} className="text-white/50 group-hover:text-white" />
                <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="w-full grid grid-cols-[1fr_auto_1fr] gap-8 items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />

              <div className="w-16 h-16 bg-black/50 border border-white/20 rounded-xl flex items-center justify-center shrink-0">
                <UserCheck size={32} className="text-white" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-green-500" />
                  <span className="text-[10px] font-mono text-green-500 tracking-widest uppercase">
                    System Ready
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Agent_Zero
                </h3>
                <span className="text-[10px] text-white/30 font-mono mt-1">
                  HOST // LOCAL_NODE
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <div className="bg-black border border-white/10 p-4 rounded-full shadow-2xl relative">
                <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping" />
                <Swords size={24} className="text-white/50 relative z-10" />
              </div>
            </div>

            <div className="flex items-center gap-6 bg-red-950/20 border border-red-500/20 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-[scan_2s_linear_infinite]" />

              <div className="w-16 h-16 bg-black/50 border border-red-500/30 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                <Radar size={32} className="text-red-500 animate-spin-slow" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi size={12} className="text-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-red-500 tracking-widest uppercase animate-pulse">
                    Awaiting Signal
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white/30 italic">
                  ...
                </h3>
                <span className="text-[10px] text-white/20 font-mono mt-1">
                  SCANNING_FREQUENCIES...
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl mt-8 flex flex-col items-center">
            <div className="text-[10px] font-mono text-white/30 tracking-widest flex flex-col items-center gap-1 opacity-60">
              <span>[SYSTEM] Initializing secure P2P handshake protocol... OK</span>
              <span>[SYSTEM] Generating local terrain coordinates... OK</span>
              <span className="text-red-400 animate-pulse">
                [NETWORK] Listening for incoming connection on port 8492-AX...
              </span>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGoJoin}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Preview Join Screen
              </button>
              <button
                type="button"
                onClick={onGoHide}
                className="flex-1 rounded-2xl bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
              >
                Stage Hide Flow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-2 text-[10px] text-white/20 font-mono uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded border border-white/5 animate-in fade-in duration-1000 delay-500">
        <ShieldAlert size={12} className="text-yellow-500" />
        Visibility: Open to Local Network
      </div>

      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-[10px] font-mono text-white/20 leading-none mb-1">
          LOBBY_UPTIME
        </div>
        <div className="text-sm font-black font-mono text-white/40 leading-none animate-pulse">
          00:01:42
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HostLobbyScreen;
