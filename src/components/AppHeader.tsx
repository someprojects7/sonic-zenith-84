import { Menu, User } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Airbnb-style brand row: white bar, hairline underline, wordmark left and a
 * single rounded account capsule right. Scrolls away, so it holds no navigation.
 */
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
        "bg-card transition-all duration-300",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-5 pt-[env(safe-area-inset-top)]">
        <h1 className="truncate font-wordmark text-[21px] font-bold uppercase leading-none tracking-[0.1em] text-rausch">
          Sponsa
        </h1>


        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "flex h-10 shrink-0 items-center gap-2 rounded-full border pl-3 pr-1 transition-shadow",
            profileActive ? "border-foreground" : "border-hairline",
          )}
        >
          <Menu className="size-4 text-foreground" strokeWidth={2} />
          <span
            className={cn(
              "icon-button size-8",
              profileActive
                ? "bg-foreground text-background"
                : "bg-surface-2 text-muted-foreground",
            )}
          >
            <User className="size-[18px]" strokeWidth={2} />
          </span>
        </button>
      </div>
    </header>
  );
}
