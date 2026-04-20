import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

export function CountryCombobox({
  label,
  query,
  selectedOption,
  options,
  placeholder,
  emptyText,
  disabled = false,
  onQueryChange,
  onSelect,
}) {
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const isOpen = isFocused && query.trim().length > 0;

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsFocused(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
        {label}
      </label>
      <div className="group flex items-center rounded-xl border border-white/10 bg-black/60 px-4 py-3 transition focus-within:border-red-500/50 hover:border-white/20">
        <Search size={16} className="mr-3 text-white/35" />
        <input
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => onQueryChange(event.target.value)}
          className="flex-1 bg-transparent text-sm font-semibold tracking-wide text-white outline-none placeholder:text-white/25"
        />
        <ChevronRight size={16} className={`text-white/20 transition-transform ${selectedOption ? "rotate-90 text-red-400" : ""}`} />
      </div>

      {selectedOption && query.trim().length === 0 && (
        <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.22em] text-red-300">
          Armed: {selectedOption.name}
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#090b10] p-2 shadow-2xl backdrop-blur-xl">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-white/40">{emptyText}</div>
          ) : (
            options.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setIsFocused(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${selectedOption?.code === option.code ? "bg-red-600/20 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="font-semibold tracking-wide">{option.name}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/35">
                  {option.code}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CountryCombobox;
