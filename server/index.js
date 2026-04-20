import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { WebSocket, WebSocketServer } from "ws";
import { ERROR_CODES, createErrorPayload } from "../shared/contracts.js";
import { MATCH_PHASES, MESSAGE_TYPES, RECONNECT_TIMEOUT_MS } from "../shared/constants.js";
import {
  createPlayer,
  createRoomState,
  generateRoomCode,
  getPublicRoomState,
  joinRoomState,
  lockHiddenLocation,
  registerRematchVote,
  startRound,
  submitGuess,
} from "../shared/game-logic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const distRoot = path.join(workspaceRoot, "dist");
const port = Number(process.env.PORT ?? 8787);
const rooms = new Map();
const socketSessions = new Map();
const reconnectTimers = new Map();
const COUNTRIES_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,latlng,capital,region,subregion,flags";
let countriesCache = null;
let countriesPromise = null;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function normalizeCountry(country) {
  return {
    code: country.cca2,
    name: country.name?.common ?? country.name?.official ?? country.cca2,
    officialName: country.name?.official ?? country.name?.common ?? country.cca2,
    lat: Number(country.latlng?.[0] ?? 0),
    lng: Number(country.latlng?.[1] ?? 0),
    capital: country.capital?.[0] ?? "",
    region: country.region ?? "",
    subregion: country.subregion ?? "",
    flag: country.flags?.svg ?? "",
  };
}

