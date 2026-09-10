import { useMemo, useState } from "react";
import { Hourglass, Search, X } from "lucide-react";

import { EventRow } from "@/components/EventRow";
import { allEvents, categories, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/** The full calendar: search, category chips, then events grouped by day. */
export function AllEventsList() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const days = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = allEvents.filter((event) => {
      const inCategory = category === "All" || event.category === category;
      const inQuery =
        q === "" ||
        [event.title, event.venue, event.category, event.city].some((field) =>
          field.toLowerCase().includes(q),
        );
      return inCategory && inQuery;
    });

    // One heading per day, so a newcomer reads the week, not a flat list.
    const grouped = new Map<string, EventItem[]>();
    for (const event of matches) {
      grouped.set(event.day, [...(grouped.get(event.day) ?? []), event]);
    }
    return { groups: [...grouped], count: matches.length };
  }, [category, query]);

  return (
    <main className="space-y-5 pb-6 pt-5">
      <div className="px-5">
        <label className="flex min-w-0 items-center gap-2.5 rounded-full bg-card px-4 shadow-elevated">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, venues, categories"
            className="h-12 w-full min-w-0 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="icon-button size-7 bg-surface-2 text-muted-foreground"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          )}
        </label>
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

      <p className="px-5 text-[13px] leading-[1.4] text-muted-foreground">
        {days.count === 0
          ? "Nothing matches yet."
          : `${days.count} ${days.count === 1 ? "event" : "events"} this week`}
      </p>

      <div className="space-y-6 px-5">
        {days.groups.map(([day, events]) => (
          <section key={day}>
            <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              {day}
            </h3>
            <div className="space-y-2">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </section>
        ))}

        {days.count === 0 && (
          <div className="py-12 text-center">
            <p className="text-[16px] font-medium text-foreground">No events like that this week</p>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              Try another category, or clear the search to see the whole week.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 h-11 rounded-full bg-brand px-5 text-[14px] font-semibold text-brand-foreground"
            >
              Show everything
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
