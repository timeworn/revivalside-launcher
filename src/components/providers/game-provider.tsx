import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import type { GameConfig } from "@/games/types";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { refreshGameAssets } from "@/lib/utils";

interface GameContext {
  games: GameConfig[];
  activeGame: GameConfig | null;
  hoveredGame: GameConfig | null;
  setHoveredGame: (game: GameConfig | null) => void;
}

const GameContext = createContext<GameContext | null>(null);

export const GameProvider = ({ games, children }: { games: GameConfig[]; children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, setSetting, loading } = useSettings();
  const [runtimeGames, setRuntimeGames] = useState<GameConfig[]>(games);
  const [activeGame, setActiveGameState] = useState<GameConfig | null>(null);
  const [hoveredGame, setHoveredGameState] = useState<GameConfig | null>(null);
  const restoredRef = useRef(false);
  const refreshingAssetsRef = useRef(false);

  const setHoveredGame = useCallback((game: GameConfig | null) => {
    setHoveredGameState(game);
  }, []);

  useEffect(() => {
    setRuntimeGames(games);
  }, [games]);

  useEffect(() => {
    let disposed = false;
    let unlisten: (() => void) | undefined;

    const refreshAssets = async () => {
      if (refreshingAssetsRef.current) return;
      refreshingAssetsRef.current = true;

      try {
        const refreshed = await Promise.all(
          games.map(async (game) => {
            if (!game.assets) return null;
            try {
              return await refreshGameAssets(game.id);
            } catch (error) {
              console.error(`Could not refresh assets for ${game.id}:`, error);
              return null;
            }
          }),
        );
        if (disposed) return;

        const refreshedById = new Map(games.map((game, i) => [game.id, refreshed[i]]));
        const patch = (game: GameConfig | null) => {
          const r = game && refreshedById.get(game.id);
          return r && r.revision !== game!.assets?.revision ? { ...game!, assets: r } : game;
        };

        setRuntimeGames((current) => current.map((game) => patch(game) ?? game));
        setActiveGameState(patch);
        setHoveredGameState(patch);
      } finally {
        refreshingAssetsRef.current = false;
      }
    };

    getCurrentWindow()
      .onFocusChanged(({ payload: focused }) => {
        if (focused) void refreshAssets();
      })
      .then((stopListening) => {
        if (disposed) stopListening();
        else unlisten = stopListening;
      })
      .catch((error) => console.error("Could not listen for launcher changes:", error));

    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [games]);

  useEffect(() => {
    if (loading || restoredRef.current) return;
    restoredRef.current = true;

    const found = settings.activeGameId
      ? (runtimeGames.find((game) => game.id === settings.activeGameId) ?? null)
      : null;
    setActiveGameState(found);
    navigate(found ? `/${found.id}` : "/");
  }, [loading, settings.activeGameId, runtimeGames, navigate]);

  useEffect(() => {
    if (!restoredRef.current) return;

    if (location.pathname === "/") {
      setActiveGameState(null);
      return;
    }

    const pathGameId = location.pathname.split("/")[1];
    const found = runtimeGames.find((game) => game.id === pathGameId) ?? null;
    if (found && found !== activeGame) {
      setActiveGameState(found);
    }
  }, [location.pathname, runtimeGames]);

  useEffect(() => {
    if (!restoredRef.current) return;
    setSetting("activeGameId", activeGame?.id ?? null);
  }, [activeGame]);

  return (
    <GameContext.Provider value={{ games: runtimeGames, activeGame, setHoveredGame, hoveredGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within <GameProvider>");
  return ctx;
};
