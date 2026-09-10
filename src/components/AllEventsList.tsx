import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { EventRow } from "@/components/EventRow";
import { allEvents, categories } from "@/data/events";
import { cn } from "@/lib/utils";

/** The full calendar: search, category chips, then one compact row per event. */
export function AllEventsList() {
  const [category, setCategory] = useState("All");

  const events = useMemo(
    () => (category === "All" ? allEvents : allEvents.filter((e) => e.category === category)),
    [category],
  );

  return (
    <main className="space-y-5 pb-6 pt-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 px-5">
        <label className="flex min-w-0 items-center gap-2.5 rounded-full bg-card px-4 shadow-elevated">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
          <input
            placeholder="Search events, venues, artists"
            className="h-12 w-full min-w-0 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          aria-label="Filters"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-card text-foreground shadow-elevated"
        >
          <SlidersHorizontal className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* Edge-to-edge scroller: the last chip peeks out so the row reads as scrollable */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors",
              category === c
                ? "bg-brand text-brand-foreground"
                : "bg-card text-muted-foreground ring-1 ring-hairline",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2 px-5">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <p className="py-14 text-center text-[14px] text-muted-foreground">
            Nothing in this category this week.
          </p>
        )}
      </div>
    </main>
  );
}
