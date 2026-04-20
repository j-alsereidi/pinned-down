import test from "node:test";
import assert from "node:assert/strict";
import { MATCH_PHASES } from "../shared/constants.js";
import { searchLocations } from "../shared/locations.js";
import {
  createPlayer,
  createRoomState,
  finishRound,
  generateRoomCode,
  getPublicRoomState,
  joinRoomState,
  lockHiddenLocation,
  registerRematchVote,
  startRound,
  submitGuess,
} from "../shared/game-logic.js";

test("generateRoomCode uses the shared alphabet and desired length", () => {
  const code = generateRoomCode(new Set(), Uint8Array.from([0, 1, 2, 3]));
  assert.equal(code.length, 4);
  assert.match(code, /^[A-Z0-9]{4}$/);
});

test("room flow progresses from lobby to seek to results with deterministic scoring", () => {
  const host = createPlayer("host-1", "Host Agent", true);
  const seeker = createPlayer("guest-1", "Seek Agent", false);
  const room = createRoomState({ code: "ABCD", hostPlayer: host });

  joinRoomState(room, seeker);
  startRound(room);
  lockHiddenLocation(room, "tokyo-gyoen");

  const miss = submitGuess(room, "Australia");
  assert.equal(miss.correct, false);
  assert.equal(room.phase, MATCH_PHASES.SEEK);
  assert.equal(room.currentRound.turnNumber, 2);

  const hit = submitGuess(room, "Japan");
  assert.equal(hit.correct, true);
  assert.equal(room.phase, MATCH_PHASES.RESULTS);
  assert.equal(room.cumulativeScores[room.currentRound.seekerId], 7500);
  assert.equal(room.cumulativeScores[room.currentRound.hiderId], 1500);
  assert.equal(room.result.scoreBreakdown.foundOnTurn, 2);
});

test("missing all four turns awards hider survival points and the unfound bonus", () => {
  const host = createPlayer("host-2", "Host Agent", true);
  const seeker = createPlayer("guest-2", "Seek Agent", false);
  const room = createRoomState({ code: "EFGH", hostPlayer: host });

  joinRoomState(room, seeker);
  startRound(room);
  lockHiddenLocation(room, "baku-old-city");

  submitGuess(room, "Australia");
  submitGuess(room, "South Africa");
  submitGuess(room, "Jamaica");
  submitGuess(room, "Japan");

  assert.equal(room.phase, MATCH_PHASES.RESULTS);
  assert.equal(room.result.found, false);
  assert.equal(room.cumulativeScores[room.currentRound.hiderId], 11000);
  assert.equal(room.cumulativeScores[room.currentRound.seekerId], 0);
});

test("rematch votes swap the active roles by starting the next round", () => {
  const host = createPlayer("host-3", "Host Agent", true);
  const seeker = createPlayer("guest-3", "Seek Agent", false);
  const room = createRoomState({ code: "IJKL", hostPlayer: host });

  joinRoomState(room, seeker);
  startRound(room);
  finishRound(room, {
    found: true,
    foundOnTurn: 1,
    targetLocation: {
      id: "tokyo-gyoen",
      country: "Japan",
    },
  });

  assert.deepEqual(registerRematchVote(room, host.id), { accepted: false });
  assert.equal(room.phase, MATCH_PHASES.RESULTS);

  assert.deepEqual(registerRematchVote(room, seeker.id), { accepted: true });
  assert.equal(room.phase, MATCH_PHASES.HIDE);
  assert.equal(room.roundNumber, 2);
  assert.equal(room.currentRound.hiderId, seeker.id);
  assert.equal(room.currentRound.seekerId, host.id);
});

test("public room state hides the target from the seeker while keeping hints available", () => {
  const host = createPlayer("host-4", "Host Agent", true);
  const seeker = createPlayer("guest-4", "Seek Agent", false);
  const room = createRoomState({ code: "MNOP", hostPlayer: host });

  joinRoomState(room, seeker);
  startRound(room);
  lockHiddenLocation(room, "amman-citadel");

  const seekerView = getPublicRoomState(room, seeker.id);
  const hiderView = getPublicRoomState(room, host.id);

  assert.equal(seekerView.currentRound.hiddenLocationId, null);
  assert.equal(hiderView.currentRound.hiddenLocationId, "amman-citadel");
  assert.equal(seekerView.currentRound.revealedHints.length, 1);
});

test("searchLocations matches by country and venue terms", () => {
  assert.ok(searchLocations("tokyo").some((location) => location.id === "tokyo-gyoen"));
  assert.ok(searchLocations("harbour").some((location) => location.id === "kingston-harbour"));
});
