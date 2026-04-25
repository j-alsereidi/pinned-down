import React, { useEffect, useRef } from "react";
import {
  ChevronLeft,
  Lock,
  Radio,
  ShieldAlert,
  Scan,
  Key,
  Wifi,
  Cpu,
  LoaderCircle,
} from "lucide-react";
import { TechGlobeBackdrop } from "./src/components/TechGlobeBackdrop.jsx";

const globeScale = 1.04;
const globeOpacity = 0.17;
const globeYOffset = 12;

export const JoinOperationScreen = ({
  codeInput,
  onBack,
  onCodeChange,
  onConnect,
  errorMessage,
  isBusy,
}) => {
  const inputRef = useRef(null);
  const codeSlots = Array.from({ length: 4 }, (_, index) => codeInput[index] ?? "");
  const progress = Math.min(codeInput.length * 25, 100);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const refocusInput = () => {
    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(codeInput.length, codeInput.length);
    }, 0);
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050507] font-sans text-slate-50 selection:bg-red-500/30"
      onPointerDownCapture={(event) => {
        if (!event.target.closest("[data-join-focus-exempt='true']")) {
          refocusInput();
        }
      }}
    >
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
            data-join-focus-exempt="true"
            onClick={onBack}
            className="group rounded-lg border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
              Deployment Setup
            </div>
            <h1 className="text-xl font-black uppercase italic tracking-tight">
              Join Operation
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Network Status
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Wifi size={14} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-green-500">
              Ready to Connect
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-12">
          <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-red-600/20 blur-[80px]" />

          <div className="mb-10 flex flex-col items-center text-center">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-600/10 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
              <Key size={32} className="absolute text-red-500" />
              <Scan size={48} className="absolute animate-[spin_10s_linear_infinite] text-red-500/30" />
            </div>
            <h2 className="mb-2 text-3xl font-black uppercase italic tracking-tight md:text-4xl">
              Input Code
            </h2>
          </div>

          <div className="mb-12 flex justify-center gap-3 md:gap-6">
            {codeSlots.map((char, index) => {
              const isFilled = Boolean(char);
              const isActive = index === codeInput.length && codeInput.length < 4;

              return (
                <div
                  key={index}
                  className={`relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-xl border-2 shadow-[0_0_25px_rgba(220,38,38,0.2)] md:h-28 md:w-24 ${
                    isFilled ? "border-red-500 bg-red-600/10" : "border-white/20 bg-white/5"
                  } ${isActive ? "scale-105 border-white" : ""}`}
                >
                  <div className={`absolute inset-0 ${isFilled ? "bg-gradient-to-b from-red-500/20 to-transparent opacity-40" : "bg-white/5"}`} />
                  {isFilled ? (
                    <span className="relative z-10 font-mono text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] md:text-6xl">
                      {char}
                    </span>
                  ) : (
                    <div className={`relative z-10 h-1.5 w-6 bg-white md:w-10 ${isActive ? "animate-pulse" : "opacity-20"}`} />
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
              ref={inputRef}
              value={codeInput}
              data-join-focus-exempt="true"
              onBlur={(event) => {
                if (!event.relatedTarget?.closest?.("[data-join-focus-exempt='true']")) {
                  refocusInput();
                }
              }}
              onChange={(event) => onCodeChange(event.target.value)}
              maxLength={4}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-center text-lg font-black uppercase tracking-[0.5em] text-white outline-none transition focus:border-red-500/50 focus:bg-black"
            />
            {errorMessage && (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-950/30 px-3 py-2 text-center text-xs text-red-300">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="mx-auto mb-10 w-full max-w-md">
            <div className="mb-2 flex items-end justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/50">
                <Cpu size={12} className="text-red-400" />
                Decryption Progress
              </div>
              <span className="font-mono text-xs font-bold text-red-500">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 text-center text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">
              Validating Signatures [{codeInput.length}/4]
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              data-join-focus-exempt="true"
              onClick={onConnect}
              disabled={codeInput.length !== 4 || isBusy}
              className={`group relative flex w-full max-w-sm items-center justify-center gap-3 overflow-hidden rounded-xl px-8 py-4 font-black ${
                codeInput.length === 4 && !isBusy
                  ? "bg-red-600 text-white transition hover:bg-red-500"
                  : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" />
              {isBusy ? <LoaderCircle size={18} className="animate-spin" /> : <Lock size={18} className={codeInput.length === 4 ? "text-white" : "text-white/30"} />}
              <span className="text-lg font-mono uppercase italic tracking-widest">
                {isBusy ? "Connecting" : "Connect"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-3">
        <Radio size={16} className="text-white/30" />
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
            Local Port
          </span>
          <span className="text-xs font-mono font-bold text-white/50">8787</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-2 rounded border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/20">
        <ShieldAlert size={12} className="text-red-500" />
        Secure Protocol V2
      </div>
    </div>
  );
};

export default JoinOperationScreen;
