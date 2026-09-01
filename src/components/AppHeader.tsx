import { User } from "lucide-react";

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
        "px-5 pb-3 pt-[calc(1.25rem+env(safe-area-inset-top))] transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-[24px] font-bold uppercase leading-none tracking-[0.08em] text-foreground">
            Sponsa
          </h1>
          <p className="mt-2 truncate text-[13px] leading-4 text-muted-foreground">
            Your city shortcut
          </p>
        </div>

        <ThemeToggle />
        {/* Profile lives here, so the tabs stay a pure feed switch */}
        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-11 ring-1 ring-hairline",
            profileActive ? "bg-surface-2 text-brand" : "bg-surface-2/60 text-muted-foreground",
          )}
        >
          <User className="size-[21px]" />
        </button>
      </div>
    </header>
  );
}
