import { DEFAULT_PROFILE } from "../../shared/constants.js";

const PROFILE_KEY = "pinned-down-profile";
const SESSION_KEY = "pinned-down-session";
const HISTORY_KEY = "pinned-down-history";

function safeParse(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getStoredProfile() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROFILE };
  }

  return {
    ...DEFAULT_PROFILE,
    ...safeParse(window.localStorage.getItem(PROFILE_KEY), {}),
  };
}

export function saveProfile(profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse(window.localStorage.getItem(SESSION_KEY), null);
}

export function saveSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function getMatchHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(HISTORY_KEY), []);
}

export function addMatchHistory(entry) {
  if (typeof window === "undefined") {
    return;
  }

  const history = getMatchHistory().filter((item) => item.id !== entry.id);
  history.unshift(entry);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}
