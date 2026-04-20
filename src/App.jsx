import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Radio } from "lucide-react";
import { MainMenuScreen } from "../mainmenu.jsx";
import { HostLobbyScreen } from "../host.jsx";
import { JoinOperationScreen } from "../join.jsx";
import { HidingScreen } from "../hide.jsx";
import { SeekingScreen } from "../seek.jsx";
import { VictoryScreen } from "../victory.jsx";
import { MATCH_PHASES } from "../shared/constants.js";
import { getMatchHistory, getStoredProfile, saveProfile } from "./game/storage.js";
import { usePinnedDownGame } from "./game/usePinnedDownGame.js";
import { fetchCountries, filterCountries, getCountryByCode } from "./game/countries.js";
import { usePlaceSearch } from "./game/usePlaceSearch.js";
import { SettingsModal } from "./components/SettingsModal.jsx";
import { RankingsModal } from "./components/RankingsModal.jsx";

function createIntroPayload(key, kind, eyebrow, title, footer) {
  return { key, kind, eyebrow, title, footer };
}

export default function App() {
  const [profile, setProfile] = useState(getStoredProfile());
  const [draftProfile, setDraftProfile] = useState(getStoredProfile());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rankingsOpen, setRankingsOpen] = useState(false);
  const [history, setHistory] = useState(getMatchHistory());
  const [copied, setCopied] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesError, setCountriesError] = useState("");
  const [hideCountryQuery, setHideCountryQuery] = useState("");
  const [selectedHideCountryCode, setSelectedHideCountryCode] = useState("");
  const [hidePlaceQuery, setHidePlaceQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [guessCountryQuery, setGuessCountryQuery] = useState("");
  const [selectedGuessCountryCode, setSelectedGuessCountryCode] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const [seekInlineError, setSeekInlineError] = useState("");
  const [stageIntro, setStageIntro] = useState(null);

  const hideMapSessionRef = useRef(0);
  const seekMapSessionRef = useRef(0);
  const introTimeoutRef = useRef(null);
  const lastHideIntroKeyRef = useRef("");
  const lastSeekTurnIntroKeyRef = useRef("");
  const game = usePinnedDownGame(profile);
  const room = game.room;
  const lastLobbyCode = room?.code ?? "----";
  const selectedHideCountry = getCountryByCode(countries, selectedHideCountryCode);
  const selectedGuessCountry = getCountryByCode(countries, selectedGuessCountryCode);
  const hideCountryOptions = filterCountries(countries, hideCountryQuery);
  const guessCountryOptions = filterCountries(countries, guessCountryQuery);
  const placeSearch = usePlaceSearch(selectedHideCountry, hidePlaceQuery);

  useEffect(() => {
    let cancelled = false;

    fetchCountries()
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setCountries(payload);
      })
      .catch((error) => {
        if (!cancelled) {
          setCountriesError(error.message || "Could not load the online country list.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setHistory(getMatchHistory());
  }, [rankingsOpen, room?.phase, game.lastEvent]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    return () => {
      if (introTimeoutRef.current) {
        window.clearTimeout(introTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!room) {
      lastHideIntroKeyRef.current = "";
      lastSeekTurnIntroKeyRef.current = "";
      setStageIntro(null);
      return;
    }

    if (room.phase !== MATCH_PHASES.HIDE) {
      return;
    }

    const introKey = `${room.code}:${room.roundNumber}:hide`;
    if (lastHideIntroKeyRef.current === introKey) {
      return;
    }

    lastHideIntroKeyRef.current = introKey;
    setSelectedGuessCountryCode("");
    setGuessCountryQuery("");
    setSeekInlineError("");
    setSelectionError("");
    setStageIntro(createIntroPayload(introKey, "hide-phase", "Hide Phase", `ROUND ${room.roundNumber}`, "Conceal Your Position"));

    if (introTimeoutRef.current) {
      window.clearTimeout(introTimeoutRef.current);
    }

    introTimeoutRef.current = window.setTimeout(() => {
      setStageIntro((current) => (current?.key === introKey ? null : current));
    }, 1550);
  }, [room?.code, room?.roundNumber, room?.phase]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (room.phase !== MATCH_PHASES.SEEK || room.currentRound?.status !== "active-turn") {
      return;
    }

    const turnNumber = room.currentRound?.turnNumber ?? 1;
    const introKey = `${room.code}:${room.roundNumber}:seek:${turnNumber}`;
    if (lastSeekTurnIntroKeyRef.current === introKey) {
      return;
    }

    lastSeekTurnIntroKeyRef.current = introKey;
    setSelectedGuessCountryCode("");
    setGuessCountryQuery("");
    setSeekInlineError("");
    setSelectionError("");
    seekMapSessionRef.current += 1;

    const footer = turnNumber === 1 ? "First Guess Live" : "Reset and Reacquire";
    setStageIntro(createIntroPayload(introKey, "seek-turn", "Seek Turn", `ROUND ${turnNumber}`, footer));

    if (introTimeoutRef.current) {
      window.clearTimeout(introTimeoutRef.current);
    }

    introTimeoutRef.current = window.setTimeout(() => {
      setStageIntro((current) => (current?.key === introKey ? null : current));
    }, 1550);
  }, [room?.code, room?.roundNumber, room?.phase, room?.currentRound?.status, room?.currentRound?.turnNumber]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (room.phase === MATCH_PHASES.HIDE && !room.currentRound.localHide) {
      setSelectedPlace(null);
      setHidePlaceQuery("");
      setSelectionError("");
      hideMapSessionRef.current += 1;
    }

    if (room.currentRound.localHide) {
      setSelectedPlace(room.currentRound.localHide);
      setHidePlaceQuery(room.currentRound.localHide.name ?? room.currentRound.localHide.formattedAddress ?? "");
      setSelectedHideCountryCode(room.currentRound.localHide.countryCode ?? "");
      setHideCountryQuery("");
    }
  }, [room?.roundNumber, room?.phase, room?.currentRound?.localHide?.placeId]);

  const localScore = room?.localPlayer?.id ? room.cumulativeScores?.[room.localPlayer.id] ?? 0 : 0;
  const opponentScore = room?.opponent?.id ? room.cumulativeScores?.[room.opponent.id] ?? 0 : 0;
  const statusBanner = selectionError || game.errorMessage || countriesError || (game.isWaitingForOpponent ? room?.statusMessage : "");

  const handleSaveProfile = () => {
    saveProfile(draftProfile);
    setProfile(draftProfile);
    setSettingsOpen(false);
  };

  const handleCopyCode = async () => {
    if (!room?.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleSelectHideCountry = (country) => {
    setSelectedHideCountryCode(country.code);
    setHideCountryQuery("");
    setSelectedPlace(null);
    setHidePlaceQuery("");
    setSelectionError("");
  };

  const handleSelectGuessCountry = (country) => {
    setSelectedGuessCountryCode(country.code);
    setGuessCountryQuery("");
    setSelectionError("");
    setSeekInlineError("");
  };

  const handleApplyPickedPlace = (place) => {
    if (!place) {
      setSelectionError("Clicked Google place did not include enough location data.");
      return;
    }

    setSelectedHideCountryCode(place.countryCode);
    setHideCountryQuery("");
    setSelectedPlace(place);
    setHidePlaceQuery(place.name ?? place.formattedAddress ?? "");
    setSelectionError("");
  };

  const handlePlacePredictionSelect = async (prediction) => {
    try {
      const place = await placeSearch.selectPrediction(prediction);
      if (!place) {
        setSelectionError("Selected Google place did not match the chosen country.");
        return;
      }

      handleApplyPickedPlace(place);
    } catch (error) {
      setSelectionError(error.message || "Could not resolve the selected Google place.");
    }
  };

  const handleMapPlacePick = (place) => {
    handleApplyPickedPlace(place);
  };

  const handleSeekMapCountryPick = (countryCode) => {
    const country = getCountryByCode(countries, countryCode);
    if (!country) {
      setSeekInlineError("That map click did not match a loaded country.");
      return;
    }

    setSelectedGuessCountryCode(country.code);
    setGuessCountryQuery("");
    setSeekInlineError("");
    setSelectionError("");
  };

  const handleConfirmHideLocation = () => {
    if (!selectedPlace) {
      setSelectionError("Pick a Google place before locking the hiding location.");
      return;
    }

    setSelectionError("");
    game.lockLocation(selectedPlace);
  };

  const handleSubmitGuess = () => {
    if (!selectedGuessCountry) {
      setSeekInlineError("Choose a country before submitting a guess.");
      return;
    }

    setSelectionError("");
    setSeekInlineError("");
    game.submitGuess(selectedGuessCountry.code);
  };

  const hideMapCenter = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : selectedHideCountry
      ? { lat: selectedHideCountry.lat, lng: selectedHideCountry.lng }
      : { lat: 20, lng: 0 };
  const seekMapCenter = selectedGuessCountry
    ? { lat: selectedGuessCountry.lat, lng: selectedGuessCountry.lng }
    : { lat: 20, lng: 0 };
  const hideMapMarker = selectedPlace
    ? { position: { lat: selectedPlace.lat, lng: selectedPlace.lng }, title: selectedPlace.name }
    : selectedHideCountry
      ? { position: { lat: selectedHideCountry.lat, lng: selectedHideCountry.lng }, title: selectedHideCountry.name }
      : null;
  const seekMapMarker = selectedGuessCountry
    ? { position: { lat: selectedGuessCountry.lat, lng: selectedGuessCountry.lng }, title: selectedGuessCountry.name }
    : null;

  const result = room?.result ?? null;
  const memoizedHistory = useMemo(() => history, [history]);

  const renderScreen = () => {
    if (!room) {
      if (game.entryView === "join") {
        return (
          <JoinOperationScreen
            codeInput={game.joinCodeDraft}
            onBack={() => game.setEntryView("menu")}
            onCodeChange={(value) => game.setJoinCodeDraft(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))}
            onConnect={game.joinRoom}
            errorMessage={game.errorMessage}
            isBusy={game.isBusy}
          />
        );
      }

      return (
        <MainMenuScreen
          activeLobbyCode={lastLobbyCode}
          playerName={profile.displayName}
          connectionState={game.connectionState}
          onHost={game.createRoom}
          onJoin={() => game.setEntryView("join")}
          onOpenSettings={() => {
            setDraftProfile(profile);
            setSettingsOpen(true);
          }}
          onOpenRankings={() => setRankingsOpen(true)}
        />
      );
    }

    if (room.phase === MATCH_PHASES.LOBBY) {
      return (
        <HostLobbyScreen
          copied={copied}
          lobbyCode={room.code}
          localPlayer={room.localPlayer}
          opponent={room.opponent}
          statusMessage={room.statusMessage}
          roundNumber={room.roundNumber}
          canStart={game.canStartRound}
          isBusy={game.isBusy}
          onBack={game.disconnect}
          onCopyCode={handleCopyCode}
          onStartRound={game.startRound}
        />
      );
    }

    if (room.phase === MATCH_PHASES.HIDE) {
      return (
        <HidingScreen
          localPlayer={room.localPlayer}
          opponent={room.opponent}
          countryQuery={hideCountryQuery}
          selectedCountry={selectedHideCountry}
          countryOptions={hideCountryOptions}
          placeQuery={hidePlaceQuery}
          selectedPlace={selectedPlace}
          placePredictions={placeSearch.predictions}
          placeSearchBusy={placeSearch.loading}
          placeSearchError={placeSearch.error}
          mapCenter={hideMapCenter}
          mapMarker={hideMapMarker}
          mapSessionKey={hideMapSessionRef.current}
          isLocked={game.localHideLocked}
          isBusy={game.isBusy}
          statusMessage={room.statusMessage}
          opponentHideLocked={game.opponentHideLocked}
          onBack={game.disconnect}
          onCountryQueryChange={setHideCountryQuery}
          onSelectCountry={handleSelectHideCountry}
          onPlaceQueryChange={setHidePlaceQuery}
          onSelectPrediction={handlePlacePredictionSelect}
          onMapPlacePick={handleMapPlacePick}
          onMapError={setSelectionError}
          onConfirm={handleConfirmHideLocation}
        />
      );
    }

    if (room.phase === MATCH_PHASES.SEEK) {
      return (
        <SeekingScreen
          localPlayer={room.localPlayer}
          opponent={room.opponent}
          countryQuery={guessCountryQuery}
          selectedCountry={selectedGuessCountry}
          countryOptions={guessCountryOptions}
          onBack={game.disconnect}
          onCountryQueryChange={(value) => {
            setGuessCountryQuery(value);
            setSeekInlineError("");
          }}
          onSelectCountry={handleSelectGuessCountry}
          onSubmitGuess={handleSubmitGuess}
          onMapCountryPick={handleSeekMapCountryPick}
          onMapError={setSeekInlineError}
          mapCenter={seekMapCenter}
          mapMarker={seekMapMarker}
          mapSessionKey={seekMapSessionRef.current}
          revealedHintImages={room.currentRound.revealedHintImages ?? []}
          totalHintCount={room.currentRound.totalHintCount ?? 4}
          guessHistory={room.currentRound.localGuesses ?? []}
          waitingForTurnResolution={game.isWaitingForTurnResolution}
          localSubmittedGuess={game.localSubmittedGuess}
          opponentSubmittedGuess={game.opponentSubmittedGuess}
          localCompleted={game.localCompleted}
          opponentCompleted={game.opponentCompleted}
          isBusy={game.isBusy}
          statusMessage={room.statusMessage}
          currentScore={localScore}
          turnNumber={room.currentRound.turnNumber ?? 1}
          inlineError={seekInlineError}
          turnIntroActive={stageIntro?.kind === "seek-turn"}
        />
      );
    }

    return (
      <VictoryScreen
        localPlayer={room.localPlayer}
        opponent={room.opponent}
        localScore={localScore}
        opponentScore={opponentScore}
        result={result}
        onDisconnect={game.disconnect}
        onRematch={game.voteRematch}
        rematchPending={Boolean(room.rematchVotes?.includes(room.localPlayer?.id))}
        isBusy={game.isBusy}
      />
    );
  };

  return (
    <div className="storyboard-shell">
      {stageIntro && (
        <div className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[#020407]/38 backdrop-blur-[3px]" />
          <div className="absolute h-[42rem] w-[42rem] rounded-full bg-red-500/24 blur-3xl animate-pulse" />
          <div className="absolute h-[28rem] w-[28rem] rounded-full border-2 border-red-200/40 animate-[ping_1400ms_cubic-bezier(0,0,0.2,1)_1]" />
          <div className="absolute h-[54rem] w-[54rem] bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_62%)] opacity-90" />
          <div className="relative text-center text-white drop-shadow-[0_0_36px_rgba(255,255,255,0.32)] animate-[pulse_820ms_ease-in-out_2]">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.75em] text-red-200/92 sm:text-[13px]">
              {stageIntro.eyebrow}
            </div>
            <div className="mt-4 text-6xl font-black uppercase italic tracking-[0.24em] text-white sm:text-8xl lg:text-[10rem]">
              {stageIntro.title}
            </div>
            <div className="mt-4 text-sm font-bold uppercase tracking-[0.55em] text-white/74 sm:text-base">
              {stageIntro.footer}
            </div>
          </div>
        </div>
      )}

      {statusBanner && (
        <div className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 py-4">
          <div className="flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-red-500/24 bg-[#0b1118]/88 px-4 py-3 text-sm text-white/84 shadow-2xl backdrop-blur-xl">
            {selectionError || game.errorMessage || countriesError ? <AlertTriangle size={16} className="text-red-300" /> : <Radio size={16} className="text-emerald-300" />}
            <span>{statusBanner}</span>
          </div>
        </div>
      )}

      {renderScreen()}

      <SettingsModal
        open={settingsOpen}
        draft={draftProfile}
        onChange={setDraftProfile}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveProfile}
      />

      <RankingsModal
        open={rankingsOpen}
        history={memoizedHistory}
        onClose={() => setRankingsOpen(false)}
      />
    </div>
  );
}