async function getCountries() {
  if (countriesCache) {
    return countriesCache;
  }

  if (countriesPromise) {
    return countriesPromise;
  }

  countriesPromise = fetch(COUNTRIES_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Country list request failed with ${response.status}`);
      }

      const payload = await response.json();
      countriesCache = payload
        .map(normalizeCountry)
        .filter((country) => country.code && !Number.isNaN(country.lat) && !Number.isNaN(country.lng))
        .sort((left, right) => left.name.localeCompare(right.name));
      return countriesCache;
    })
    .finally(() => {
      countriesPromise = null;
    });

  return countriesPromise;
}

async function getCountryLookup() {
  const countries = await getCountries();
  return new Map(countries.map((country) => [country.code, country]));
}

function normalizeRoomCode(value) {
  return (value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

function sendJson(socket, payload) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function roomHasConnectedPlayers(room) {
  return Object.values(room.players).some((player) => player.connected);
}

function buildLobbyRound(playerIds) {
  return {
    hides: Object.fromEntries(playerIds.map((playerId) => [playerId, null])),
    playerStates: Object.fromEntries(playerIds.map((playerId) => [playerId, {
      guesses: [],
      pendingGuess: null,
      completed: false,
      foundOnTurn: null,
      totalGuessTimeMs: 0,
      bestDistanceKm: null,
    }])),
    turnNumber: 1,
    turnStartedAt: null,
    status: playerIds.length === 2 ? "ready" : "awaiting-opponent",
  };
}

function broadcastRoom(room, type = MESSAGE_TYPES.ROOM_UPDATE, extra = {}) {
  for (const player of Object.values(room.players)) {
    const socket = socketSessions.get(player.id);
    if (!socket) {
      continue;
    }

    sendJson(socket, {
      type,
      room: getPublicRoomState(room, player.id),
      ...extra,
    });
  }
}

function scheduleDisconnectCleanup(roomCode, playerId) {
  clearTimeout(reconnectTimers.get(playerId));
  const timer = setTimeout(() => {
    reconnectTimers.delete(playerId);
    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }

    const player = room.players[playerId];
    if (!player || player.connected) {
      return;
    }

    room.statusMessage = `${player.displayName} disconnected.`;
    broadcastRoom(room, MESSAGE_TYPES.PLAYER_DISCONNECT, {
      disconnectedPlayerId: playerId,
    });

    if (!roomHasConnectedPlayers(room)) {
      rooms.delete(roomCode);
    }
  }, RECONNECT_TIMEOUT_MS);

  reconnectTimers.set(playerId, timer);
}

function clearReconnectTimer(playerId) {
  if (reconnectTimers.has(playerId)) {
    clearTimeout(reconnectTimers.get(playerId));
    reconnectTimers.delete(playerId);
  }
}

function attachSocket(socket, roomCode, playerId) {
  socketSessions.set(playerId, socket);
  socket.meta = { roomCode, playerId };
}

function leaveRoom(room, playerId) {
  const player = room.players[playerId];
  if (!player) {
    return;
  }

  delete room.players[playerId];
  delete room.cumulativeScores[playerId];

  if (room.hostPlayerId === playerId) {
    room.hostPlayerId = Object.keys(room.players)[0] ?? null;
  }

  if (room.guestPlayerId === playerId) {
    room.guestPlayerId = null;
  }

  if (Object.keys(room.players).length === 0) {
    rooms.delete(room.code);
    return;
  }

  const activePlayerIds = [room.hostPlayerId, room.guestPlayerId].filter(Boolean);
  room.phase = MATCH_PHASES.LOBBY;
  room.currentRound = buildLobbyRound(activePlayerIds);
  room.result = null;
  room.rematchVotes = [];
  room.statusMessage = `${player.displayName} left the room.`;
  broadcastRoom(room, MESSAGE_TYPES.PLAYER_DISCONNECT, {
    disconnectedPlayerId: playerId,
  });
}

function validateRoomAction(socket) {
  const roomCode = socket.meta?.roomCode;
  const playerId = socket.meta?.playerId;
  const room = roomCode ? rooms.get(roomCode) : null;

  if (!room || !playerId) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Room session not found."));
    return null;
  }

  return { room, playerId };
}

function handleCreateRoom(socket, payload) {
  const playerId = payload.playerId;
  const displayName = (payload.displayName ?? "Agent Zero").trim() || "Agent Zero";
  const code = generateRoomCode(new Set(rooms.keys()));
  const player = createPlayer(playerId, displayName, true);
  const room = createRoomState({ code, hostPlayer: player });
  rooms.set(code, room);
  attachSocket(socket, code, player.id);
  sendJson(socket, {
    type: MESSAGE_TYPES.ROOM_UPDATE,
    room: getPublicRoomState(room, player.id),
  });
}

function handleJoinRoom(socket, payload) {
  const roomCode = normalizeRoomCode(payload.roomCode);
  const room = rooms.get(roomCode);
  if (!room) {
    sendJson(socket, createErrorPayload(ERROR_CODES.ROOM_NOT_FOUND, "Room code not found."));
    return;
  }

  const reconnectPlayer = payload.playerId ? room.players[payload.playerId] : null;
  if (reconnectPlayer) {
    reconnectPlayer.connected = true;
    reconnectPlayer.lastSeenAt = Date.now();
    clearReconnectTimer(reconnectPlayer.id);
    attachSocket(socket, roomCode, reconnectPlayer.id);
    room.statusMessage = `${reconnectPlayer.displayName} rejoined the operation.`;
    broadcastRoom(room);
    return;
  }

  if (room.guestPlayerId && room.guestPlayerId !== payload.playerId) {
    sendJson(socket, createErrorPayload(ERROR_CODES.ROOM_FULL, "Room already has two players."));
    return;
  }

  const displayName = (payload.displayName ?? "Rival Ghost").trim() || "Rival Ghost";
  const guestPlayer = createPlayer(payload.playerId, displayName, false);
  joinRoomState(room, guestPlayer);
  attachSocket(socket, roomCode, guestPlayer.id);
  broadcastRoom(room);
}

function handlePlayerReady(socket) {
  const context = validateRoomAction(socket);
  if (!context) {
    return;
  }

  const { room, playerId } = context;
  if (room.phase !== MATCH_PHASES.LOBBY || playerId !== room.hostPlayerId || !room.guestPlayerId) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Only the host can start once both players are connected."));
    return;
  }

  startRound(room);
  broadcastRoom(room);
}

async function handleHideLock(socket, payload) {
  const context = validateRoomAction(socket);
  if (!context) {
    return;
  }

  const { room, playerId } = context;
  if (room.phase !== MATCH_PHASES.HIDE) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Players can only lock hides during the hide phase."));
    return;
  }

  const location = lockHiddenLocation(room, playerId, payload.hiddenLocation, await getCountryLookup());
  if (!location) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Invalid Google place selection."));
    return;
  }

  broadcastRoom(room);
}

async function handleGuessSubmit(socket, payload) {
  const context = validateRoomAction(socket);
  if (!context) {
    return;
  }

  const { room, playerId } = context;
  if (room.phase !== MATCH_PHASES.SEEK) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Country guesses are only available during the seek phase."));
    return;
  }

  const guessResult = submitGuess(room, playerId, payload.countryCode, await getCountryLookup());
  if (!guessResult) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Guess could not be recorded right now."));
    return;
  }

  const type = room.phase === MATCH_PHASES.RESULTS
    ? MESSAGE_TYPES.MATCH_COMPLETE
    : MESSAGE_TYPES.TURN_RESULT;

  broadcastRoom(room, type, { guessResult });
}

function handleRematchVote(socket) {
  const context = validateRoomAction(socket);
  if (!context) {
    return;
  }

  const { room, playerId } = context;
  if (room.phase !== MATCH_PHASES.RESULTS) {
    sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Rematch voting is only available after a round ends."));
    return;
  }

  const outcome = registerRematchVote(room, playerId);
  broadcastRoom(room, MESSAGE_TYPES.ROOM_UPDATE, { rematchAccepted: outcome.accepted });
}

function handlePlayerLeave(socket) {
  const context = validateRoomAction(socket);
  if (!context) {
    return;
  }

  const { room, playerId } = context;
  socketSessions.delete(playerId);
  clearReconnectTimer(playerId);
  leaveRoom(room, playerId);
}

function handleSocketClose(socket) {
  const roomCode = socket.meta?.roomCode;
  const playerId = socket.meta?.playerId;
  if (!roomCode || !playerId) {
    return;
  }

  socketSessions.delete(playerId);
  const room = rooms.get(roomCode);
  const player = room?.players[playerId];
  if (!room || !player) {
    return;
  }

  player.connected = false;
  player.lastSeenAt = Date.now();
  room.statusMessage = `${player.displayName} connection lost. Waiting to reconnect...`;
  broadcastRoom(room, MESSAGE_TYPES.PLAYER_DISCONNECT, {
    disconnectedPlayerId: playerId,
    reconnectDeadlineMs: RECONNECT_TIMEOUT_MS,
  });
  scheduleDisconnectCleanup(roomCode, playerId);
}

function serveStaticAsset(request, response) {
  const requestUrl = request.url?.split("?")[0] ?? "/";
  const requestPath = requestUrl === "/" ? "/index.html" : requestUrl;
  const safePath = path.normalize(requestPath).replace(/^\\+|^\/+/, "");
  const filePath = path.join(distRoot, safePath);
  const fallbackPath = path.join(distRoot, "index.html");
  const targetPath = fs.existsSync(filePath) ? filePath : fallbackPath;

  if (!fs.existsSync(targetPath)) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Build output not found." }));
    return;
  }

  const extension = path.extname(targetPath);
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
  });
  fs.createReadStream(targetPath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  const requestUrl = request.url?.split("?")[0] ?? "/";

  if (requestUrl === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "ok", rooms: rooms.size }));
    return;
  }

  if (requestUrl === "/api/countries") {
    try {
      const countries = await getCountries();
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ countries }));
    } catch (error) {
      response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: error.message || "Failed to retrieve countries." }));
    }
    return;
  }

  if (request.method === "GET") {
    serveStaticAsset(request, response);
    return;
  }

  response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "Method not allowed." }));
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.on("message", async (rawData) => {
    let payload;

    try {
      payload = JSON.parse(rawData.toString());
    } catch {
      sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, "Malformed socket payload."));
      return;
    }

    try {
      switch (payload.type) {
        case MESSAGE_TYPES.ROOM_CREATE:
          handleCreateRoom(socket, payload);
          break;
        case MESSAGE_TYPES.ROOM_JOIN:
          handleJoinRoom(socket, payload);
          break;
        case MESSAGE_TYPES.PLAYER_READY:
          handlePlayerReady(socket);
          break;
        case MESSAGE_TYPES.HIDE_LOCK:
          await handleHideLock(socket, payload);
          break;
        case MESSAGE_TYPES.GUESS_SUBMIT:
          await handleGuessSubmit(socket, payload);
          break;
        case MESSAGE_TYPES.REMATCH_VOTE:
          handleRematchVote(socket);
          break;
        case MESSAGE_TYPES.PLAYER_LEAVE:
          handlePlayerLeave(socket);
          break;
        case MESSAGE_TYPES.PING:
          sendJson(socket, { type: MESSAGE_TYPES.PONG });
          break;
        default:
          sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, `Unsupported action: ${payload.type}`));
          break;
      }
    } catch (error) {
      sendJson(socket, createErrorPayload(ERROR_CODES.INVALID_ACTION, error.message || "Room action failed."));
    }
  });

  socket.on("close", () => handleSocketClose(socket));
});

server.listen(port, () => {
  console.log(`Pinned Down server listening on http://localhost:${port}`);
});
