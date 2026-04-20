export const ROOM_CODE_LENGTH = 4;
export const TURN_LIMIT = 4;
export const RECONNECT_TIMEOUT_MS = 30_000;

export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const PLAYER_ROLES = Object.freeze({
  HIDER: "hider",
  SEEKER: "seeker",
});

export const MATCH_PHASES = Object.freeze({
  LOBBY: "lobby",
  HIDE: "hide",
  SEEK: "seek",
  RESULTS: "results",
});

export const CONNECTION_STATES = Object.freeze({
  IDLE: "idle",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  OFFLINE: "offline",
});

export const MESSAGE_TYPES = Object.freeze({
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_UPDATE: "room:update",
  PLAYER_READY: "player:ready",
  HIDE_LOCK: "hide:lock",
  GUESS_SUBMIT: "guess:submit",
  TURN_RESULT: "turn:result",
  MATCH_COMPLETE: "match:complete",
  REMATCH_VOTE: "rematch:vote",
  PLAYER_DISCONNECT: "player:disconnect",
  PLAYER_LEAVE: "player:leave",
  ERROR: "error",
  PING: "ping",
  PONG: "pong",
});

export const SEEKER_TURN_SCORES = Object.freeze({
  1: 10_000,
  2: 7_500,
  3: 5_000,
  4: 2_500,
});

export const HIDER_SURVIVAL_POINTS = 1_500;
export const HIDER_UNFOUND_BONUS = 5_000;

export const DISTANCE_BANDS = Object.freeze([
  { id: "scorching", max: 750, label: "Scorching", tone: "text-red-400" },
  { id: "warm", max: 2_000, label: "Warm", tone: "text-orange-400" },
  { id: "cool", max: 5_000, label: "Cool", tone: "text-sky-400" },
  { id: "cold", max: Number.POSITIVE_INFINITY, label: "Cold", tone: "text-white/50" },
]);

export const DEFAULT_PROFILE = Object.freeze({
  displayName: "Agent Zero",
  soundEnabled: true,
  reducedMotion: false,
  panZoomSensitivity: 1,
});
