import { LayoutGrid, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedTab = "foryou" | "all";

const TABS = [
  { id: "foryou", label: "For you", icon: Sparkles },
  { id: "all", label: "All events", icon: LayoutGrid },
] as const;

/** Sticky feed switch: a soft pill track with one filled active segment. */
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
      className={cn("sticky top-0 z-20 bg-glass px-5 py-2.5 backdrop-blur-xl", hidden && "hidden")}
    >
      <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={value === id}
            onClick={() => onChange(id)}
            className={cn(
              "flex h-10 min-w-0 items-center justify-center gap-2 rounded-full text-[13.5px] font-bold leading-none transition-all",
              value === id
                ? "bg-brand-gradient text-brand-foreground shadow-brand"
                : "text-muted-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={2.2} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
