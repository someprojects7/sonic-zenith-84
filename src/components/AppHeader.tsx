import { User } from "lucide-react";

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
        "bg-card transition-[transform,opacity] duration-200 ease-out",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex h-14 items-center justify-between gap-3 px-5">
        <h1 className="truncate font-wordmark text-[21px] font-bold uppercase leading-none tracking-[0.1em] text-foreground">
          Sponsa<span className="text-rausch">.</span>net
        </h1>

        <button
          onClick={onProfileClick}
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "icon-button size-10 shrink-0 transition-colors",
            profileActive ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground",
          )}
        >
          <User className="size-[20px]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
