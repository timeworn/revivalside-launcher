import { settingsSchema, type Settings } from "@/lib/schema";
import { load, type Store } from "@tauri-apps/plugin-store";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const DEFAULTS = settingsSchema.parse({});

type SettingsContextValue = {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  saveSettings: () => Promise<void>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<Store | null>(null);

  const getStore = useCallback(async (): Promise<Store> => {
    if (storeRef.current) return storeRef.current;
    const store = await load("settings.json", { defaults: DEFAULTS, autoSave: true });
    storeRef.current = store;
    return store;
  }, []);

  useEffect(() => {
    getStore().then(async (store) => {
      const saved = await store.get<Settings>("settings");
      if (saved) setSettings({ ...DEFAULTS, ...saved });
      setLoading(false);
    });
  }, [getStore]);

  const setSetting = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      const next = { ...settings, [key]: value };
      setSettings(next);
      const store = await getStore();
      await store.set("settings", next);
    },
    [settings, getStore],
  );

  const saveSettings = useCallback(async () => {
    const store = await getStore();
    await store.set("settings", settings);
    await store.save();
  }, [settings, getStore]);

  return (
    <SettingsContext.Provider value={{ settings, setSetting, saveSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
};
