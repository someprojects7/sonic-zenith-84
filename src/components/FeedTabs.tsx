import { cn } from "@/lib/utils";

export type FeedTab = "foryou" | "all";

const TABS = [
  { id: "foryou", label: "Picks" },
  { id: "all", label: "All" },
] as const;

/** iOS segmented control, sticky under the large title. */
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
      className={cn("sticky top-0 z-20 bg-background/90 px-5 py-2 backdrop-blur-xl", hidden && "hidden")}
    >
      <div
        role="tablist"
        data-tour="tabs"
        className="grid grid-cols-2 rounded-[9px] bg-surface-3/60 p-0.5"
      >
        {TABS.map(({ id, label }) => {
          const count = newCounts[id];
          const active = value === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className={cn(
                "flex h-8 items-center justify-center gap-1.5 rounded-[7px] text-[13px] font-semibold text-foreground transition-colors",
                active && "bg-card shadow-[0_1px_3px_rgb(0_0_0/0.12)]",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  aria-label={`${count} new`}
                  className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rausch px-1 text-[11px] font-semibold leading-none text-primary-foreground dark:text-foreground"
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
