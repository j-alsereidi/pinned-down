import {
  DISTANCE_BANDS,
  MATCH_PHASES,
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
  SEEKER_TURN_SCORES,
  TURN_LIMIT,
} from "./constants.js";

const MAX_HINT_IMAGES = TURN_LIMIT;

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

function getActivePlayerIds(room) {
  return [room.hostPlayerId, room.guestPlayerId].filter(Boolean);
}

function getOpponentPlayerId(room, playerId) {
  return getActivePlayerIds(room).find((candidateId) => candidateId !== playerId) ?? null;
}

function createEmptyPlayerRoundState() {
  return {
    guesses: [],
    pendingGuess: null,
    completed: false,
    foundOnTurn: null,
    totalGuessTimeMs: 0,
    bestDistanceKm: null,
  };
}

function createRoundState(playerIds = []) {
  return {
    hides: Object.fromEntries(playerIds.map((playerId) => [playerId, null])),
    playerStates: Object.fromEntries(playerIds.map((playerId) => [playerId, createEmptyPlayerRoundState()])),
    turnNumber: 1,
    turnStartedAt: null,
    status: playerIds.length === 2 ? "awaiting-hides" : "awaiting-opponent",
  };
}

function getLockedPlayerNames(room) {
  return getActivePlayerIds(room)
    .filter((playerId) => room.currentRound.hides?.[playerId])
    .map((playerId) => room.players[playerId]?.displayName ?? "Unknown agent");
}

function getWaitingPlayerNames(room) {
  return getActivePlayerIds(room)
    .filter((playerId) => !room.currentRound.hides?.[playerId])
    .map((playerId) => room.players[playerId]?.displayName ?? "Unknown agent");
}

function getPlayersAwaitingGuess(room) {
  return getActivePlayerIds(room).filter((playerId) => {
    const playerState = room.currentRound.playerStates?.[playerId];
    return playerState && !playerState.completed && !playerState.pendingGuess;
  });
}

function getSubmittedPlayerNames(room) {
  return getActivePlayerIds(room)
    .filter((playerId) => room.currentRound.playerStates?.[playerId]?.pendingGuess)
    .map((playerId) => room.players[playerId]?.displayName ?? "Unknown agent");
}

function areBothHidesLocked(room) {
  const playerIds = getActivePlayerIds(room);
  return playerIds.length === 2 && playerIds.every((playerId) => room.currentRound.hides?.[playerId]);
}

function areAllActiveGuessesSubmitted(room) {
  const activePlayers = getActivePlayerIds(room).filter((playerId) => {
    const playerState = room.currentRound.playerStates?.[playerId];
    return playerState && !playerState.completed;
  });

  return activePlayers.length > 0 && activePlayers.every((playerId) => room.currentRound.playerStates[playerId]?.pendingGuess);
}

function getHintImages(hiddenLocation) {
  const images = Array.isArray(hiddenLocation?.hintImages)
    ? hiddenLocation.hintImages.filter(Boolean).slice(0, MAX_HINT_IMAGES)
    : [];

  if (images.length > 0) {
    return images;
  }

  return hiddenLocation?.previewImage ? [hiddenLocation.previewImage] : [];
}

function getAverageDistance(guesses) {
  if (!guesses.length) {
    return 0;
  }

  return Math.round(guesses.reduce((sum, guess) => sum + guess.distanceKm, 0) / guesses.length);
}

function getClosestDistance(guesses) {
  if (!guesses.length) {
    return 0;
  }

  return Math.min(...guesses.map((guess) => guess.distanceKm));
}

function getObscurityBonusRate(reviewCount) {
  if (typeof reviewCount !== "number" || Number.isNaN(reviewCount)) {
    return 0;
  }

  if (reviewCount <= 24) {
    return 0.4;
  }

  if (reviewCount <= 99) {
    return 0.25;
  }

  if (reviewCount <= 499) {
    return 0.1;
  }

  return 0;
}

