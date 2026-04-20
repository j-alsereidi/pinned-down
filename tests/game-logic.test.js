import test from "node:test";
import assert from "node:assert/strict";
import { MATCH_PHASES } from "../shared/constants.js";
import {
  createPlayer,
  createRoomState,
  generateRoomCode,
  getPublicRoomState,
  joinRoomState,
  lockHiddenLocation,
  registerRematchVote,
  sanitizeHiddenLocation,
  startRound,
  submitGuess,
} from "../shared/game-logic.js";

const countries = new Map([
  ["JP", { code: "JP", name: "Japan", capital: "Tokyo", region: "Asia", subregion: "Eastern Asia", lat: 36.2048, lng: 138.2529 }],
  ["AZ", { code: "AZ", name: "Azerbaijan", capital: "Baku", region: "Asia", subregion: "Western Asia", lat: 40.1431, lng: 47.5769 }],
  ["AU", { code: "AU", name: "Australia", capital: "Canberra", region: "Oceania", subregion: "Australia and New Zealand", lat: -25.2744, lng: 133.7751 }],
  ["JO", { code: "JO", name: "Jordan", capital: "Amman", region: "Asia", subregion: "Western Asia", lat: 30.5852, lng: 36.2384 }],
]);

const hostHide = {
  placeId: "place-1",
  name: "Shinjuku Gyoen National Garden",
  formattedAddress: "Shinjuku City, Tokyo, Japan",
  lat: 35.6852,
  lng: 139.71,
  city: "Tokyo",
  previewImage: "https://example.com/japan-1.jpg",
  hintImages: [
    "https://example.com/japan-1.jpg",
    "https://example.com/japan-2.jpg",
    "https://example.com/japan-3.jpg",
    "https://example.com/japan-4.jpg",
  ],
  types: ["park", "tourist_attraction"],
  countryCode: "JP",
};

const guestHide = {
  placeId: "place-2",
  name: "Baku Old City",
  formattedAddress: "Baku, Azerbaijan",
  lat: 40.3661,
  lng: 49.8352,
  city: "Baku",
  previewImage: "https://example.com/baku-1.jpg",
  hintImages: [
    "https://example.com/baku-1.jpg",
    "https://example.com/baku-2.jpg",
    "https://example.com/baku-3.jpg",
    "https://example.com/baku-4.jpg",
  ],
  types: ["historic_site", "tourist_attraction"],
  countryCode: "AZ",
};

function buildRoom() {
  const host = createPlayer("host", "Host Agent", true);
  const guest = createPlayer("guest", "Guest Agent", false);
  const room = createRoomState({ code: "ABCD", hostPlayer: host });
  joinRoomState(room, guest);
  startRound(room);
  return { room, host, guest };
}

test("generateRoomCode still uses the 4-character shared alphabet", () => {
  const code = generateRoomCode(new Set(), Uint8Array.from([0, 1, 2, 3]));
  assert.equal(code.length, 4);
  assert.match(code, /^[A-Z0-9]{4}$/);
});

test("both players lock hides before seek begins", () => {
  const { room, host, guest } = buildRoom();
  lockHiddenLocation(room, host.id, hostHide, countries);
  assert.equal(room.phase, MATCH_PHASES.HIDE);
  lockHiddenLocation(room, guest.id, guestHide, countries);
  assert.equal(room.phase, MATCH_PHASES.SEEK);
});

test("resolved turns reveal opponent images in the public room state", () => {
  const { room, host, guest } = buildRoom();
  lockHiddenLocation(room, host.id, hostHide, countries);
  lockHiddenLocation(room, guest.id, guestHide, countries);
  submitGuess(room, host.id, "AU", countries, 10_000);
  submitGuess(room, guest.id, "JO", countries, 12_000);

  const hostView = getPublicRoomState(room, host.id);
  const guestView = getPublicRoomState(room, guest.id);
  assert.equal(hostView.currentRound.revealedHintImages[0].imageUrl, "https://example.com/baku-1.jpg");
  assert.equal(guestView.currentRound.revealedHintImages[0].imageUrl, "https://example.com/japan-1.jpg");
});

test("result scoring combines hide and seek performance for both players", () => {
  const { room, host, guest } = buildRoom();
  lockHiddenLocation(room, host.id, hostHide, countries);
  lockHiddenLocation(room, guest.id, guestHide, countries);
  submitGuess(room, host.id, "AZ", countries, 5_000);
  submitGuess(room, guest.id, "JP", countries, 6_000);

  assert.equal(room.phase, MATCH_PHASES.RESULTS);
  assert.ok(room.result.playerResults[host.id].roundScore > 0);
  assert.ok(room.result.playerResults[guest.id].roundScore > 0);
  assert.deepEqual(registerRematchVote(room, host.id), { accepted: false });
  assert.deepEqual(registerRematchVote(room, guest.id), { accepted: true });
  assert.equal(room.phase, MATCH_PHASES.HIDE);
});

test("sanitizeHiddenLocation keeps the preview image and hint image list", () => {
  const sanitized = sanitizeHiddenLocation(hostHide, countries);
  assert.equal(sanitized.previewImage, "https://example.com/japan-1.jpg");
  assert.equal(sanitized.hintImages.length, 4);
});
