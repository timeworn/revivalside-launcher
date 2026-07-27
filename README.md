# RevivalSide Launcher

This is the React 19 + Tauri 2 desktop launcher shared by RevivalSide and its supported games. The RevivalSide integration replaces its placeholder actions with the complete local runtime workflow while preserving the multi-game launcher structure.

The launcher includes:

- listener start/stop with real-time logs and process-tree cleanup;
- frozen-client creation, patching, routing audit, Steam isolation, and direct launch;
- CounterSide detection and manual DLL selection;
- gameplay, wiki image, and cutscene background cache controls;
- User Manager and wiki launch controls;
- live Wireshark/Npcap Cross Save capture, extraction, import, export, and clipboard copy;
- server-time, ports, event, lobby ACK, tutorial, LAN, logging, and advanced environment settings;
- system tray behavior and unexpected-service notifications.

From this directory:

```powershell
corepack pnpm install
corepack pnpm build
corepack pnpm tauri build --no-bundle
```

The RevivalSide process bridge searches for `tools/revivalside-launcher-backend.js` in the surrounding application payload; it does not duplicate the game server itself. When this repository is checked out as RevivalSide's `launcher` submodule, the parent repository's `npm run build:launcher` command is the supported release build entry point.
