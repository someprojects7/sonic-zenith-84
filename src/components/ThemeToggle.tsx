import { Moon, Sun, SunMoon } from "lucide-react";

import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const labels = {
  auto: "Theme: auto (light by day, dark at night)",
  light: "Theme: light",
  dark: "Theme: dark",
} as const;

/** 44px tap target that cycles auto → light → dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, cycleMode } = useTheme();
  const Icon = mode === "auto" ? SunMoon : mode === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={labels[mode]}
      title={labels[mode]}
      className={cn(
        "icon-button size-11 text-muted-foreground hover:bg-surface-2",
        mode !== "auto" && "text-brand",
        className,
      )}
    >
      <Icon className="size-[19px]" />
    </button>
  );
}
