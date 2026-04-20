import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

function defaultGetOptionKey(option) {
  return option.code ?? option.id ?? option.name;
}

function defaultGetOptionLabel(option) {
  return option.name ?? option.primaryText ?? option.label ?? "";
}

function defaultGetOptionDescription(option) {
  return option.secondaryText ?? option.description ?? option.code ?? "";
}

export function CountryCombobox({
  label,
  query,
  selectedOption,
  options,
  placeholder,
  emptyText,
  disabled = false,
  autoFocus = false,
  inputRef = null,
  onQueryChange,
  onSelect,
  getOptionKey = defaultGetOptionKey,
  getOptionLabel = defaultGetOptionLabel,
  getOptionDescription = defaultGetOptionDescription,
  selectionLabel = null,
}) {
  const containerRef = useRef(null);
  const internalInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const resolvedInputRef = inputRef ?? internalInputRef;
  const isOpen = isFocused && query.trim().length > 0;
  const describedSelection = useMemo(() => {
    if (!selectedOption) {
      return "";
    }

    return selectionLabel ?? getOptionLabel(selectedOption);
  }, [getOptionLabel, selectedOption, selectionLabel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setHighlightedIndex((currentIndex) => {
      if (currentIndex < options.length) {
        return currentIndex;
      }

      return Math.max(0, options.length - 1);
    });
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    resolvedInputRef.current?.focus();
  }, [autoFocus, disabled, resolvedInputRef]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsFocused(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleKeyDown = (event) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp") && options.length > 0) {
      event.preventDefault();
      setIsFocused(true);
      setHighlightedIndex(0);
      return;
    }

    if (!isOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((currentIndex) => Math.min(currentIndex + 1, options.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const highlightedOption = options[highlightedIndex];
      if (!highlightedOption) {
        return;
      }

      event.preventDefault();
      onSelect(highlightedOption);
      setIsFocused(false);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-30 pointer-events-auto">
      <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
        {label}
      </label>
      <div className={`group flex items-center rounded-xl border px-4 py-3 transition ${isOpen ? "border-red-500/55 bg-[#0a0f16]/92 shadow-[0_0_0_1px_rgba(239,68,68,0.15)]" : "border-white/10 bg-black/60 hover:border-white/20"}`}>
        <Search size={16} className="mr-3 text-white/35" />
        <input
          ref={resolvedInputRef}
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onChange={(event) => onQueryChange(event.target.value)}
          className="flex-1 bg-transparent text-sm font-semibold tracking-wide text-white outline-none placeholder:text-white/25"
        />
        <ChevronRight size={16} className={`text-white/25 transition-transform ${isOpen ? "rotate-90 text-red-300" : selectedOption ? "rotate-90 text-red-400" : ""}`} />
      </div>

      {selectedOption && query.trim().length === 0 && (
        <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.22em] text-red-300">
          Armed: {describedSelection}
        </div>
      )}

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[80] max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#090b10] p-2 shadow-2xl backdrop-blur-xl"
          onWheel={(event) => event.stopPropagation()}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-white/40">{emptyText}</div>
          ) : (
            options.map((option, index) => {
              const optionKey = getOptionKey(option);
              const optionLabel = getOptionLabel(option);
              const optionDescription = getOptionDescription(option);
              const isSelected = selectedOption ? getOptionKey(selectedOption) === optionKey : false;
              const isHighlighted = highlightedIndex === index;

              return (
                <button
                  key={optionKey}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => {
                    onSelect(option);
                    setIsFocused(false);
                  }}
                  className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left transition ${isHighlighted ? "bg-red-600/18 text-white" : isSelected ? "bg-red-600/12 text-white/90" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold tracking-wide">{optionLabel}</div>
                    {optionDescription && (
                      <div className="mt-1 text-xs text-white/45">{optionDescription}</div>
                    )}
                  </div>
                  {typeof option.code === "string" && option.code ? (
                    <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.25em] text-white/35">
                      {option.code}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CountryCombobox;
