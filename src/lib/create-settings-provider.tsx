import { load, type Store } from "@tauri-apps/plugin-store";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { z, ZodObject, ZodRawShape } from "zod/v4";

interface SettingsContext<T> {
  settings: T;
  setSetting: <K extends keyof T>(key: K, value: T[K]) => Promise<void>;
  saveSettings: () => Promise<void>;
  loading: boolean;
}

export const createSettingsProvider = <TShape extends ZodRawShape>(schema: ZodObject<TShape>, storeFile: string) => {
  type Settings = z.infer<typeof schema>;

  const defaults = schema.parse({}) as Settings;
  const Context = createContext<SettingsContext<Settings> | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaults);
    const [loading, setLoading] = useState(true);
    const storeRef = useRef<Store | null>(null);

    const getStore = useCallback(async (): Promise<Store> => {
      if (storeRef.current) return storeRef.current;
      const store = await load(storeFile, { defaults, autoSave: true });
      storeRef.current = store;
      return store;
    }, []);

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

    useEffect(() => {
      getStore().then(async (store) => {
        const saved = await store.get<Settings>("settings");
        if (saved) setSettings({ ...defaults, ...saved });
        setLoading(false);
      });
    }, [getStore]);

    return <Context.Provider value={{ settings, setSetting, saveSettings, loading }}>{children}</Context.Provider>;
  };

  const useSettings = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`useSettings must be used within its Provider (store: ${storeFile})`);
    return ctx;
  };

  return { Provider, useSettings };
};
