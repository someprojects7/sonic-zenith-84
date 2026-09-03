import { MapPin, User } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

/** Brand row: scrolls away, so it holds identity and settings only — no navigation. */
export function AppHeader({
  hidden,
  profileActive,
  onProfileClick,
}: {
  hidden: boolean;
  profileActive: boolean;
  onProfileClick: () => void;
}) {
  return (
    <header
      className={cn(
        "px-5 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))] transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-[3px]">
            <h1 className="truncate text-[24px] font-bold uppercase leading-none tracking-[0.1em] text-foreground">
              Sponsa
            </h1>
            <span className="size-[5px] shrink-0 rounded-full bg-brand" aria-hidden />
          </div>
          <p className="mt-2 flex items-center gap-1 text-[13px] leading-4 text-muted-foreground">
            <MapPin className="size-[13px] shrink-0 text-brand" aria-hidden />
            <span className="truncate">Vilnius · your city shortcut</span>
          </p>
        </div>

        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-11 ring-1 ring-hairline",
            profileActive
              ? "bg-brand text-brand-foreground"
              : "bg-surface-2/80 text-foreground/70 hover:bg-surface-3",
          )}
        >
          <User className="size-[19px]" />
        </button>
      </div>
    </header>
  );
}
