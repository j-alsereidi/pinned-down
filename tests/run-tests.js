import assert from "node:assert/strict";
import { MATCH_PHASES } from "../shared/constants.js";
import {
  advanceToSeekPhase,
  createPlayer,
  createRoomState,
  finishRound,
  generateRoomCode,
  getPublicRoomState,
  joinRoomState,
  lockHiddenLocation,
  registerPlayerReady,
  registerRematchVote,
  sanitizeHiddenLocation,
  startRound,
  submitGuess,
} from "../shared/game-logic.js";

const countries = [
  { code: "JP", name: "Japan", capital: "Tokyo", region: "Asia", subregion: "Eastern Asia", lat: 36.2048, lng: 138.2529 },
  { code: "AU", name: "Australia", capital: "Canberra", region: "Oceania", subregion: "Australia and New Zealand", lat: -25.2744, lng: 133.7751 },
  { code: "JO", name: "Jordan", capital: "Amman", region: "Asia", subregion: "Western Asia", lat: 30.5852, lng: 36.2384 },
  { code: "ZA", name: "South Africa", capital: "Pretoria", region: "Africa", subregion: "Southern Africa", lat: -30.5595, lng: 22.9375 },
  { code: "JM", name: "Jamaica", capital: "Kingston", region: "Americas", subregion: "Caribbean", lat: 18.1096, lng: -77.2975 },
  { code: "AZ", name: "Azerbaijan", capital: "Baku", region: "Asia", subregion: "Western Asia", lat: 40.1431, lng: 47.5769 },
];

const countryLookup = new Map(countries.map((country) => [country.code, country]));

const sampleHiddenLocation = {
  placeId: "place-1",
  name: "Shinjuku Gyoen National Garden",
  formattedAddress: "Shinjuku City, Tokyo, Japan",
  lat: 35.6852,
  lng: 139.71,
  city: "Tokyo",
  previewImage: "",
  types: ["park", "tourist_attraction"],
  countryCode: "JP",
};

function createReadyRoom(code, hostId, guestId) {
  const host = createPlayer(hostId, "Host Agent", true);
  const guest = createPlayer(guestId, "Seek Agent", false);
  const room = createRoomState({ code, hostPlayer: host });
  joinRoomState(room, guest);
  return { room, host, guest };
}

