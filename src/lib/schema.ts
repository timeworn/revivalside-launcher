import { z } from "zod";

export const LOBBY_ACK_OPTIONS = ["auto", "on", "off"] as const;
export const CLOSE_WINDOW_OPTIONS = ["tray", "tray_on_start", "exit"] as const;

export const settingsSchema = z.object({
  capturePath: z.string().default(""),
  switchToImportedSave: z.boolean().default(true),
  updateMatchingImport: z.boolean().default(true),
  keepOfficialUid: z.boolean().default(false),
  keepOfficialFriendCode: z.boolean().default(false),

  clientPath: z.string().default(""),
  closeWindow: z.enum(CLOSE_WINDOW_OPTIONS).default("tray"),
  tcpPort: z.int().min(1).max(65535).default(22000),
  httpPort: z.int().min(1).max(65535).default(8088),
  wikiPort: z.int().min(1).max(65535).default(5174),
  eventDate: z.date().default(new Date("2025-04-10")),
  lobbyAck: z.enum(LOBBY_ACK_OPTIONS).default("auto"),
  allowLanAccess: z.boolean().default(false),
  verboseLogging: z.boolean().default(false),
  replayCapturedGameFlow: z.boolean().default(false),
  skipTutorial: z.boolean().default(false),
  resetTutorialOnLogin: z.boolean().default(false),
  serverTime: z.date().default(new Date()),
});

export type Settings = z.infer<typeof settingsSchema>;
