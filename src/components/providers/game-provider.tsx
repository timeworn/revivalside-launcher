import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import type { GameConfig } from "@/games/types";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [activeGame, setActiveGameState] = useState<GameConfig | null>(null);
  const [hoveredGame, setHoveredGameState] = useState<GameConfig | null>(null);
  const restoredRef = useRef(false);

  const setHoveredGame = useCallback((game: GameConfig | null) => {
    setHoveredGameState(game);
  }, []);

  useEffect(() => {
    if (loading || restoredRef.current) return;
    restoredRef.current = true;

    const found = settings.activeGameId ? (games.find((game) => game.id === settings.activeGameId) ?? null) : null;
    setActiveGameState(found);
    navigate(found ? `/${found.id}` : "/");
  }, [loading, settings.activeGameId, games, navigate]);

  useEffect(() => {
    if (!restoredRef.current) return;

    if (location.pathname === "/") {
      setActiveGameState(null);
      return;
    }

    const pathGameId = location.pathname.split("/")[1];
    const found = games.find((game) => game.id === pathGameId) ?? null;
    if (found && found !== activeGame) {
      setActiveGameState(found);
    }
  }, [location.pathname, games]);

  useEffect(() => {
    if (!restoredRef.current) return;
    setSetting("activeGameId", activeGame?.id ?? null);
  }, [activeGame]);

  return (
    <GameContext.Provider value={{ games, activeGame, setHoveredGame, hoveredGame }}>{children}</GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within <GameProvider>");
  return ctx;
};