function getSeekScore(playerState, targetLocation) {
  const attemptsUsed = playerState.guesses.length || TURN_LIMIT;
  const attemptsScore = playerState.foundOnTurn ? SEEKER_TURN_SCORES[playerState.foundOnTurn] ?? 0 : 0;
  const averageDistance = getAverageDistance(playerState.guesses);
  const closestDistance = getClosestDistance(playerState.guesses);
  const timeScore = Math.max(0, 2000 - Math.round(playerState.totalGuessTimeMs / 1000) * 20);
  const distanceScore = playerState.foundOnTurn
    ? Math.max(0, 2500 - Math.round(averageDistance / 2))
    : Math.max(0, 1500 - Math.round(closestDistance / 6));
  const baseSeekScore = attemptsScore + timeScore + distanceScore;
  const obscurityRate = getObscurityBonusRate(targetLocation?.reviewCount);
  const obscurityBonus = Math.round(baseSeekScore * obscurityRate);

  return {
    attemptsUsed,
    attemptsScore,
    timeScore,
    distanceScore,
    baseSeekScore,
    obscurityBonus,
    obscurityRate,
    reviewCount: typeof targetLocation?.reviewCount === "number" ? targetLocation.reviewCount : null,
    averageDistance,
    closestDistance,
    totalGuessTimeMs: playerState.totalGuessTimeMs,
    score: baseSeekScore + obscurityBonus,
  };
}

function createResultSummary(room) {
  const playerIds = getActivePlayerIds(room);
  const playerResults = Object.fromEntries(
    playerIds.map((playerId) => {
      const opponentId = getOpponentPlayerId(room, playerId);
      const playerState = room.currentRound.playerStates[playerId];
      const targetHide = opponentId ? room.currentRound.hides[opponentId] : null;
      const seek = getSeekScore(playerState, targetHide);
      const roundScore = seek.score;

      return [
        playerId,
        {
          playerId,
          playerName: room.players[playerId]?.displayName ?? "Unknown agent",
          opponentId,
          found: Boolean(playerState.foundOnTurn),
          foundOnTurn: playerState.foundOnTurn,
          seek: {
            targetCountry: targetHide?.countryName ?? "Unknown",
            targetPlace: targetHide?.name ?? "Unknown",
            guessHistory: [...playerState.guesses],
            ...seek,
          },
          roundScore,
        },
      ];
    }),
  );

  for (const playerId of playerIds) {
    room.cumulativeScores[playerId] = (room.cumulativeScores[playerId] ?? 0) + playerResults[playerId].roundScore;
  }

  const [firstPlayerId, secondPlayerId] = playerIds;
  const winnerId = !secondPlayerId
    ? firstPlayerId
    : playerResults[firstPlayerId].roundScore === playerResults[secondPlayerId].roundScore
      ? room.cumulativeScores[firstPlayerId] >= room.cumulativeScores[secondPlayerId]
        ? firstPlayerId
        : secondPlayerId
      : playerResults[firstPlayerId].roundScore > playerResults[secondPlayerId].roundScore
        ? firstPlayerId
        : secondPlayerId;

  return {
    winnerId,
    playerResults,
    totalScores: { ...room.cumulativeScores },
  };
}

function getTurnResolutionMessage(room) {
  const awaitingPlayers = getPlayersAwaitingGuess(room);
  if (awaitingPlayers.length === 0) {
    return `Turn ${room.currentRound.turnNumber} resolving.`;
  }

  if (awaitingPlayers.length === 1) {
    return `Turn ${room.currentRound.turnNumber}: waiting on ${room.players[awaitingPlayers[0]]?.displayName ?? "the rival"}.`;
  }

  return `Turn ${room.currentRound.turnNumber}: awaiting both guesses.`;
}

function beginSeekPhase(room) {
  room.phase = MATCH_PHASES.SEEK;
  room.currentRound.turnNumber = 1;
  room.currentRound.turnStartedAt = Date.now();
  room.currentRound.status = "active-turn";
  room.statusMessage = "Both hides are locked. Turn 1 is live.";
  return room;
}

