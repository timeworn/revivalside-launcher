import { createContext, useContext, useState, type ReactNode } from "react";

type LauncherStateContext = {
  isServerRunning: boolean;
  setIsServerRunning: (running: boolean) => void;
};

const LauncherStateContext = createContext<LauncherStateContext | null>(null);

export const LauncherStateProvider = ({ children }: { children: ReactNode }) => {
  const [isServerRunning, setIsServerRunning] = useState(false);

  return (
    <LauncherStateContext.Provider value={{ isServerRunning, setIsServerRunning }}>
      {children}
    </LauncherStateContext.Provider>
  );
};

export const useLauncherState = () => {
  const ctx = useContext(LauncherStateContext);
  if (!ctx) throw new Error("useLauncherState must be used within <LauncherStateProvider>");
  return ctx;
};
