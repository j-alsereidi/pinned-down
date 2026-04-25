import { useEffect, useRef, useState } from "react";
import { CONNECTION_STATES, MATCH_PHASES, MESSAGE_TYPES } from "../../shared/constants.js";
import { addMatchHistory, clearSession, getStoredSession, saveSession } from "./storage.js";

function getSocketUrl() {
  if (typeof window === "undefined") {
    return "ws://localhost:8787";
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  // In dev, VITE_SERVER_PORT lets the client reach a separately-running server.
  // In production (Render), WS runs on the same host/port as the page — use window.location.host.
  const host = import.meta.env.VITE_SERVER_PORT
    ? `${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}`
    : window.location.host;
  return `${protocol}://${host}`;
}

function createPlayerId() {
  return globalThis.crypto?.randomUUID?.() ?? `agent-${Date.now()}`;
}

export function usePinnedDownGame(profile) {
  const [room, setRoom] = useState(null);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.IDLE);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [joinCodeDraft, setJoinCodeDraft] = useState("");
  const [entryView, setEntryView] = useState("menu");
  const [lastEvent, setLastEvent] = useState(null);

  const socketRef = useRef(null);
  const pendingActionRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const manualCloseRef = useRef(false);
  const sessionRef = useRef(getStoredSession());
  const lastStoredResultRef = useRef(null);

  const closeSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const sendMessage = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      return true;
    }

    return false;
  };

  const openSocket = (onOpen) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      onOpen?.();
      return;
    }

    if (socketRef.current?.readyState === WebSocket.CONNECTING) {
      pendingActionRef.current = onOpen ?? null;
      return;
    }

    setConnectionState(CONNECTION_STATES.CONNECTING);
    const socket = new WebSocket(getSocketUrl());
    socketRef.current = socket;
    pendingActionRef.current = onOpen ?? null;

    socket.addEventListener("open", () => {
      setConnectionState(CONNECTION_STATES.CONNECTED);
      setErrorMessage("");
      const pendingAction = pendingActionRef.current;
      pendingActionRef.current = null;
      pendingAction?.();
    });

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      setLastEvent(payload.type);
      setIsBusy(false);

      if (payload.type === MESSAGE_TYPES.ERROR) {
        setErrorMessage(payload.error.message);
        return;
      }

      if (payload.room) {
        setRoom(payload.room);
        setEntryView("menu");
        setErrorMessage("");

        if (payload.room.localPlayer?.id) {
          const session = {
            roomCode: payload.room.code,
            playerId: payload.room.localPlayer.id,
            displayName: payload.room.localPlayer.displayName,
          };
          sessionRef.current = session;
          saveSession(session);
        }
      }
    });

    socket.addEventListener("error", () => {
      setConnectionState(CONNECTION_STATES.OFFLINE);
      setErrorMessage("Server unreachable. Start the Pinned Down server and reconnect.");
      setIsBusy(false);
    });

    socket.addEventListener("close", () => {
      socketRef.current = null;
      setIsBusy(false);

      if (manualCloseRef.current) {
        setConnectionState(CONNECTION_STATES.IDLE);
        return;
      }

      const session = sessionRef.current;
      if (!session) {
        setConnectionState(CONNECTION_STATES.IDLE);
        return;
      }

      setConnectionState(CONNECTION_STATES.OFFLINE);
      reconnectTimerRef.current = window.setTimeout(() => {
        openSocket(() => {
          sendMessage({
            type: MESSAGE_TYPES.ROOM_JOIN,
            roomCode: session.roomCode,
            playerId: session.playerId,
            displayName: session.displayName,
          });
        });
      }, 1500);
    });
  };

  const createRoom = () => {
    manualCloseRef.current = false;
    setEntryView("menu");
    setIsBusy(true);
    const playerId = createPlayerId();

    openSocket(() => {
      sendMessage({
        type: MESSAGE_TYPES.ROOM_CREATE,
        playerId,
        displayName: profile.displayName,
      });
    });
  };

  const joinRoom = () => {
    manualCloseRef.current = false;
    setIsBusy(true);
    const sanitizedCode = joinCodeDraft.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    const playerId = createPlayerId();

    openSocket(() => {
      sendMessage({
        type: MESSAGE_TYPES.ROOM_JOIN,
        roomCode: sanitizedCode,
        playerId,
        displayName: profile.displayName,
      });
    });
  };

  const startRound = () => {
    setIsBusy(true);
    sendMessage({ type: MESSAGE_TYPES.PLAYER_READY });
  };

  const lockLocation = (hiddenLocation) => {
    setIsBusy(true);
    sendMessage({ type: MESSAGE_TYPES.HIDE_LOCK, hiddenLocation });
  };

  const submitGuess = (countryCode) => {
    setIsBusy(true);
    sendMessage({ type: MESSAGE_TYPES.GUESS_SUBMIT, countryCode });
  };

  const voteRematch = () => {
    setIsBusy(true);
    sendMessage({ type: MESSAGE_TYPES.REMATCH_VOTE });
  };

  const disconnect = () => {
    manualCloseRef.current = true;
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
    }
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      sendMessage({ type: MESSAGE_TYPES.PLAYER_LEAVE });
      window.setTimeout(() => closeSocket(), 40);
    } else {
      closeSocket();
    }
    clearSession();
    sessionRef.current = null;
    setRoom(null);
    setJoinCodeDraft("");
  };

  useEffect(() => {
    const session = sessionRef.current;
    if (!session) {
      return undefined;
    }

    openSocket(() => {
      sendMessage({
        type: MESSAGE_TYPES.ROOM_JOIN,
        roomCode: session.roomCode,
        playerId: session.playerId,
        displayName: session.displayName,
      });
    });

    return () => {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      manualCloseRef.current = true;
      closeSocket();
    };
  }, []);

  useEffect(() => {
    if (!room || room.phase !== MATCH_PHASES.RESULTS || !room.result || !room.localPlayer) {
      return;
    }

    const resultId = `${room.code}:${room.roundNumber}:${room.localPlayer.id}`;
    if (lastStoredResultRef.current === resultId) {
      return;
    }

    addMatchHistory({
      id: resultId,
      recordedAt: Date.now(),
      roomCode: room.code,
      roundNumber: room.roundNumber,
      localPlayerName: room.localPlayer.displayName,
      opponentName: room.opponent?.displayName ?? "Disconnected Rival",
      role: "hide-and-seek",
      won: room.result.winnerId === room.localPlayer.id,
      targetCountry: room.result.local?.seek?.targetCountry ?? "Unknown",
      totalTurnsUsed: room.result.local?.seek?.attemptsUsed ?? 0,
      score: room.cumulativeScores[room.localPlayer.id] ?? 0,
      outcome: room.result.winnerId === room.localPlayer.id ? "Won round" : "Lost round",
    });
    lastStoredResultRef.current = resultId;
  }, [room]);

  const localHideLocked = Boolean(room?.currentRound?.localHide);
  const opponentHideLocked = room?.opponent?.id
    ? Boolean(room.currentRound?.hidesLockedByPlayer?.[room.opponent.id])
    : false;
  const localSubmittedGuess = Boolean(room?.currentRound?.localSubmittedGuess);
  const opponentSubmittedGuess = Boolean(room?.currentRound?.opponentSubmittedGuess);
  const localCompleted = Boolean(room?.currentRound?.localCompleted);
  const opponentCompleted = Boolean(room?.currentRound?.opponentCompleted);
  const canStartRound = room?.phase === MATCH_PHASES.LOBBY && Boolean(room?.localPlayer?.isHost) && Boolean(room?.opponent?.id);
  const canSubmitGuess = room?.phase === MATCH_PHASES.SEEK && !localSubmittedGuess && !localCompleted;
  const isWaitingForHide = room?.phase === MATCH_PHASES.HIDE && localHideLocked && !opponentHideLocked;
  const isWaitingForTurnResolution = room?.phase === MATCH_PHASES.SEEK && localSubmittedGuess && !localCompleted;
  const isWaitingForOpponent = room?.opponent && room.opponent.connected === false;

  return {
    room,
    connectionState,
    errorMessage,
    isBusy,
    joinCodeDraft,
    entryView,
    lastEvent,
    localHideLocked,
    opponentHideLocked,
    localSubmittedGuess,
    opponentSubmittedGuess,
    localCompleted,
    opponentCompleted,
    canStartRound,
    canSubmitGuess,
    isWaitingForHide,
    isWaitingForTurnResolution,
    isWaitingForOpponent,
    setEntryView,
    setJoinCodeDraft,
    createRoom,
    joinRoom,
    startRound,
    lockLocation,
    submitGuess,
    voteRematch,
    disconnect,
  };
}
