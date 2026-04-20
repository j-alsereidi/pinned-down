import {
  DISTANCE_BANDS,
  HIDER_SURVIVAL_POINTS,
  HIDER_UNFOUND_BONUS,
  MATCH_PHASES,
  PLAYER_ROLES,
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
  SEEKER_TURN_SCORES,
  TURN_LIMIT,
} from "./constants.js";

function getEntropy(length) {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint8Array(length));
  }

  return Uint8Array.from({ length }, (_, index) => ((Date.now() + index * 17) % 255));
}

function normalizeCountryLookup(countryLookup) {
  if (!countryLookup) {
    return new Map();
  }

  return countryLookup instanceof Map
    ? countryLookup
    : new Map(countryLookup.map((country) => [country.code, country]));
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function buildHintText(hiddenLocation) {
  const typeHint = hiddenLocation.types?.length
    ? hiddenLocation.types
        .slice(0, 2)
        .map((type) => type.replace(/_/g, " "))
        .join(" and ")
    : "a notable landmark";
  const cityHint = hiddenLocation.city
    ? `Operations center on ${hiddenLocation.city}.`
    : hiddenLocation.formattedAddress
      ? `Recon picked up the address fragment: ${hiddenLocation.formattedAddress.split(",").slice(0, 2).join(",")}.`
      : "Urban density data is inconclusive.";
  const regionHint = hiddenLocation.countryRegion
    ? `${hiddenLocation.countryRegion}${hiddenLocation.countrySubregion ? ` / ${hiddenLocation.countrySubregion}` : ""}`
    : "Regional telemetry unavailable";
  const capitalHint = hiddenLocation.countryCapital
    ? `The target country's capital is ${hiddenLocation.countryCapital}.`
    : `The country code begins with ${hiddenLocation.countryCode?.[0] ?? "?"}.`;

  return [
    {
      id: "type",
      title: "Place Type",
      text: `The hideout is tagged by Google as ${typeHint}.`,
    },
    {
      id: "city",
      title: "City Trail",
      text: cityHint,
    },
    {
      id: "region",
      title: "Regional Grid",
      text: `The target country is in ${regionHint}.`,
    },
    {
      id: "capital",
      title: "National Intel",
      text: capitalHint,
    },
  ];
}

function getActivePlayerIds(room) {
  return [room.hostPlayerId, room.guestPlayerId].filter(Boolean);
}

function createReadyByPlayer(playerIds = []) {
  return Object.fromEntries(playerIds.filter(Boolean).map((playerId) => [playerId, false]));
}

function getWaitingPlayerNames(room) {
  const readyByPlayer = room.currentRound.readyByPlayer ?? {};

  return getActivePlayerIds(room)
    .filter((playerId) => !readyByPlayer[playerId])
    .map((playerId) => room.players[playerId]?.displayName ?? "Unknown agent");
}

function setWaitingMessage(room, prefix) {
  const waitingNames = getWaitingPlayerNames(room);

  if (waitingNames.length === 0) {
    return prefix;
  }

  if (waitingNames.length === 1) {
    return `${prefix}${waitingNames[0]}.`;
  }

  return `${prefix}${waitingNames.slice(0, -1).join(", ")} and ${waitingNames.at(-1)}.`;
}

function areBothPlayersReady(room) {
  const activePlayerIds = getActivePlayerIds(room);

  return activePlayerIds.length === 2 && activePlayerIds.every((playerId) => room.currentRound.readyByPlayer?.[playerId]);
}

export function generateRoomCode(existingCodes = new Set(), randomBytes = null) {
  let code = "";

  do {
    const entropy = randomBytes ?? getEntropy(ROOM_CODE_LENGTH);
    code = Array.from(entropy.slice(0, ROOM_CODE_LENGTH), (value) =>
      ROOM_CODE_ALPHABET[value % ROOM_CODE_ALPHABET.length],
    ).join("");
  } while (existingCodes.has(code));

  return code;
}

export function createPlayer(playerId, displayName, isHost = false) {
  return {
    id: playerId,
    displayName,
    isHost,
    connected: true,
    lastSeenAt: Date.now(),
  };
}

export function getRoundAssignments(roundNumber, hostPlayerId, guestPlayerId) {
  if (!hostPlayerId || !guestPlayerId) {
    return {
      hiderId: hostPlayerId ?? null,
      seekerId: guestPlayerId ?? null,
    };
  }

  return roundNumber % 2 === 1
    ? { hiderId: hostPlayerId, seekerId: guestPlayerId }
    : { hiderId: guestPlayerId, seekerId: hostPlayerId };
}

export function createRoomState({ code, hostPlayer }) {
  return {
    code,
    phase: MATCH_PHASES.LOBBY,
    roundNumber: 1,
    createdAt: Date.now(),
    hostPlayerId: hostPlayer.id,
    guestPlayerId: null,
    players: {
      [hostPlayer.id]: hostPlayer,
    },
    currentRound: {
      hiderId: hostPlayer.id,
      seekerId: null,
      hiddenLocation: null,
      turnNumber: 1,
      guesses: [],
      readyByPlayer: createReadyByPlayer([hostPlayer.id]),
      status: "awaiting-opponent",
    },
    cumulativeScores: {
      [hostPlayer.id]: 0,
    },
    result: null,
    rematchVotes: [],
    statusMessage: "Awaiting rival connection.",
  };
}

export function joinRoomState(room, guestPlayer) {
  room.players[guestPlayer.id] = guestPlayer;
  room.guestPlayerId = guestPlayer.id;
  room.cumulativeScores[guestPlayer.id] = room.cumulativeScores[guestPlayer.id] ?? 0;
  room.currentRound = {
    ...room.currentRound,
    ...getRoundAssignments(room.roundNumber, room.hostPlayerId, room.guestPlayerId),
    readyByPlayer: createReadyByPlayer([room.hostPlayerId, room.guestPlayerId]),
    status: "awaiting-ready",
  };
  room.statusMessage = "Both agents linked. Waiting for both players to ready up.";
  return room;
}

export function startRound(room) {
  const assignments = getRoundAssignments(
    room.roundNumber,
    room.hostPlayerId,
    room.guestPlayerId,
  );

  room.phase = MATCH_PHASES.HIDE;
  room.currentRound = {
    hiderId: assignments.hiderId,
    seekerId: assignments.seekerId,
    hiddenLocation: null,
    turnNumber: 1,
    guesses: [],
    readyByPlayer: createReadyByPlayer([assignments.hiderId, assignments.seekerId]),
    status: "waiting-for-hide",
  };
  room.result = null;
  room.rematchVotes = [];
  room.statusMessage = "Hider is securing coordinates.";
  return room;
}

export function registerPlayerReady(room, playerId) {
  if (!playerId) {
    return { accepted: false, allReady: false };
  }

  if (!room.currentRound.readyByPlayer) {
    room.currentRound.readyByPlayer = createReadyByPlayer(getActivePlayerIds(room));
  }

  if (!(playerId in room.currentRound.readyByPlayer)) {
    room.currentRound.readyByPlayer[playerId] = false;
  }

  room.currentRound.readyByPlayer[playerId] = true;
  const allReady = areBothPlayersReady(room);

  if (room.phase === MATCH_PHASES.LOBBY) {
    room.currentRound.status = allReady ? "ready" : "awaiting-ready";
    room.statusMessage = allReady
      ? "Both agents ready. Starting the hide phase."
      : setWaitingMessage(room, "Lobby armed. Waiting on ");
  } else if (room.phase === MATCH_PHASES.HIDE && room.currentRound.hiddenLocation) {
    room.currentRound.status = allReady ? "ready-for-seek" : "awaiting-seek-ready";
    room.statusMessage = allReady
      ? "Both agents ready. Seeker is hunting the target country."
      : setWaitingMessage(room, "Location locked. Waiting on ");
  }

  return { accepted: true, allReady };
}

export function sanitizeHiddenLocation(hiddenLocation, countryLookup) {
  const countries = normalizeCountryLookup(countryLookup);
  const country = countries.get(cleanText(hiddenLocation?.countryCode).toUpperCase());
  const lat = Number(hiddenLocation?.lat);
  const lng = Number(hiddenLocation?.lng);

  if (!country || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return {
    placeId: cleanText(hiddenLocation.placeId),
    name: cleanText(hiddenLocation.name) || cleanText(hiddenLocation.formattedAddress),
    formattedAddress: cleanText(hiddenLocation.formattedAddress),
    lat,
    lng,
    city: cleanText(hiddenLocation.city),
    previewImage: cleanText(hiddenLocation.previewImage),
    types: Array.isArray(hiddenLocation.types) ? hiddenLocation.types.slice(0, 5) : [],
    countryCode: country.code,
    countryName: country.name,
    countryCapital: cleanText(country.capital),
    countryRegion: cleanText(country.region),
    countrySubregion: cleanText(country.subregion),
  };
}

export function lockHiddenLocation(room, hiddenLocation, countryLookup) {
  const location = sanitizeHiddenLocation(hiddenLocation, countryLookup);
  if (!location) {
    return null;
  }

  room.currentRound.hiddenLocation = location;
  room.currentRound.readyByPlayer = createReadyByPlayer([
    room.currentRound.hiderId,
    room.currentRound.seekerId,
  ]);
  room.currentRound.status = "awaiting-seek-ready";
  room.statusMessage = "Location locked. Waiting for both agents to ready up.";
  return location;
}

export function advanceToSeekPhase(room) {
  room.phase = MATCH_PHASES.SEEK;
  room.currentRound.status = "active";
  room.statusMessage = "Seeker is hunting the target country.";
  return room;
}

export function getRevealedHintCount(room) {
  if (!room.currentRound.hiddenLocation) {
    return 0;
  }

  if (room.phase === MATCH_PHASES.RESULTS) {
    return TURN_LIMIT;
  }

  return Math.min(room.currentRound.guesses.length + 1, TURN_LIMIT);
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistanceBand(distanceKm) {
  return (
    DISTANCE_BANDS.find((band) => distanceKm <= band.max) ??
    DISTANCE_BANDS[DISTANCE_BANDS.length - 1]
  );
}

export function submitGuess(room, guessedCountryCode, countryLookup) {
  const targetLocation = room.currentRound.hiddenLocation;
  const countries = normalizeCountryLookup(countryLookup);
  const guessedCountry = countries.get(cleanText(guessedCountryCode).toUpperCase());

  if (!targetLocation || !guessedCountry) {
    return null;
  }

  const distanceKm = Math.round(
    haversineKm(
      targetLocation.lat,
      targetLocation.lng,
      guessedCountry.lat,
      guessedCountry.lng,
    ),
  );
  const band = getDistanceBand(distanceKm);
  const correct = guessedCountry.code === targetLocation.countryCode;
  const guessResult = {
    turn: room.currentRound.turnNumber,
    country: guessedCountry.name,
    countryCode: guessedCountry.code,
    distanceKm,
    band: band.id,
    label: band.label,
    correct,
  };

  room.currentRound.guesses.push(guessResult);

  if (correct) {
    finishRound(room, {
      found: true,
      foundOnTurn: room.currentRound.turnNumber,
      targetLocation,
    });
  } else if (room.currentRound.turnNumber >= TURN_LIMIT) {
    finishRound(room, {
      found: false,
      foundOnTurn: null,
      targetLocation,
    });
  } else {
    room.currentRound.turnNumber += 1;
    room.statusMessage = `Turn ${room.currentRound.turnNumber} active. Additional intel unlocked.`;
  }

  return guessResult;
}

export function finishRound(room, { found, foundOnTurn, targetLocation }) {
  const survivalTurns = found ? Math.max(foundOnTurn - 1, 0) : TURN_LIMIT;
  const seekerPoints = found ? SEEKER_TURN_SCORES[foundOnTurn] : 0;
  const hiderPoints =
    survivalTurns * HIDER_SURVIVAL_POINTS + (found ? 0 : HIDER_UNFOUND_BONUS);

  room.phase = MATCH_PHASES.RESULTS;
  room.currentRound.status = "complete";

  room.cumulativeScores[room.currentRound.seekerId] += seekerPoints;
  room.cumulativeScores[room.currentRound.hiderId] += hiderPoints;

  const averageDistance =
    room.currentRound.guesses.length > 0
      ? Math.round(
          room.currentRound.guesses.reduce(
            (sum, guess) => sum + guess.distanceKm,
            0,
          ) / room.currentRound.guesses.length,
        )
      : 0;

  room.result = {
    found,
    winnerId: found ? room.currentRound.seekerId : room.currentRound.hiderId,
    targetCountry: targetLocation.countryName,
    totalTurnsUsed: room.currentRound.guesses.length,
    averageDistance,
    targetLocation,
    scoreBreakdown: {
      seekerPoints,
      hiderPoints,
      survivalTurns,
      foundOnTurn,
      unfoundBonus: found ? 0 : HIDER_UNFOUND_BONUS,
    },
  };
  room.statusMessage = found
    ? `Target neutralized on turn ${foundOnTurn}.`
    : "Seeker failed to identify the country in time.";
  return room;
}

export function registerRematchVote(room, playerId) {
  if (!room.rematchVotes.includes(playerId)) {
    room.rematchVotes.push(playerId);
  }

  if (room.rematchVotes.length >= 2) {
    room.roundNumber += 1;
    startRound(room);
    room.statusMessage = "Rematch accepted. Roles swapped.";
    return { accepted: true };
  }

  room.statusMessage = "Rematch pending rival confirmation.";
  return { accepted: false };
}

export function getPlayerRole(room, playerId) {
  if (!playerId) {
    return null;
  }

  return room.currentRound.hiderId === playerId
    ? PLAYER_ROLES.HIDER
    : room.currentRound.seekerId === playerId
      ? PLAYER_ROLES.SEEKER
      : null;
}

export function getOpponent(room, playerId) {
  return Object.values(room.players).find((player) => player.id !== playerId) ?? null;
}

export function getPublicRoomState(room, playerId) {
  const localPlayer = room.players[playerId] ?? null;
  const opponent = getOpponent(room, playerId);
  const targetLocation = room.currentRound.hiddenLocation;
  const revealedHintCount = getRevealedHintCount(room);
  const revealedHints = targetLocation
    ? buildHintText(targetLocation).slice(0, revealedHintCount)
    : [];
  const role = getPlayerRole(room, playerId);
  const canSeeTarget =
    role === PLAYER_ROLES.HIDER || room.phase === MATCH_PHASES.RESULTS;

  return {
    code: room.code,
    phase: room.phase,
    roundNumber: room.roundNumber,
    statusMessage: room.statusMessage,
    localPlayer,
    opponent,
    role,
    players: Object.values(room.players),
    cumulativeScores: room.cumulativeScores,
    currentRound: {
      ...room.currentRound,
      hiddenLocation: canSeeTarget ? room.currentRound.hiddenLocation : null,
      revealedHints,
      revealedHintCount,
    },
    result: room.result
      ? {
          ...room.result,
          targetLocation: room.result.targetLocation,
        }
      : null,
    rematchVotes: [...room.rematchVotes],
  };
}
