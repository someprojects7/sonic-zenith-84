import { MapPin, User } from "lucide-react";


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
        "bg-background/80 px-5 pb-3 pt-[calc(0.9rem+env(safe-area-inset-top))] backdrop-blur-xl transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="truncate text-[19px] uppercase leading-none text-brand"
            style={{
              fontFamily: "var(--font-wordmark)",
              fontWeight: 600,
              letterSpacing: "0.42em",
            }}
          >
            Sponsa
          </h1>
          <p className="mt-[9px] flex items-center gap-[5px] text-[10px] font-medium uppercase leading-3 tracking-[0.16em] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">your city shortcut</span>
          </p>

        </div>

        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-10 shrink-0 border transition-colors",
            profileActive
              ? "border-transparent bg-foreground text-background"
              : "border-hairline bg-transparent text-foreground/60 hover:text-foreground",
          )}
        >
          <User className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}

