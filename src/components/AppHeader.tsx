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
        "bg-background/90 backdrop-blur-xl transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-3.5 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-bold leading-none tracking-[-0.02em] text-rausch">
            sponsa
          </h1>
          <p className="eyebrow mt-1.5 block leading-4">your city shortcut</p>
        </div>

        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-10 shrink-0",
            profileActive
              ? "bg-brand text-brand-foreground"
              : "bg-surface-2 text-foreground ring-1 ring-hairline",
          )}
        >
          <User className="size-[18px]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
