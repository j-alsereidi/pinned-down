import assert from "node:assert/strict";
import { MATCH_PHASES } from "../shared/constants.js";
import { filterCountries } from "../src/game/countries.js";
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

const countries = [
  { code: "JP", name: "Japan", officialName: "Japan", capital: "Tokyo", region: "Asia", subregion: "Eastern Asia", lat: 36.2048, lng: 138.2529 },
  { code: "AU", name: "Australia", officialName: "Commonwealth of Australia", capital: "Canberra", region: "Oceania", subregion: "Australia and New Zealand", lat: -25.2744, lng: 133.7751 },
  { code: "JO", name: "Jordan", officialName: "Hashemite Kingdom of Jordan", capital: "Amman", region: "Asia", subregion: "Western Asia", lat: 30.5852, lng: 36.2384 },
  { code: "ZA", name: "South Africa", officialName: "Republic of South Africa", capital: "Pretoria", region: "Africa", subregion: "Southern Africa", lat: -30.5595, lng: 22.9375 },
  { code: "JM", name: "Jamaica", officialName: "Jamaica", capital: "Kingston", region: "Americas", subregion: "Caribbean", lat: 18.1096, lng: -77.2975 },
  { code: "AZ", name: "Azerbaijan", officialName: "Republic of Azerbaijan", capital: "Baku", region: "Asia", subregion: "Western Asia", lat: 40.1431, lng: 47.5769 },
  { code: "US", name: "United States", officialName: "United States of America", capital: "Washington, D.C.", region: "Americas", subregion: "North America", lat: 38.9, lng: -77.03 },
  { code: "AE", name: "United Arab Emirates", officialName: "United Arab Emirates", capital: "Abu Dhabi", region: "Asia", subregion: "Western Asia", lat: 24.45, lng: 54.38 },
  { code: "MX", name: "Mexico", officialName: "United Mexican States", capital: "Mexico City", region: "Americas", subregion: "North America", lat: 19.43, lng: -99.13 },
];

