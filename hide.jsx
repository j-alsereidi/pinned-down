import React from "react";
import {
  MapPin,
  Search,
  Crosshair,
  ChevronLeft,
  Target,
  Image as ImageIcon,
  Fingerprint,
} from "lucide-react";

export const HidingScreen = ({
  options,
  searchValue,
  selectedLocation,
  onBack,
  onContinue,
  onSearchChange,
  onSelectLocation,
}) => {
  return (
    <div className="min-h-screen w-full bg-black text-slate-50 flex flex-col relative overflow-hidden font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="https://happywall-img-gallery.imgix.net/37055/tokyo_map_limited.jpg"
          alt="2D Street Map"
          className="w-full h-full object-cover opacity-40 invert grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative z-10 w-full p-6 flex items-start justify-between">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <button
              type="button"
              onClick={onBack}
              className="p-2 bg-black/40 border border-white/10 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase">
                Phase 01
              </div>
              <h1 className="text-xl font-black italic tracking-tight">
                SECURE LOCATION
              </h1>
            </div>
          </div>

          <div className="relative w-full animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="absolute -inset-1 bg-red-600/20 blur-md rounded-xl opacity-50" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search size={18} className="text-white/40 mr-3" />
                <input
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  className="flex-1 bg-transparent font-mono text-sm outline-none"
                  placeholder="Search country"
                />
                <div className="text-[10px] text-white/30 tracking-widest uppercase">
                  Target Country
                </div>
              </div>

              <div className="flex flex-col py-1">
                {options.slice(0, 4).map((option) => {
                  const isSelected = option.country === selectedLocation.country;

                  return (
                    <button
                      key={option.country}
                      type="button"
                      onClick={() => onSelectLocation(option.country)}
                      className={`flex items-center px-4 py-2 text-left transition ${
                        isSelected
                          ? "bg-red-600/20 border-l-2 border-red-500 text-white"
                          : "cursor-pointer text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <MapPin
                        size={14}
                        className={`${isSelected ? "text-red-400" : "text-white/20"} mr-3`}
                      />
                      <span className="flex-1 tracking-wide">{option.country}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          isSelected ? "text-red-400/80" : "text-white/20"
                        }`}
                      >
                        {isSelected ? "SELECTED" : option.distance}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-right animate-in fade-in duration-1000">
          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Coordinates Lock
          </div>
          <div className="text-sm font-black tracking-wider text-red-500">
            {selectedLocation.coordinates}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Crosshair size={14} className="text-white/50" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              {selectedLocation.type}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <Crosshair size={120} strokeWidth={0.5} className="text-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full" />
        </div>

        <div className="absolute top-[35%] left-[60%] flex flex-col items-center opacity-40">
          <MapPin size={24} className="text-red-500/50" fill="currentColor" />
          <div className="w-1.5 h-1.5 bg-black rounded-full absolute bottom-1" />
        </div>
        <div className="absolute top-[65%] left-[25%] flex flex-col items-center opacity-40">
          <MapPin size={24} className="text-red-500/50" fill="currentColor" />
          <div className="w-1.5 h-1.5 bg-black rounded-full absolute bottom-1" />
        </div>

        <div className="absolute top-[48%] left-[45%] flex items-center gap-4">
          <div className="relative flex flex-col items-center justify-end -mt-8 pointer-events-auto cursor-pointer group">
            <div className="absolute bottom-0 w-8 h-4 bg-red-600/40 rounded-full blur-sm animate-ping" />
            <div className="absolute bottom-0 w-4 h-2 bg-red-600/80 rounded-full blur-[2px]" />

            <MapPin
              size={48}
              strokeWidth={2}
              className="text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] relative z-10"
              fill="currentColor"
            />
            <div className="w-2.5 h-2.5 bg-black rounded-full absolute bottom-2 z-20" />
          </div>

          <div className="pointer-events-auto w-[280px] bg-black/80 backdrop-blur-2xl border border-red-500/30 rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 origin-left">
            <div className="relative h-32 w-full bg-slate-800">
              <img
                src="https://images.mnstatic.com/78/3c/783c339d80fa16877b2027bbb6d6fdc0.jpg"
                alt="Preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-1.5">
                <ImageIcon size={10} className="text-green-400" />
                <span className="text-[9px] font-mono text-green-400 font-bold uppercase tracking-wider">
                  4/4 Hints Found
                </span>
              </div>
            </div>

            <div className="p-4 relative">
              <h3 className="text-base font-bold leading-tight mb-1 uppercase tracking-tight">
                {selectedLocation.venue}
              </h3>
              <p className="text-xs text-white/50 mb-3 flex items-center gap-1 font-medium">
                <Target size={12} className="text-red-500" />
                {selectedLocation.subtitle}
              </p>

              <div className="flex gap-2 text-[10px] font-mono">
                <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                  <span className="block text-white/30 mb-0.5">TYPE</span>
                  <span className="text-white/80">{selectedLocation.type}</span>
                </div>
                <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                  <span className="block text-white/30 mb-0.5">EST. DIFF</span>
                  <span className="text-yellow-500">{selectedLocation.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto p-8 w-full flex flex-col items-center justify-end bg-gradient-to-t from-black via-black/80 to-transparent pb-12">
        <button
          type="button"
          onClick={onContinue}
          className="group relative w-full max-w-lg bg-red-600 hover:bg-red-500 text-white font-black py-5 px-8 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_-15px_rgba(220,38,38,0.6)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          <div className="flex items-center gap-3 relative z-10">
            <Fingerprint size={28} className="opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-3xl tracking-tighter uppercase italic drop-shadow-md">
              HIDE HERE
            </span>
          </div>
        </button>

        <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/35">
          Storyboard target locked: {selectedLocation.country}
        </div>
      </div>
    </div>
  );
};

export default HidingScreen;
