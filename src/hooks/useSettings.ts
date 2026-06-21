import { settingsSchema, type Settings } from "@/lib/schema";
import { load, type Store } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";

const DEFAULTS = settingsSchema.parse({});

let storePromise: Promise<Store> | null = null;
const getStore = () => {
  if (!storePromise) storePromise = load("settings.json", { defaults: {}, autoSave: true });
  return storePromise;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStore().then(async (store) => {
      const saved = await store.get<Settings>("settings");
      if (saved) setSettings({ ...DEFAULTS, ...saved });
      setLoading(false);
    });
  }, []);

  const setSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    const store = await getStore();
    await store.set("settings", next);
  };

  const saveSettings = async () => {
    const store = await getStore();
    await store.set("settings", settings);
  };

  return { settings, setSetting, saveSettings, loading };
};
