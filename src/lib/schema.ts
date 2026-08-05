import { z } from "zod";

export const CLOSE_WINDOW_OPTIONS = ["tray", "tray_on_start", "exit"] as const;

export const settingsSchema = z.object({
  activeGameId: z.string().nullable().default(null),
  closeWindow: z.enum(CLOSE_WINDOW_OPTIONS).default("tray"),
});

export const LOBBY_ACK_OPTIONS = ["auto", "on", "off"] as const;
