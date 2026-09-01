import { LayoutGrid, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedTab = "foryou" | "all";

const TABS = [
  { id: "foryou", label: "For you", icon: Sparkles },
  { id: "all", label: "All events", icon: LayoutGrid },
] as const;

/**
 * Sticky feed switch: it survives the header collapsing. The sliding pill is
 * the only filled shape — the track stays transparent.
 */
export function FeedTabs({
  value,
  onChange,
  hidden,
}: {
  value: FeedTab;
  onChange: (tab: FeedTab) => void;
  hidden?: boolean;
}) {
  return (
    <div
      role="tablist"
      className={cn("sticky top-0 z-20 bg-glass px-5 pb-3 pt-2 backdrop-blur-xl", hidden && "hidden")}
    >
      <div className="relative grid grid-cols-2">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-surface-2 ring-1 ring-hairline transition-transform duration-300 ease-out",
            value === "all" && "translate-x-full",
          )}
        />
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={value === id}
            onClick={() => onChange(id)}
            className={cn(
              "relative z-10 flex h-11 min-w-0 items-center justify-center gap-2 rounded-full text-[14px] font-semibold leading-none transition-colors",
              value === id ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0", value === id && "text-brand")} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
