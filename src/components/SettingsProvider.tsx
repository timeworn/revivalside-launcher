import { settingsSchema, type Settings } from "@/lib/schema";
import { load, type Store } from "@tauri-apps/plugin-store";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const DEFAULTS = settingsSchema.parse({});

type SettingsContext = {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K] | undefined) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContext | null>(null);

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

  const setSetting = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K] | undefined) => {
      const patch = value === undefined ? {} : { [key]: value };
      const next = settingsSchema.parse({ ...settings, ...patch });
      setSettings(next);

      const store = await getStore();
      await store.set("settings", next);
    },
    [settings, getStore],
  );

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULTS);
    const store = await getStore();
    await store.reset();
  }, [getStore]);

  useEffect(() => {
    const loadSettings = async () => {
      const store = await getStore();
      const saved = await store.get<Partial<Settings>>("settings");
      const parsed = settingsSchema.parse({ ...DEFAULTS, ...(saved ?? {}) });
      setSettings(parsed);
      setLoading(false);
    };

    loadSettings();
  }, [getStore]);

  return (
    <SettingsContext.Provider value={{ settings, setSetting, resetSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
};
