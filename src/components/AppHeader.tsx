import { User } from "lucide-react";

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
        "bg-background/85 backdrop-blur-xl transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      {/* One gradient hairline — the family signature */}
      <div className="h-1 w-full bg-accent-gradient" />

      <div className="flex items-center justify-between gap-3 px-5 pb-3.5 pt-[calc(0.85rem+env(safe-area-inset-top))]">
        <div className="min-w-0">
          <h1
            className="truncate text-[20px] font-extrabold leading-none tracking-[-0.03em] text-brand"
            style={{ letterSpacing: "-0.03em" }}
          >
            Sponsa
          </h1>
          <p className="eyebrow mt-[7px] block leading-3">your city shortcut</p>
        </div>

        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-10 shrink-0 transition-colors",
            profileActive
              ? "bg-brand-gradient text-brand-foreground shadow-brand"
              : "bg-brand-soft text-brand",
          )}
        >
          <User className="size-[18px]" strokeWidth={2.1} />
        </button>
      </div>
    </header>
  );
}