const tests = [
  ["generateRoomCode uses the shared alphabet and desired length", () => {
    const code = generateRoomCode(new Set(), Uint8Array.from([0, 1, 2, 3]));
    assert.equal(code.length, 4);
    assert.match(code, /^[A-Z0-9]{4}$/);
  }],
  ["sanitizeHiddenLocation enriches Google place data from the online country lookup", () => {
    const sanitized = sanitizeHiddenLocation(sampleHiddenLocation, countryLookup);
    assert.equal(sanitized.countryName, "Japan");
    assert.equal(sanitized.countryCapital, "Tokyo");
    assert.equal(sanitized.countryRegion, "Asia");
  }],
  ["lobby only advances after both players ready up", () => {
    const { room, host, guest } = createReadyRoom("ABCD", "host-0", "guest-0");
    assert.equal(room.phase, MATCH_PHASES.LOBBY);
    assert.equal(room.currentRound.readyByPlayer[host.id], false);
    assert.equal(room.currentRound.readyByPlayer[guest.id], false);

    const firstReady = registerPlayerReady(room, host.id);
    assert.equal(firstReady.allReady, false);
    assert.equal(room.phase, MATCH_PHASES.LOBBY);
    assert.equal(room.currentRound.readyByPlayer[host.id], true);
    assert.equal(room.currentRound.readyByPlayer[guest.id], false);

    const secondReady = registerPlayerReady(room, guest.id);
    assert.equal(secondReady.allReady, true);
    startRound(room);
    assert.equal(room.phase, MATCH_PHASES.HIDE);
    assert.equal(room.currentRound.hiddenLocation, null);
    assert.equal(room.currentRound.readyByPlayer[host.id], false);
    assert.equal(room.currentRound.readyByPlayer[guest.id], false);
  }],
  ["hide lock waits for both players to ready before seek begins", () => {
    const { room, host, guest } = createReadyRoom("BCDE", "host-5", "guest-5");
    startRound(room);
    lockHiddenLocation(room, sampleHiddenLocation, countryLookup);
    assert.equal(room.phase, MATCH_PHASES.HIDE);
    assert.equal(room.currentRound.status, "awaiting-seek-ready");

    const hiderReady = registerPlayerReady(room, host.id);
    assert.equal(hiderReady.allReady, false);
    assert.equal(room.phase, MATCH_PHASES.HIDE);

    const seekerReady = registerPlayerReady(room, guest.id);
    assert.equal(seekerReady.allReady, true);
    advanceToSeekPhase(room);
    assert.equal(room.phase, MATCH_PHASES.SEEK);
    assert.equal(room.currentRound.readyByPlayer[host.id], true);
    assert.equal(room.currentRound.readyByPlayer[guest.id], true);
  }],
  ["room flow progresses from hide to seek to results with deterministic scoring", () => {
    const { room, host, guest } = createReadyRoom("CDEF", "host-1", "guest-1");
    startRound(room);
    lockHiddenLocation(room, sampleHiddenLocation, countryLookup);
    registerPlayerReady(room, host.id);
    registerPlayerReady(room, guest.id);
    advanceToSeekPhase(room);
    const miss = submitGuess(room, "AU", countryLookup);
    assert.equal(miss.correct, false);
    assert.equal(room.phase, MATCH_PHASES.SEEK);
    assert.equal(room.currentRound.turnNumber, 2);
    const hit = submitGuess(room, "JP", countryLookup);
    assert.equal(hit.correct, true);
    assert.equal(room.phase, MATCH_PHASES.RESULTS);
    assert.equal(room.cumulativeScores[room.currentRound.seekerId], 7500);
    assert.equal(room.cumulativeScores[room.currentRound.hiderId], 1500);
    assert.equal(room.result.scoreBreakdown.foundOnTurn, 2);
  }],
  ["missing all four turns awards hider survival points and the unfound bonus", () => {
    const { room, host, guest } = createReadyRoom("DEFG", "host-2", "guest-2");
    startRound(room);
    lockHiddenLocation(room, { ...sampleHiddenLocation, countryCode: "AZ", city: "Baku", formattedAddress: "Baku, Azerbaijan" }, countryLookup);
    registerPlayerReady(room, host.id);
    registerPlayerReady(room, guest.id);
    advanceToSeekPhase(room);
    submitGuess(room, "AU", countryLookup);
    submitGuess(room, "ZA", countryLookup);
    submitGuess(room, "JM", countryLookup);
    submitGuess(room, "JP", countryLookup);
    assert.equal(room.phase, MATCH_PHASES.RESULTS);
    assert.equal(room.result.found, false);
    assert.equal(room.cumulativeScores[room.currentRound.hiderId], 11000);
    assert.equal(room.cumulativeScores[room.currentRound.seekerId], 0);
  }],
  ["rematch votes swap the active roles by starting the next round", () => {
    const { room, host, guest } = createReadyRoom("EFGH", "host-3", "guest-3");
    startRound(room);
    finishRound(room, {
      found: true,
      foundOnTurn: 1,
      targetLocation: sanitizeHiddenLocation(sampleHiddenLocation, countryLookup),
    });
    assert.deepEqual(registerRematchVote(room, host.id), { accepted: false });
    assert.equal(room.phase, MATCH_PHASES.RESULTS);
    assert.deepEqual(registerRematchVote(room, guest.id), { accepted: true });
    assert.equal(room.phase, MATCH_PHASES.HIDE);
    assert.equal(room.roundNumber, 2);
    assert.equal(room.currentRound.hiderId, guest.id);
    assert.equal(room.currentRound.seekerId, host.id);
    assert.equal(room.currentRound.readyByPlayer[host.id], false);
    assert.equal(room.currentRound.readyByPlayer[guest.id], false);
  }],
  ["public room state hides the target from the seeker while keeping hints available", () => {
    const { room, host, guest } = createReadyRoom("FGHI", "host-4", "guest-4");
    startRound(room);
    lockHiddenLocation(room, sampleHiddenLocation, countryLookup);
    registerPlayerReady(room, host.id);
    registerPlayerReady(room, guest.id);
    advanceToSeekPhase(room);
    const seekerView = getPublicRoomState(room, guest.id);
    const hiderView = getPublicRoomState(room, host.id);
    assert.equal(seekerView.currentRound.hiddenLocation, null);
    assert.equal(hiderView.currentRound.hiddenLocation.countryCode, "JP");
    assert.equal(seekerView.currentRound.revealedHints.length, 1);
  }],
];

let failures = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`All ${tests.length} tests passed.`);
}
