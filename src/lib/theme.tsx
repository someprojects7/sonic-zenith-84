import { useEffect, type ReactNode } from "react";

/** Daytime window: light theme from 07:00 to 19:00 local time, dark otherwise. */
const DAY_START = 7;
const DAY_END = 19;

function apply(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#141416" : "#fbfaf9");
}

/** Theme follows local time only, with no manual override. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const tick = () => {
      const hour = new Date().getHours();
      apply(hour >= DAY_START && hour < DAY_END ? "light" : "dark");
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return <>{children}</>;
}
