import type { GameAssets } from "@/games/types";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | undefined) => {
  if (!date) return "";

  if (!(date instanceof Date)) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    date = parsed;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getRandomItem = <T>(items: T[]): T | null => {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};

const date = Date.now();
const toAssetUrl = (path: string) => `${convertFileSrc(path)}?v=${date}`;

export const getGameAssets = async (gameId: string): Promise<GameAssets> => {
  const assets = await invoke<GameAssets>("get_game_assets", { gameId });

  return {
    assetsFolder: assets.assetsFolder,
    backgrounds: assets.backgrounds.map(toAssetUrl),
    favicon: toAssetUrl(assets.favicon),
    logo: toAssetUrl(assets.logo),
    mainBackground: toAssetUrl(assets.mainBackground),
    featuredBackground: assets.featuredBackground ? toAssetUrl(assets.featuredBackground) : undefined,
  };
};

export const formatHms = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};
