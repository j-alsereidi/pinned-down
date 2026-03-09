import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clapperboard,
} from "lucide-react";
import { MainMenuScreen } from "../mainmenu.jsx";
import { HostLobbyScreen } from "../host.jsx";
import { JoinOperationScreen } from "../join.jsx";
import { HidingScreen } from "../hide.jsx";
import { SeekingScreen } from "../seek.jsx";
import { VictoryScreen } from "../victory.jsx";

const DEFAULT_LOBBY_CODE = "4A9X";

const STORYBOARD_SCREENS = [
  {
    id: "menu",
    label: "Main Menu",
    note: "Entry point for hosting or joining the prototype.",
  },
  {
    id: "host",
    label: "Host",
    note: "Lobby setup and code-sharing screen.",
  },
  {
    id: "join",
    label: "Join",
    note: "Code entry and connection screen.",
  },
  {
    id: "hide",
    label: "Hide",
    note: "Location selection storyboard frame.",
  },
  {
    id: "seek",
    label: "Seek",
    note: "Hunter intel and targeting view.",
  },
  {
    id: "victory",
    label: "Victory",
    note: "Match results and replay prompt.",
  },
];

const HIDE_OPTIONS = [
  {
    country: "Japan",
    subtitle: "Tokyo, Japan",
    coordinates: "35.6852 deg N, 139.7100 deg E",
    distance: "SELECTED",
    type: "Park / Landmark",
    difficulty: "Medium",
    venue: "Shinjuku Gyoen National Garden",
  },
  {
    country: "Jamaica",
    subtitle: "Kingston, Jamaica",
    coordinates: "18.0179 deg N, 76.8099 deg W",
    distance: "11,293 km",
    type: "Coastal Capital",
    difficulty: "Hard",
    venue: "Harbourfront District",
  },
  {
    country: "Jordan",
    subtitle: "Amman, Jordan",
    coordinates: "31.9539 deg N, 35.9106 deg E",
    distance: "8,450 km",
    type: "Historic City",
    difficulty: "Medium",
    venue: "Citadel Overlook",
  },
  {
    country: "Azerbaijan",
    subtitle: "Baku, Azerbaijan",
    coordinates: "40.4093 deg N, 49.8671 deg E",
    distance: "7,120 km",
    type: "Urban Coastline",
    difficulty: "Hard",
    venue: "Old City District",
  },
];

const SEEK_OPTIONS = [
  "Japan",
  "South Korea",
  "China",
  "Thailand",
  "Australia",
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState(DEFAULT_LOBBY_CODE);
  const [hideQuery, setHideQuery] = useState("Ja");
  const [selectedHideCountry, setSelectedHideCountry] = useState("Japan");
  const [selectedSeekCountry, setSelectedSeekCountry] = useState("Japan");
  const [isNavMinimized, setIsNavMinimized] = useState(false);

  const activeScreenIndex = STORYBOARD_SCREENS.findIndex(
    (screen) => screen.id === currentScreen,
  );
  const activeScreen = STORYBOARD_SCREENS[activeScreenIndex];
  const filteredHideOptions = HIDE_OPTIONS.filter((option) =>
    option.country.toLowerCase().includes(hideQuery.trim().toLowerCase()),
  );
  const selectedHideOption =
    HIDE_OPTIONS.find((option) => option.country === selectedHideCountry) ??
    HIDE_OPTIONS[0];

  const goTo = (screenId) => setCurrentScreen(screenId);

  const goRelative = (direction) => {
    const totalScreens = STORYBOARD_SCREENS.length;
    const nextIndex = (activeScreenIndex + direction + totalScreens) % totalScreens;
    setCurrentScreen(STORYBOARD_SCREENS[nextIndex].id);
  };

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      if (event.key === "ArrowRight") {
        goRelative(1);
      }

      if (event.key === "ArrowLeft") {
        goRelative(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScreenIndex]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_LOBBY_CODE);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleJoinCodeChange = (value) => {
    setJoinCode(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4));
  };

  const handleHideQueryChange = (value) => {
    setHideQuery(value);
    const matchingOption = HIDE_OPTIONS.find((option) =>
      option.country.toLowerCase().startsWith(value.trim().toLowerCase()),
    );

    if (matchingOption) {
      setSelectedHideCountry(matchingOption.country);
    }
  };

  const handleSelectHideCountry = (country) => {
    setSelectedHideCountry(country);
    setHideQuery(country);
  };

  return (
    <div className="storyboard-shell">
      <div className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-black/75 px-4 py-4 shadow-2xl backdrop-blur-2xl sm:px-6 transition-all duration-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-600/10 text-red-400">
                <Clapperboard size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
                  Pinned Down
                </div>
                <div className="text-sm font-semibold text-white/70">
                  Clickable storyboard build
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.25em]">
                  {activeScreen.label}
                </span>
                {!isNavMinimized && (
                  <span className="hidden sm:inline">{activeScreen.note}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsNavMinimized((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {isNavMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                {isNavMinimized ? "Expand" : "Minimize"}
              </button>
            </div>
          </div>

          {!isNavMinimized && (
            <>
              <div className="flex flex-wrap gap-2">
                {STORYBOARD_SCREENS.map((screen, index) => (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => goTo(screen.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      screen.id === currentScreen
                        ? "border-red-500/60 bg-red-600 text-white shadow-[0_0_25px_-10px_rgba(220,38,38,0.9)]"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="mr-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {screen.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goRelative(-1)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <div className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Use the rail or arrow keys to move through the flow
                </div>

                <button
                  type="button"
                  onClick={() => goRelative(1)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={isNavMinimized ? "pt-[6.75rem] sm:pt-[6.25rem]" : "pt-[14.5rem] sm:pt-[13rem]"}>
        {currentScreen === "menu" && (
          <MainMenuScreen
            activeLobbyCode={DEFAULT_LOBBY_CODE}
            onHost={() => goTo("host")}
            onJoin={() => goTo("join")}
          />
        )}

        {currentScreen === "host" && (
          <HostLobbyScreen
            copied={copied}
            lobbyCode={DEFAULT_LOBBY_CODE}
            onBack={() => goTo("menu")}
            onCopyCode={handleCopyCode}
            onGoHide={() => goTo("hide")}
            onGoJoin={() => goTo("join")}
          />
        )}

        {currentScreen === "join" && (
          <JoinOperationScreen
            codeInput={joinCode}
            lobbyCode={DEFAULT_LOBBY_CODE}
            onBack={() => goTo("menu")}
            onCodeChange={handleJoinCodeChange}
            onConnect={() => goTo("seek")}
          />
        )}

        {currentScreen === "hide" && (
          <HidingScreen
            options={filteredHideOptions.length > 0 ? filteredHideOptions : HIDE_OPTIONS}
            searchValue={hideQuery}
            selectedLocation={selectedHideOption}
            onBack={() => goTo("host")}
            onContinue={() => goTo("seek")}
            onSearchChange={handleHideQueryChange}
            onSelectLocation={handleSelectHideCountry}
          />
        )}

        {currentScreen === "seek" && (
          <SeekingScreen
            guessOptions={SEEK_OPTIONS}
            selectedCountry={selectedSeekCountry}
            onBack={() => goTo("hide")}
            onContinue={() => goTo("victory")}
            onSelectCountry={setSelectedSeekCountry}
          />
        )}

        {currentScreen === "victory" && (
          <VictoryScreen
            onDisconnect={() => goTo("menu")}
            onRematch={() => goTo("menu")}
          />
        )}
      </div>
    </div>
  );
}