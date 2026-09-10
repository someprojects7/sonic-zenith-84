import { LayoutGrid, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedTab = "foryou" | "all";

const TABS = [
  { id: "foryou", label: "Picks", icon: Sparkles },
  { id: "all", label: "All", icon: LayoutGrid },
] as const;

/**
 * Sticky feed switch: flat tabs on the canvas, active one underlined in ink.
 * A red count tells the person how many events they have not looked at yet.
 */
export function FeedTabs({
  value,
  onChange,
  hidden,
  newCounts,
}: {
  value: FeedTab;
  onChange: (tab: FeedTab) => void;
  hidden?: boolean;
  newCounts: Record<FeedTab, number>;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "sticky top-0 z-20 border-b border-hairline bg-card/95 px-5 backdrop-blur-xl",
        hidden && "hidden",
      )}
    >
      <div className="grid grid-cols-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const count = newCounts[id];
          return (
            <button
              key={id}
              role="tab"
              aria-selected={value === id}
              onClick={() => onChange(id)}
              className={cn(
                "flex h-12 min-w-0 items-center justify-center gap-2 border-b-2 text-[16px] font-medium leading-none transition-colors",
                value === id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2} />
              <span className="truncate">{label}</span>
              {count > 0 && (
                <span
                  aria-label={`${count} new`}
                  className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-rausch px-1.5 text-[11px] font-semibold leading-none text-white"
                >
                  +{count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
