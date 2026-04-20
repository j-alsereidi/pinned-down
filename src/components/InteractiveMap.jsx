import { useEffect, useRef, useState } from "react";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function InteractiveMap({
  markers,
  selectedMarkerId,
  onSelectMarker,
  focusViewport,
  sensitivity = 1,
  readOnly = false,
}) {
  const containerRef = useRef(null);
  const [view, setView] = useState({ scale: 1.15, offsetX: 0, offsetY: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    if (!focusViewport || !containerRef.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const scale = clamp(focusViewport.scale ?? 1.6, 1, 3.4);
    const targetX = bounds.width / 2 - ((focusViewport.x / 100) * bounds.width * scale);
    const targetY = bounds.height / 2 - ((focusViewport.y / 100) * bounds.height * scale);
    setView({ scale, offsetX: targetX, offsetY: targetY });
  }, [focusViewport?.x, focusViewport?.y, focusViewport?.scale]);

  const updateScale = (delta) => {
    setView((current) => ({
      ...current,
      scale: clamp(current.scale + delta * sensitivity, 1, 3.6),
    }));
  };

  const handleWheel = (event) => {
    event.preventDefault();
    updateScale(event.deltaY > 0 ? -0.12 : 0.12);
  };

  const handlePointerDown = (event) => {
    if (readOnly) {
      return;
    }

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: view.offsetX,
      originY: view.offsetY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || readOnly) {
      return;
    }

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setView((current) => ({
      ...current,
      offsetX: dragRef.current.originX + dx,
      offsetY: dragRef.current.originY + dy,
    }));
  };

  const handlePointerUp = (event) => {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div className="relative h-[22rem] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]">
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={() => updateScale(0.14)}
          className="rounded-full border border-white/10 bg-black/70 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={() => updateScale(-0.14)}
          className="rounded-full border border-white/10 bg-black/70 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-300"
          style={{ transform: `translate(${view.offsetX}px, ${view.offsetY}px) scale(${view.scale})` }}
        >
          <img
            src="/assets/world-map.svg"
            alt="Pinned Down world map"
            className="pointer-events-none h-full w-full select-none object-cover opacity-85"
            draggable={false}
          />

          {markers.map((marker) => {
            const selected = marker.id === selectedMarkerId;

            return (
              <button
                key={marker.id}
                type="button"
                disabled={readOnly && !selected}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectMarker?.(marker.id);
                }}
                className="absolute -translate-x-1/2 -translate-y-full text-left"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <div className={`relative flex flex-col items-center ${selected ? "scale-110" : "opacity-80 hover:opacity-100"}`}>
                  <div className={`absolute bottom-0 h-3 w-8 rounded-full blur-md ${selected ? "bg-red-500/70" : "bg-white/20"}`} />
                  <MapPin
                    size={selected ? 34 : 28}
                    className={selected ? "text-red-500 drop-shadow-[0_0_18px_rgba(220,38,38,0.9)]" : "text-white/70"}
                    fill="currentColor"
                  />
                  <div className={`mt-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${selected ? "border-red-500/40 bg-black/90 text-red-300" : "border-white/10 bg-black/70 text-white/50"}`}>
                    {marker.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InteractiveMap;
