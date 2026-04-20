import { MATCH_PHASES, MESSAGE_TYPES } from "./constants.js";

export { MATCH_PHASES, MESSAGE_TYPES };

export const ERROR_CODES = Object.freeze({
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  INVALID_ROOM_CODE: "INVALID_ROOM_CODE",
  INVALID_ACTION: "INVALID_ACTION",
  OPPONENT_DISCONNECTED: "OPPONENT_DISCONNECTED",
  SERVER_UNREACHABLE: "SERVER_UNREACHABLE",
});

/**
 * Shared shape notes for the JS codebase.
 *
 * RoomCode: string
 * PlayerId: string
 * TurnNumber: 1 | 2 | 3 | 4
 * MatchPhase: one of MATCH_PHASES
 *
 * SettingsProfile:
 * {
 *   displayName: string,
 *   soundEnabled: boolean,
 *   reducedMotion: boolean,
 *   panZoomSensitivity: number
 * }
 *
 * HintImage:
 * {
 *   id: string,
 *   imageUrl: string,
 *   turn: number
 * }
 *
 * HiddenPlace:
 * {
 *   placeId: string,
 *   name: string,
 *   formattedAddress: string,
 *   lat: number,
 *   lng: number,
 *   city: string,
 *   previewImage: string,
 *   hintImages: string[],
 *   types: string[],
 *   countryCode: string,
 *   countryName: string
 * }
 *
 * GuessResult:
 * {
 *   turn: number,
 *   country: string,
 *   distanceKm: number,
 *   band: string,
 *   label: string,
 *   correct: boolean,
 *   elapsedMs: number
 * }
 */

export function createErrorPayload(code, message) {
  return {
    type: MESSAGE_TYPES.ERROR,
    error: { code, message },
  };
}
