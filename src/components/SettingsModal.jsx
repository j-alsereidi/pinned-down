import React from "react";
import { SlidersHorizontal, Volume2, VolumeX, MonitorCog } from "lucide-react";

export function SettingsModal({ open, draft, onChange, onClose, onSave }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#08090d] p-8 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              Settings
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              Operative Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-white/70">
            Display Name
            <input
              value={draft.displayName}
              onChange={(event) => onChange({ ...draft, displayName: event.target.value.slice(0, 24) })}
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-red-500/50"
            />
          </label>

          <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              <SlidersHorizontal size={16} className="text-red-400" />
              Accessibility + Input
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
              Reduced Motion
              <input
                type="checkbox"
                checked={draft.reducedMotion}
                onChange={(event) => onChange({ ...draft, reducedMotion: event.target.checked })}
                className="h-4 w-4 accent-red-500"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
              Sound Cues
              <button
                type="button"
                onClick={() => onChange({ ...draft, soundEnabled: !draft.soundEnabled })}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70"
              >
                {draft.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                {draft.soundEnabled ? "On" : "Off"}
              </button>
            </label>

            <label className="grid gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/75">
              <span className="flex items-center gap-2"><MonitorCog size={14} className="text-red-400" /> Pan / Zoom Sensitivity</span>
              <input
                type="range"
                min="0.6"
                max="1.8"
                step="0.1"
                value={draft.panZoomSensitivity}
                onChange={(event) => onChange({ ...draft, panZoomSensitivity: Number(event.target.value) })}
                className="accent-red-500"
              />
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/35">
                {draft.panZoomSensitivity.toFixed(1)}x
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
