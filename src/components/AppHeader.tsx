import { UserCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/** iOS large-title header: big bold title left, account icon right. */
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
        "bg-background transition-[transform,opacity] duration-200 ease-out",
        hidden && "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-end justify-between gap-3 px-5 pb-2 pt-4">
        <h1 className="truncate text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground">
          {profileActive ? "Profile" : "Sponsa"}
        </h1>

        <button
          onClick={onProfileClick}
          data-tour="profile"
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className="icon-button press mb-1 size-9 text-rausch"
        >
          <UserCircle
            className={cn("size-[28px]", profileActive && "fill-rausch/15")}
            strokeWidth={1.75}
          />
        </button>
      </div>
    </header>
  );
}