function resolveTurn(room) {
  const activePlayerIds = getActivePlayerIds(room).filter((playerId) => !room.currentRound.playerStates[playerId]?.completed);

  for (const playerId of activePlayerIds) {
    const playerState = room.currentRound.playerStates[playerId];
    const pendingGuess = playerState.pendingGuess;
    if (!pendingGuess) {
      continue;
    }

    playerState.pendingGuess = null;
    playerState.guesses.push(pendingGuess);
    playerState.totalGuessTimeMs += pendingGuess.elapsedMs;
    playerState.bestDistanceKm = playerState.bestDistanceKm == null
      ? pendingGuess.distanceKm
      : Math.min(playerState.bestDistanceKm, pendingGuess.distanceKm);

    if (pendingGuess.correct) {
      playerState.completed = true;
      playerState.foundOnTurn = room.currentRound.turnNumber;
    } else if (room.currentRound.turnNumber >= TURN_LIMIT) {
      playerState.completed = true;
    }
  }

  const everyoneComplete = getActivePlayerIds(room).every(
    (playerId) => room.currentRound.playerStates[playerId]?.completed,
  );

  if (everyoneComplete) {
    finishRound(room);
    return room;
  }

  room.currentRound.turnNumber += 1;
  room.currentRound.turnStartedAt = Date.now();
  room.currentRound.status = "active-turn";
  room.statusMessage = `Turn ${room.currentRound.turnNumber} active. One image hint unlocked per resolved guess.`;
  return room;
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
    currentRound: createRoundState([hostPlayer.id]),
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
  room.currentRound = createRoundState(getActivePlayerIds(room));
  room.currentRound.status = "ready";
  room.statusMessage = "Both agents linked. Host can start the round.";
  return room;
}

export function startRound(room) {
  room.phase = MATCH_PHASES.HIDE;
  room.currentRound = createRoundState(getActivePlayerIds(room));
  room.result = null;
  room.rematchVotes = [];
  room.statusMessage = "Both players are choosing their hiding spots.";
  return room;
}

