import type { GameAssets } from "@/games/types";
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

const allMainBgs = import.meta.glob("@/assets/*/main.{webp,png,jpg,jpeg,avif}", { eager: true, import: "default" });
const allFeaturedBgs = import.meta.glob("@/assets/*/featured.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  import: "default",
});
const allBgs = import.meta.glob("@/assets/*/bg/**/*.{webp,png,jpg,jpeg,avif}", { eager: true, import: "default" });
const allFavicons = import.meta.glob("@/assets/*/favicon.{webp,png,jpg,jpeg,avif}", { eager: true, import: "default" });
const allLogos = import.meta.glob("@/assets/*/logo.{webp,png,jpg,jpeg,avif}", { eager: true, import: "default" });

export const getGameAssets = (gameId: string): GameAssets => {
  const mainBackground = Object.entries(allMainBgs).find(([path]) =>
    path.includes(`/assets/${gameId}/main`),
  )?.[1] as string;
  const featuredBackground = Object.entries(allFeaturedBgs).find(([path]) =>
    path.includes(`/assets/${gameId}/featured`),
  )?.[1] as string;
  const backgrounds = Object.entries(allBgs)
    .filter(([path]) => path.includes(`/assets/${gameId}/bg/`))
    .map(([, url]) => url as string);

  console.log(mainBackground, allMainBgs, allFeaturedBgs, gameId);

  const favicon = Object.entries(allFavicons).find(([path]) => path.includes(`/assets/${gameId}/`))?.[1] as string;
  const logo = Object.entries(allLogos).find(([path]) => path.includes(`/assets/${gameId}/`))?.[1] as string;

  return { backgrounds, favicon, logo, mainBackground, featuredBackground };
};
