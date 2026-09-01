import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "auto" | "light" | "dark";

const STORAGE_KEY = "sponsa-theme";
/* Daytime window: light theme from 07:00 to 19:00 local time, dark otherwise */
const DAY_START = 7;
const DAY_END = 19;

export function isDaytime(date = new Date()) {
  const h = date.getHours();
  return h >= DAY_START && h < DAY_END;
}

function resolve(mode: ThemeMode): "light" | "dark" {
  if (mode === "auto") return isDaytime() ? "light" : "dark";
  return mode;
}

function apply(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#141416" : "#fbfaf9");
}

type ThemeContextValue = {
  mode: ThemeMode;
  theme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "auto",
  theme: "dark",
  setMode: () => {},
  cycleMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Read the stored preference after hydration so SSR markup stays stable
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const next: ThemeMode = stored === "light" || stored === "dark" ? stored : "auto";
    setModeState(next);
    const resolved = resolve(next);
    setTheme(resolved);
    apply(resolved);
  }, []);

  // In auto mode, keep checking so the theme flips at sunrise/sunset boundaries
  useEffect(() => {
    if (mode !== "auto") return;
    const tick = () => {
      const resolved = resolve("auto");
      setTheme(resolved);
      apply(resolved);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (next === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
    const resolved = resolve(next);
    setTheme(resolved);
    apply(resolved);
  }, []);

  const cycleMode = useCallback(() => {
    setMode(mode === "auto" ? "light" : mode === "light" ? "dark" : "auto");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, theme, setMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