export function sanitizeHiddenLocation(hiddenLocation, countryLookup) {
  const countries = normalizeCountryLookup(countryLookup);
  const country = countries.get(cleanText(hiddenLocation?.countryCode).toUpperCase());
  const lat = Number(hiddenLocation?.lat);
  const lng = Number(hiddenLocation?.lng);

  if (!country || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  const hintImages = Array.isArray(hiddenLocation?.hintImages)
    ? hiddenLocation.hintImages.filter((value) => cleanText(value)).slice(0, MAX_HINT_IMAGES)
    : [];
  const previewImage = cleanText(hiddenLocation?.previewImage) || hintImages[0] || "";
  const reviewCount = typeof hiddenLocation?.reviewCount === "number" && !Number.isNaN(hiddenLocation.reviewCount)
    ? hiddenLocation.reviewCount
    : null;

  return {
    placeId: cleanText(hiddenLocation.placeId),
    name: cleanText(hiddenLocation.name) || cleanText(hiddenLocation.formattedAddress),
    formattedAddress: cleanText(hiddenLocation.formattedAddress),
    lat,
    lng,
    city: cleanText(hiddenLocation.city),
    previewImage,
    hintImages: hintImages.length > 0 ? hintImages : previewImage ? [previewImage] : [],
    reviewCount,
    types: Array.isArray(hiddenLocation.types) ? hiddenLocation.types.slice(0, 5) : [],
    countryCode: country.code,
    countryName: country.name,
    countryCapital: cleanText(country.capital),
    countryRegion: cleanText(country.region),
    countrySubregion: cleanText(country.subregion),
  };
}

export function lockHiddenLocation(room, playerId, hiddenLocation, countryLookup) {
  const location = sanitizeHiddenLocation(hiddenLocation, countryLookup);
  if (!location) {
    return null;
  }

  room.currentRound.hides[playerId] = location;
  room.currentRound.status = "awaiting-hides";

  if (areBothHidesLocked(room)) {
    beginSeekPhase(room);
  } else {
    const waitingPlayers = getWaitingPlayerNames(room);
    room.statusMessage = waitingPlayers.length === 0
      ? "Waiting for the rival hide."
      : `Hide locked. Waiting on ${waitingPlayers.join(" and ")}.`;
  }

  return location;
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

export function submitGuess(room, playerId, guessedCountryCode, countryLookup, submittedAt = Date.now()) {
  const targetPlayerId = getOpponentPlayerId(room, playerId);
  const targetLocation = targetPlayerId ? room.currentRound.hides[targetPlayerId] : null;
  const countries = normalizeCountryLookup(countryLookup);
  const guessedCountry = countries.get(cleanText(guessedCountryCode).toUpperCase());
  const playerState = room.currentRound.playerStates[playerId];

  if (!targetLocation || !guessedCountry || !playerState || playerState.completed || playerState.pendingGuess) {
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
    elapsedMs: Math.max(0, submittedAt - (room.currentRound.turnStartedAt ?? submittedAt)),
  };

  playerState.pendingGuess = guessResult;
  room.currentRound.status = "awaiting-turn";
  room.statusMessage = getTurnResolutionMessage(room);

  if (areAllActiveGuessesSubmitted(room)) {
    resolveTurn(room);
  }

  return guessResult;
}

export function finishRound(room) {
  room.phase = MATCH_PHASES.RESULTS;
  room.currentRound.status = "complete";
  room.result = createResultSummary(room);
  room.statusMessage = `${room.players[room.result.winnerId]?.displayName ?? "Winner"} won the round.`;
  return room;
}

export function registerRematchVote(room, playerId) {
  if (!room.rematchVotes.includes(playerId)) {
    room.rematchVotes.push(playerId);
  }

  if (room.rematchVotes.length >= 2) {
    room.roundNumber += 1;
    startRound(room);
    room.statusMessage = "Rematch accepted. Both players are hiding again.";
    return { accepted: true };
  }

  room.statusMessage = "Rematch pending rival confirmation.";
  return { accepted: false };
}

export function getOpponent(room, playerId) {
  return Object.values(room.players).find((player) => player.id !== playerId) ?? null;
}

export function getPublicRoomState(room, playerId) {
  const localPlayer = room.players[playerId] ?? null;
  const opponent = getOpponent(room, playerId);
  const opponentId = opponent?.id ?? null;
  const localState = room.currentRound.playerStates?.[playerId] ?? createEmptyPlayerRoundState();
  const opponentState = opponentId
    ? room.currentRound.playerStates?.[opponentId] ?? createEmptyPlayerRoundState()
    : createEmptyPlayerRoundState();
  const localHide = room.currentRound.hides?.[playerId] ?? null;
  const opponentHide = opponentId ? room.currentRound.hides?.[opponentId] ?? null : null;
  const revealedHintCount = room.phase === MATCH_PHASES.HIDE
    ? 0
    : room.phase === MATCH_PHASES.RESULTS
      ? TURN_LIMIT
      : Math.min(localState.guesses.length + 1, TURN_LIMIT);
  const revealedHintImages = getHintImages(opponentHide)
    .slice(0, revealedHintCount)
    .map((imageUrl, index) => ({
      id: `hint-${index + 1}`,
      imageUrl,
      turn: index + 1,
    }));

  return {
    code: room.code,
    phase: room.phase,
    roundNumber: room.roundNumber,
    statusMessage: room.statusMessage,
    localPlayer,
    opponent,
    players: Object.values(room.players),
    cumulativeScores: room.cumulativeScores,
    currentRound: {
      status: room.currentRound.status,
      turnNumber: room.currentRound.turnNumber,
      hidesLockedByPlayer: Object.fromEntries(
        getActivePlayerIds(room).map((id) => [id, Boolean(room.currentRound.hides?.[id])]),
      ),
      localHide,
      localGuesses: [...localState.guesses],
      localSubmittedGuess: Boolean(localState.pendingGuess),
      opponentSubmittedGuess: Boolean(opponentState.pendingGuess),
      localCompleted: localState.completed,
      opponentCompleted: opponentState.completed,
      localFoundOnTurn: localState.foundOnTurn,
      opponentFoundOnTurn: opponentState.foundOnTurn,
      revealedHintImages,
      revealedHintCount,
      totalHintCount: TURN_LIMIT,
      opponentGuessCount: opponentState.guesses.length,
      lockedPlayers: getLockedPlayerNames(room),
      waitingPlayers: getWaitingPlayerNames(room),
      submittedPlayers: getSubmittedPlayerNames(room),
    },
    result: room.result
      ? {
          winnerId: room.result.winnerId,
          local: room.result.playerResults[playerId] ?? null,
          opponent: opponentId ? room.result.playerResults[opponentId] ?? null : null,
          totalScores: room.result.totalScores,
        }
      : null,
    rematchVotes: [...room.rematchVotes],
  };
}

