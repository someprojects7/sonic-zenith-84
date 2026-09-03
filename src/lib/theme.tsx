import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* Daytime window: light theme from 07:00 to 19:00 local time, dark otherwise */
const DAY_START = 7;
const DAY_END = 19;

export function isDaytime(date = new Date()) {
  const h = date.getHours();
  return h >= DAY_START && h < DAY_END;
}

function apply(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#141416" : "#fbfaf9");
}

const ThemeContext = createContext<{ theme: "light" | "dark" }>({ theme: "dark" });

/** Theme follows local time only — no manual override. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const tick = () => {
      const resolved = isDaytime() ? "light" : "dark";
      setTheme(resolved);
      apply(resolved);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
