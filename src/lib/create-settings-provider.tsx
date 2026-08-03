import { load, type Store } from "@tauri-apps/plugin-store";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { z, ZodObject, ZodRawShape } from "zod/v4";

interface SettingsContext<TOutput, TInput> {
  settings: TOutput;
  setSetting: <K extends keyof TInput>(key: K, value: TInput[K]) => Promise<void>;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

export const createSettingsProvider = <TShape extends ZodRawShape>(schema: ZodObject<TShape>, storeFile: string) => {
  type Settings = z.output<typeof schema>;
  type SettingsInput = z.input<typeof schema>;

  const defaults = schema.parse({}) as Settings;

  const Context = createContext<SettingsContext<Settings, SettingsInput> | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaults);
    const [loading, setLoading] = useState(true);
    const storeRef = useRef<Store | null>(null);
    const settingsRef = useRef(settings);
    settingsRef.current = settings;

    const getStore = useCallback(async (): Promise<Store> => {
      if (storeRef.current) return storeRef.current;
      const store = await load(storeFile);
      storeRef.current = store;
      return store;
    }, []);

    const setSetting = useCallback(
      async <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => {
        const next = schema.parse({ ...settingsRef.current, [key]: value }) as Settings;
        settingsRef.current = next;
        setSettings(next);

        const store = await getStore();
        await store.set(key as string, next[key as unknown as keyof Settings]);
        await store.save();
      },
      [settings, getStore],
    );

    const saveSettings = useCallback(async () => {
      try {
        const store = await getStore();
        for (const [key, value] of Object.entries(settings)) {
          await store.set(key, value);
        }
        await store.save();
        return true;
      } catch (error) {
        console.error("Error saving settings:", error);
        return false;
      }
    }, [settings, getStore]);

    const resetSettings = useCallback(async () => {
      const store = await getStore();
      await store.reset();
      settingsRef.current = defaults;
      setSettings(defaults);
    }, [getStore]);

    useEffect(() => {
      let mounted = true;
      getStore()
        .then(async (store) => {
          const saved = await store.entries();
          const parsed = schema.parse(Object.fromEntries(saved)) as Settings;
          if (!mounted) return;
          settingsRef.current = parsed;
          setSettings(parsed);
        })
        .catch((error) => console.error("Error loading settings:", error))
        .finally(() => {
          if (mounted) setLoading(false);
        });
      return () => {
        mounted = false;
      };
    }, [getStore]);

    return (
      <Context.Provider value={{ settings, setSetting, saveSettings, loading, resetSettings }}>
        {children}
      </Context.Provider>
    );
  };

  const useSettings = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`useSettings must be used within its Provider (store: ${storeFile})`);
    return ctx;
  };

  return { Provider, useSettings };
};
