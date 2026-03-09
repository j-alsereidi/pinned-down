import React from "react";
import {
  ChevronLeft,
  Crosshair,
  Lock,
  Unlock,
  AlertTriangle,
  Radio,
  ChevronRight,
  MapPin,
  Activity,
  ScanEye,
  Radar,
  Target,
} from "lucide-react";

export const SeekingScreen = ({
  guessOptions,
  selectedCountry,
  onBack,
  onContinue,
  onSelectCountry,
}) => {
  return (
    <div className="min-h-screen w-full bg-black text-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-[#020202]">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt="World Map"
          className="w-full h-full object-cover opacity-20 invert grayscale-[0.8] contrast-150 scale-125 translate-y-12"
        />
        <div className="absolute top-[40%] left-[65%] w-[800px] h-[800px] bg-red-600/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 w-full p-6 flex items-start justify-between">
        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-white/10 bg-black/40 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-2 h-2 bg-red-500 animate-pulse" />
            <div className="text-[10px] text-red-500 font-bold tracking-[0.3em] uppercase">
              Phase 02
            </div>
          </div>
          <h1 className="text-3xl font-black italic tracking-tight uppercase drop-shadow-lg">
            Hunt Rival
          </h1>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-6 flex flex-col items-center animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Radar size={16} className="text-red-500 animate-spin-slow" />
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
              Signal Intercept
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-2 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <div className="w-12 h-2 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <div className="w-12 h-2 bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            <div className="w-12 h-2 bg-white/10" />
          </div>
          <div className="mt-2 text-sm font-black tracking-widest uppercase text-white/80">
            Turn 03 <span className="text-white/30">//</span> 04
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right animate-in fade-in duration-1000">
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Current Score
          </div>
          <div className="text-2xl font-black tracking-wider text-white">
            4,250 <span className="text-sm text-red-500">PTS</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={14} className="text-green-500" />
            <span className="text-[10px] text-green-500 font-medium tracking-wide uppercase">
              Connection Stable
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full flex justify-between items-center px-8 z-10 pointer-events-none">
        <div className="w-[320px] flex flex-col gap-4 pointer-events-auto animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-white/80">
              <ScanEye size={18} className="text-red-500" />
              <h2 className="text-sm font-bold tracking-widest uppercase">
                Recon Data
              </h2>
            </div>
            <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded">
              AUTO-DECRYPT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop"
                alt="Hint 1"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[9px] font-mono px-1.5 py-0.5 rounded text-white/60 border border-white/10 flex items-center gap-1">
                <Unlock size={8} /> T-01
              </div>
            </div>

            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-lg overflow-hidden group">
              <img
                src="https://japanesegardens.jp/wp-content/uploads/2025/05/Shinjuku-Gyoen-Main-Logo.jpg"
                alt="Hint 2"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[9px] font-mono px-1.5 py-0.5 rounded text-white/60 border border-white/10 flex items-center gap-1">
                <Unlock size={8} /> T-02
              </div>
            </div>

            <div className="relative aspect-square bg-white/5 border border-red-500/50 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)] group">
              <div className="absolute inset-0 border-2 border-red-500 animate-pulse pointer-events-none z-10" />
              <img
                src="https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/03/a0003755/img/basic/a0003755_main.jpg"
                alt="Hint 3"
                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-[9px] font-mono px-1.5 py-0.5 rounded text-white font-bold flex items-center gap-1">
                <AlertTriangle size={8} /> NEW INTEL
              </div>
            </div>

            <div className="relative aspect-square bg-black/60 border border-white/5 rounded-lg overflow-hidden flex flex-col items-center justify-center gap-2">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                }}
              />
              <Lock size={20} className="text-white/20" />
              <div className="text-[9px] font-mono text-white/30 tracking-widest">
                LOCKED
              </div>
              <div className="absolute top-2 left-2 bg-black/80 text-[9px] font-mono px-1.5 py-0.5 rounded text-white/20 border border-white/5">
                T-04
              </div>
            </div>
          </div>

          <div className="text-[10px] text-white/40 leading-relaxed font-mono bg-white/5 p-3 rounded-lg border border-white/5">
            <span className="text-red-400 font-bold">SYSTEM NOTE:</span> Additional visual data
            will be decrypted if target is not neutralized this turn. Earlier
            strikes yield more points.
          </div>
        </div>

        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30 pointer-events-none scale-150">
          <div className="w-[400px] h-[400px] border border-red-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
          <Crosshair size={60} strokeWidth={1} className="absolute text-red-500" />
        </div>

        <div className="w-[360px] flex flex-col gap-6 pointer-events-auto animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
            <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-3 flex items-center gap-2">
              <Radio size={12} className="text-white/40" />
              Trajectory Analysis
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-bold text-white/30 bg-black px-1.5 py-0.5 rounded">
                    T1
                  </div>
                  <div className="text-xs font-medium text-white/60">China</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-blue-400">2,850 KM</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                    Cool
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-bold text-white/30 bg-black px-1.5 py-0.5 rounded">
                    T2
                  </div>
                  <div className="text-xs font-medium text-white/80">
                    South Korea
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-orange-500">950 KM</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    Warm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-2xl border-2 border-red-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

            <label className="text-[10px] font-mono text-red-400 tracking-widest uppercase mb-2 block">
              Set Coordinates (Country)
            </label>

            <div className="flex items-center justify-between bg-black border border-white/20 p-4 rounded-lg cursor-pointer hover:border-red-500 transition-colors group">
              <div className="flex items-center gap-3 flex-1">
                <MapPin size={18} className="text-red-500 shrink-0" />
                <select
                  value={selectedCountry}
                  onChange={(event) => onSelectCountry(event.target.value)}
                  className="w-full bg-transparent text-lg font-bold tracking-wide text-white outline-none"
                >
                  {guessOptions.map((country) => (
                    <option key={country} value={country} className="bg-black text-white">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-red-500 transition-colors" />
            </div>

            <div className="mt-2 text-right">
              <span className="text-[9px] text-white/30 font-mono italic">
                Turn 3 Multiplier: x0.60
              </span>
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="group relative w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-lg flex items-center justify-center overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10">
                <Target size={20} className="opacity-80 group-hover:opacity-100" />
                <span className="text-xl tracking-tighter uppercase italic">
                  Lock {selectedCountry}
                </span>
              </div>
            </button>

            <div className="mt-3 text-right text-[10px] font-mono uppercase tracking-[0.25em] text-white/30">
              Storyboard step only. Static intel stays in place for now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekingScreen;
