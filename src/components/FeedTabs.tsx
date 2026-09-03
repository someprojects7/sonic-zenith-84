import { LayoutGrid, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedTab = "foryou" | "all";

const TABS = [
  { id: "foryou", label: "For you", icon: Sparkles },
  { id: "all", label: "All events", icon: LayoutGrid },
] as const;

/** Quiet, sticky feed switch with a single active underline. */
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
      className={cn(
        "sticky top-0 z-20 border-b border-hairline bg-glass px-5 backdrop-blur-xl",
        hidden && "hidden",
      )}
    >
      <div className="grid grid-cols-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={value === id}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex h-12 min-w-0 items-center justify-center gap-2 border-b-2 border-transparent text-[14px] font-semibold leading-none transition-colors",
              value === id ? "border-brand text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("size-4 shrink-0", value === id && "text-brand")} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