const countryLookup = new Map(countries.map((country) => [country.code, country]));

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
  reviewCount: 12,
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
  reviewCount: 620,
  types: ["historic_site", "tourist_attraction"],
  countryCode: "AZ",
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
  ["sanitizeHiddenLocation keeps review counts and multi-image hint data from Google Places", () => {
    const sanitized = sanitizeHiddenLocation(hostHide, countryLookup);
    assert.equal(sanitized.countryName, "Japan");
    assert.equal(sanitized.hintImages.length, 4);
    assert.equal(sanitized.previewImage, "https://example.com/japan-1.jpg");
    assert.equal(sanitized.reviewCount, 12);
  }],
  ["the room only advances to seek after both players lock hides", () => {
    const { room, host, guest } = createReadyRoom("ABCD", "host-1", "guest-1");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    assert.equal(room.phase, MATCH_PHASES.HIDE);
    assert.equal(room.currentRound.hides[host.id].countryCode, "JP");
    assert.equal(room.currentRound.hides[guest.id], null);

    lockHiddenLocation(room, guest.id, guestHide, countryLookup);
    assert.equal(room.phase, MATCH_PHASES.SEEK);
    assert.equal(room.currentRound.turnNumber, 1);
  }],
  ["one submitted guess waits for the other player before resolving the round", () => {
    const { room, host, guest } = createReadyRoom("BCDE", "host-2", "guest-2");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);

    submitGuess(room, host.id, "AU", countryLookup, 10_000);
    assert.equal(room.phase, MATCH_PHASES.SEEK);
    assert.equal(room.currentRound.turnNumber, 1);
    assert.equal(room.currentRound.playerStates[host.id].pendingGuess.countryCode, "AU");
    assert.equal(room.currentRound.playerStates[guest.id].pendingGuess, null);

    submitGuess(room, guest.id, "JO", countryLookup, 11_000);
    assert.equal(room.currentRound.turnNumber, 2);
    assert.equal(room.currentRound.playerStates[host.id].guesses.length, 1);
    assert.equal(room.currentRound.playerStates[guest.id].guesses.length, 1);
  }],
  ["players start seek with the first opponent image already revealed", () => {
    const { room, host, guest } = createReadyRoom("CDEF", "host-3", "guest-3");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);

    const hostView = getPublicRoomState(room, host.id);
    const guestView = getPublicRoomState(room, guest.id);
    assert.equal(hostView.currentRound.revealedHintImages.length, 1);
    assert.equal(hostView.currentRound.revealedHintImages[0].imageUrl, "https://example.com/baku-1.jpg");
    assert.equal(guestView.currentRound.revealedHintImages.length, 1);
    assert.equal(guestView.currentRound.revealedHintImages[0].imageUrl, "https://example.com/japan-1.jpg");
  }],
  ["each resolved guess reveals one more opponent image", () => {
    const { room, host, guest } = createReadyRoom("GHIJ", "host-7", "guest-7");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);

    submitGuess(room, host.id, "AU", countryLookup, 10_000);
    submitGuess(room, guest.id, "JO", countryLookup, 12_000);

    const hostView = getPublicRoomState(room, host.id);
    const guestView = getPublicRoomState(room, guest.id);
    assert.equal(hostView.currentRound.revealedHintImages.length, 2);
    assert.equal(hostView.currentRound.revealedHintImages[1].imageUrl, "https://example.com/baku-2.jpg");
    assert.equal(guestView.currentRound.revealedHintImages.length, 2);
    assert.equal(guestView.currentRound.revealedHintImages[1].imageUrl, "https://example.com/japan-2.jpg");
  }],
  ["results use seek-only scoring with obscurity bonus and no defense score", () => {
    const { room, host, guest } = createReadyRoom("DEFG", "host-4", "guest-4");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);

    submitGuess(room, host.id, "AU", countryLookup, 10_000);
    submitGuess(room, guest.id, "JO", countryLookup, 12_000);
    submitGuess(room, host.id, "AZ", countryLookup, 15_000);
    submitGuess(room, guest.id, "ZA", countryLookup, 17_000);
    submitGuess(room, guest.id, "JM", countryLookup, 24_000);
    submitGuess(room, guest.id, "AU", countryLookup, 30_000);

    assert.equal(room.phase, MATCH_PHASES.RESULTS);
    assert.equal(room.result.playerResults[host.id].seek.targetCountry, "Azerbaijan");
    assert.equal(room.result.playerResults[guest.id].seek.targetCountry, "Japan");
    assert.equal(room.result.playerResults[host.id].seek.obscurityBonus, 0);
    assert.ok(room.result.playerResults[guest.id].seek.obscurityBonus > 0);
    assert.equal("hide" in room.result.playerResults[host.id], false);
    assert.ok(room.result.playerResults[host.id].roundScore > 0);
  }],
  ["rematch votes restart the symmetric hide phase", () => {
    const { room, host, guest } = createReadyRoom("EFGH", "host-5", "guest-5");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);
    submitGuess(room, host.id, "AZ", countryLookup, 5_000);
    submitGuess(room, guest.id, "JP", countryLookup, 6_000);

    assert.equal(room.phase, MATCH_PHASES.RESULTS);
    assert.deepEqual(registerRematchVote(room, host.id), { accepted: false });
    assert.deepEqual(registerRematchVote(room, guest.id), { accepted: true });
    assert.equal(room.phase, MATCH_PHASES.HIDE);
    assert.equal(room.roundNumber, 2);
    assert.equal(room.currentRound.hides[host.id], null);
    assert.equal(room.currentRound.hides[guest.id], null);
  }],
  ["public room state exposes only the local hide while hiding the rival location before results", () => {
    const { room, host, guest } = createReadyRoom("FGHI", "host-6", "guest-6");
    startRound(room);
    lockHiddenLocation(room, host.id, hostHide, countryLookup);
    lockHiddenLocation(room, guest.id, guestHide, countryLookup);

    const hostView = getPublicRoomState(room, host.id);
    const guestView = getPublicRoomState(room, guest.id);
    assert.equal(hostView.currentRound.localHide.countryCode, "JP");
    assert.equal(guestView.currentRound.localHide.countryCode, "AZ");
    assert.equal(hostView.result, null);
    assert.equal(guestView.result, null);
  }],
  ["country filtering ranks true matches ahead of unrelated official names", () => {
    const results = filterCountries(countries, "united").map((country) => country.code);
    assert.deepEqual(results.slice(0, 2), ["AE", "US"]);
    assert.equal(results.includes("MX"), false);
  }],
  ["exact code matches beat substring name matches", () => {
    const results = filterCountries(countries, "jo").map((country) => country.code);
    assert.equal(results[0], "JO");
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

