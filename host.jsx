import React from "react";
import {
  Copy,
  Radar,
  Radio,
  ShieldAlert,
  Swords,
  UserCheck,
  Wifi,
  X,
  Zap,
} from "lucide-react";

export const HostLobbyScreen = ({
  copied,
  lobbyCode,
  localPlayer,
  opponent,
  currentRound,
  statusMessage,
  roundNumber,
  localRole,
  localReady,
  opponentReady,
  canReady,
  isBusy,
  onBack,
  onCopyCode,
  onReady,
}) => {
  const opponentRole = opponent ? getAssignedRole(currentRound, opponent.id) : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050507] font-sans text-slate-50 selection:bg-red-500/30">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-black">
        <img
          src="/assets/world-map.svg"
          alt="World Map"
          className="absolute inset-0 h-full w-full translate-y-8 scale-125 object-cover opacity-[0.09] contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      <div className="relative z-10 flex w-full items-start justify-between p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="group rounded-lg border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-red-900/40 hover:text-red-400"
          >
            <X size={20} className="transition-transform group-hover:rotate-90" />
          </button>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Deployment Setup
            </div>
            <h1 className="text-xl font-black uppercase italic tracking-tight">
              Mission Lobby
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/45">
            Round Status
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Radio size={14} className="animate-pulse text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-green-400">
              Round {roundNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="relative flex w-full max-w-4xl flex-col items-center">
          <div className="relative mb-16 flex flex-col items-center">
            <div className="pointer-events-none absolute -inset-20 rounded-full bg-red-600/10 blur-[80px]" />

            <div className="mb-6 flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-4 py-1.5 backdrop-blur-md">
              <Zap size={12} className="text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-300">
                Secure Link Established
              </span>
              <Zap size={12} className="text-red-400" />
            </div>

            <h2 className="mb-4 text-[10px] font-mono uppercase tracking-widest text-white/55">
              Share this room code with your rival
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                {lobbyCode.split("").map((char, index) => (
                  <div
                    key={index}
                    className="relative flex h-28 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-red-500/50 bg-black/60 shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50" />
                    <span className="relative z-10 font-mono text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onCopyCode}
                className="group flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                <Copy size={24} className="text-white/60 group-hover:text-white" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/55">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-10 shadow-2xl backdrop-blur-2xl">
            <div className="absolute left-1/2 top-0 h-1 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            <PlayerCard
              accent="green"
              icon={<UserCheck size={32} className="text-white" />}
              title={localPlayer?.displayName}
              subtitle={`YOU // ${getRoleLabel(localRole)}`}
              onlineLabel="Linked Agent"
              ready={localReady}
            />

            <div className="flex flex-col items-center justify-center px-4">
              <div className="relative rounded-full border border-white/10 bg-black p-4 shadow-2xl">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                <Swords size={24} className="relative z-10 text-white/55" />
              </div>
            </div>

            <PlayerCard
              accent="red"
              icon={<Radar size={32} className="animate-spin-slow text-red-400" />}
              title={opponent?.displayName ?? "..."}
              subtitle={opponent ? `REMOTE // ${getRoleLabel(opponentRole)}` : "SCANNING_FREQUENCIES..."}
              onlineLabel={opponent ? (opponent.connected ? "Opponent Linked" : "Reconnect Pending") : "Awaiting Signal"}
              ready={opponentReady}
              connected={Boolean(opponent?.connected)}
              dimmed={!opponent}
            />
          </div>

          <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-3 rounded-[1.5rem] border border-white/10 bg-[#0b1118]/78 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2">
            <ReadyBadge
              label={`${localPlayer?.displayName ?? "You"} status`}
              role={getRoleLabel(localRole)}
              ready={localReady}
            />
            <ReadyBadge
              label={`${opponent?.displayName ?? "Opponent"} status`}
              role={getRoleLabel(opponentRole)}
              ready={opponentReady}
              pending={!opponent}
            />
          </div>

          <div className="mt-8 flex w-full max-w-2xl flex-col items-center">
            <div className="flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-white/40 opacity-90">
              <span>{statusMessage}</span>
              <span>
                Current assignment: {localRole === "hider" ? "you secure coordinates" : "you intercept the signal"}
              </span>
              {!opponent && <span className="text-red-300">[NETWORK] Listening for incoming connection...</span>}
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Disconnect
              </button>
              <button
                type="button"
                onClick={onReady}
                disabled={!canReady || isBusy}
                className={`flex-1 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.2em] transition ${canReady && !isBusy ? "bg-red-600 text-white hover:bg-red-500" : "cursor-not-allowed border border-white/10 bg-white/5 text-white/35"}`}
              >
                {localReady ? "Ready Locked" : canReady ? (isBusy ? "Syncing..." : "Ready Up") : opponent ? "Waiting On Rival" : "Awaiting Rival"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-2 rounded border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/25">
        <ShieldAlert size={12} className="text-yellow-400" />
        Visibility: Local Room Sync
      </div>
    </div>
  );
};

function PlayerCard({ accent, icon, title, subtitle, onlineLabel, ready, connected = true, dimmed = false }) {
  const accentClass = accent === "green"
    ? "border-green-500/35 bg-emerald-950/18"
    : "border-red-500/25 bg-red-950/22";
  const barClass = accent === "green"
    ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
    : "bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.6)]";

  return (
    <div className={`relative flex items-center gap-6 overflow-hidden rounded-2xl border p-6 ${accentClass} ${dimmed ? "opacity-75" : ""}`}>
      <div className={`absolute left-0 top-0 h-full w-1 ${barClass}`} />
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-black/45">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="mb-1 flex items-center gap-2">
          <Wifi size={12} className={connected ? "text-green-400" : "animate-pulse text-red-400"} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${connected ? "text-green-400" : "animate-pulse text-red-400"}`}>
            {onlineLabel}
          </span>
        </div>
        <h3 className={`text-2xl font-black uppercase tracking-tight ${dimmed ? "text-white/40 italic" : "text-white"}`}>
          {title}
        </h3>
        <span className="mt-1 text-[10px] font-mono text-white/35">
          {subtitle}
        </span>
        <span className={`mt-2 inline-flex w-fit rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${ready ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/55"}`}>
          {ready ? "Ready" : "Waiting"}
        </span>
      </div>
    </div>
  );
}

function ReadyBadge({ label, role, ready, pending = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45">{label}</div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/82">
          {pending ? "Awaiting Join" : role}
        </span>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${ready ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-white/12 bg-white/6 text-white/58"}`}>
          {ready ? "Ready" : "Waiting"}
        </span>
      </div>
    </div>
  );
}

function getAssignedRole(currentRound, playerId) {
  if (!playerId) {
    return null;
  }

  if (currentRound?.hiderId === playerId) {
    return "hider";
  }

  if (currentRound?.seekerId === playerId) {
    return "seeker";
  }

  return null;
}

function getRoleLabel(role) {
  return role ? role.toUpperCase() : "UNKNOWN";
}

export default HostLobbyScreen;

