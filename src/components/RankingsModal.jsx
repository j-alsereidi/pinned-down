import React from "react";
import { Trophy, Clock3, Crosshair } from "lucide-react";

export function RankingsModal({ open, history, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#08090d] p-8 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              Rankings
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              Local Match History
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

        {history.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-white/45">
            No completed local matches yet. Finish a duel and it will show up here.
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr] gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                    {entry.outcome}
                  </div>
                  <div className="mt-1 text-lg font-black uppercase tracking-tight text-white">
                    {entry.localPlayerName} vs {entry.opponentName}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.25em] text-white/35">
                    {entry.role} | Room {entry.roomCode}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/65">
                  <Crosshair size={16} className="text-red-400" />
                  {entry.targetCountry} in {entry.totalTurnsUsed} turns
                </div>
                <div className="flex items-center gap-3 text-sm text-white/65">
                  <Clock3 size={16} className="text-white/35" />
                  {new Date(entry.recordedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-end gap-3 text-right">
                  <Trophy size={16} className={entry.won ? "text-red-400" : "text-white/25"} />
                  <div>
                    <div className="text-lg font-black text-white">{entry.score}</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/35">PTS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RankingsModal;
