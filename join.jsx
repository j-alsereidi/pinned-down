import React from "react";
import {
  ChevronLeft,
  Lock,
  Radio,
  ShieldAlert,
  Scan,
  Key,
  Wifi,
  Cpu,
} from "lucide-react";

export const JoinOperationScreen = ({
  codeInput,
  lobbyCode,
  onBack,
  onCodeChange,
  onConnect,
}) => {
  const codeSlots = Array.from({ length: 4 }, (_, index) => codeInput[index] ?? "");
  const progress = Math.min(codeInput.length * 25, 100);

  return (
    <div className="min-h-screen w-full bg-[#050507] text-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center pointer-events-none">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.05] invert grayscale contrast-150 scale-125"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />

        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent_0px,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      <div className="relative z-10 w-full p-6 flex items-start justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-black/40 border border-white/10 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-md group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase">
              Deployment Setup
            </div>
            <h1 className="text-xl font-black italic tracking-tight uppercase">
              Join Operation
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Network Status
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Wifi size={14} className="text-green-500" />
            <span className="text-[10px] text-green-500 font-bold tracking-wide uppercase">
              Connection Stable
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-1000 delay-100">
        <div className="w-full max-w-3xl bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] relative">
              <Key size={32} className="text-red-500 absolute" />
              <Scan size={48} className="text-red-500/30 absolute animate-[spin_10s_linear_infinite]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-2">
              Input Code
            </h2>
            <p className="text-sm text-white/50 font-mono tracking-widest uppercase">
              Ask host for a 4-digit lobby code
            </p>
          </div>

          <div className="flex justify-center gap-3 md:gap-6 mb-12">
            {codeSlots.map((char, index) => {
              const isFilled = Boolean(char);
              const isActive = index === codeInput.length && codeInput.length < 4;

              return (
                <div
                  key={index}
                  className={`relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-xl border-2 shadow-[0_0_25px_rgba(220,38,38,0.2)] md:h-28 md:w-24 ${
                    isFilled
                      ? "bg-red-600/10 border-red-500"
                      : "bg-white/5 border-white/20"
                  } ${isActive ? "scale-105 border-white" : ""}`}
                >
                  <div
                    className={`absolute inset-0 ${
                      isFilled
                        ? "bg-gradient-to-b from-red-500/20 to-transparent opacity-40"
                        : "bg-white/5"
                    }`}
                  />
                  {isFilled ? (
                    <span className="relative z-10 text-4xl font-black font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] md:text-6xl">
                      {char}
                    </span>
                  ) : (
                    <div
                      className={`relative z-10 h-1.5 w-6 bg-white ${
                        isActive ? "animate-pulse" : "opacity-20"
                      } md:w-10`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mx-auto mb-8 w-full max-w-md">
            <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              Cipher Terminal
            </label>
            <input
              value={codeInput}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder={lobbyCode}
              maxLength={4}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-center text-lg font-black uppercase tracking-[0.5em] text-white outline-none transition focus:border-red-500/50 focus:bg-black"
            />
            <div className="mt-3 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
              Demo lobby code: {lobbyCode}
            </div>
          </div>

          <div className="w-full max-w-md mx-auto mb-10">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                <Cpu size={12} className="text-red-400" />
                Decryption Progress
              </div>
              <span className="text-xs font-bold text-red-500 font-mono">{progress}%</span>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center mt-3 text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase animate-pulse">
              Validating Signatures [{codeInput.length}/4]
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onConnect}
              disabled={codeInput.length !== 4}
              className={`group relative flex w-full max-w-sm items-center justify-center gap-3 overflow-hidden rounded-xl py-4 px-8 font-black ${
                codeInput.length === 4
                  ? "bg-red-600 text-white transition hover:bg-red-500"
                  : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
              }`}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />

              <Lock size={18} className={codeInput.length === 4 ? "text-white" : "text-white/30"} />
              <span className="text-lg tracking-widest uppercase italic font-mono">
                Connect
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-3 animate-in fade-in duration-1000 delay-500">
        <Radio size={16} className="text-white/30" />
        <div className="flex flex-col">
          <span className="text-[9px] text-white/30 font-mono uppercase tracking-widest">
            Local Port
          </span>
          <span className="text-xs text-white/50 font-mono font-bold">8492-AX</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-2 text-[10px] text-white/20 font-mono uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded border border-white/5 animate-in fade-in duration-1000 delay-500">
        <ShieldAlert size={12} className="text-red-500" />
        Secure Protocol V2
      </div>
    </div>
  );
};

export default JoinOperationScreen;
