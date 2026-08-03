import { z } from "zod";

export const CLOSE_WINDOW_OPTIONS = ["tray", "tray_on_start", "exit"] as const;

export const settingsSchema = z.object({
  activeGameId: z.string().nullable().default(null),
  closeWindow: z.enum(CLOSE_WINDOW_OPTIONS).default("tray"),
});

export const LOBBY_ACK_OPTIONS = ["auto", "on", "off"] as const;

export const revivalSideSettingsSchema = z.object({
  advancedEnvironment: z.string().default(""),
  allowLanAccess: z.boolean().default(false),
  capturePath: z.string().default(""),
  clientPath: z.string().default(""),
  sourceClientPath: z.string().default(""),
  tcpPort: z.int().min(1).max(65535).default(22000),
  eventDate: z.string().default("2025-04-10"),
  httpPort: z.int().min(1).max(65535).default(8088),
  keepOfficialFriendCode: z.boolean().default(false),
  keepOfficialUid: z.boolean().default(false),
  lobbyAck: z.enum(LOBBY_ACK_OPTIONS).default("auto"),
  notifyServiceStops: z.boolean().default(true),
  replayCapturedGameFlow: z.boolean().default(false),
  resetTutorialOnLogin: z.boolean().default(false),
  serverTime: z.date().default(new Date()),
  skipTutorial: z.boolean().default(false),
  switchToImportedSave: z.boolean().default(true),
  updateMatchingImport: z.boolean().default(true),
  verboseLogging: z.boolean().default(false),
  wikiPort: z.int().min(1).max(65535).default(5174),
});
