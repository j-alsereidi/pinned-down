import { MATCH_PHASES, MESSAGE_TYPES, PLAYER_ROLES } from "./constants.js";

export { MATCH_PHASES, MESSAGE_TYPES, PLAYER_ROLES };

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
 * PlayerRole: one of PLAYER_ROLES
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
 * HintCard:
 * {
 *   id: string,
 *   title: string,
 *   text: string
 * }
 *
 * LocationRecord:
 * {
 *   id: string,
 *   country: string,
 *   city: string,
 *   venue: string,
 *   lat: number,
 *   lng: number,
 *   difficulty: string,
 *   searchTokens: string[],
 *   previewImage: string,
 *   mapViewport: { x: number, y: number, scale: number },
 *   hotspot: { x: number, y: number },
 *   hints: HintCard[]
 * }
 *
 * GuessResult:
 * {
 *   turn: number,
 *   country: string,
 *   distanceKm: number,
 *   band: string,
 *   label: string,
 *   correct: boolean
 * }
 *
 * ScoreBreakdown:
 * {
 *   seekerPoints: number,
 *   hiderPoints: number,
 *   survivalTurns: number,
 *   foundOnTurn: number | null,
 *   unfoundBonus: number
 * }
 */

export function createErrorPayload(code, message) {
  return {
    type: MESSAGE_TYPES.ERROR,
    error: { code, message },
  };
}
