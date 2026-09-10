import { useMemo, useState } from "react";
import { Hourglass, Search, X } from "lucide-react";

import { EventRow } from "@/components/EventRow";
import { allEvents, categories, eventDays, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/** How the week was assembled, shown above the full calendar. */
const SCAN = { events: 746, sources: 15, savedHours: 3 };

/** The full calendar: dates, categories, optional search, then events by day. */
export function AllEventsList() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  // A range is picked by tapping a first day, then a last day.
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);

  const days = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bounds = range
      ? [eventDays.indexOf(range.from), eventDays.indexOf(range.to)].sort((a, b) => a - b)
      : null;

    const matches = allEvents.filter((event) => {
      const inCategory = category === "All" || event.category === category;
      const inRange =
        !bounds ||
        (eventDays.indexOf(event.day) >= bounds[0] && eventDays.indexOf(event.day) <= bounds[1]);
      const inQuery =
        q === "" ||
        [event.title, event.venue, event.category, event.city].some((field) =>
          field.toLowerCase().includes(q),
        );
      return inCategory && inRange && inQuery;
    });

    // One heading per day, so a newcomer reads the week, not a flat list.
    const grouped = new Map<string, EventItem[]>();
    for (const event of matches) {
      grouped.set(event.day, [...(grouped.get(event.day) ?? []), event]);
    }
    return { groups: [...grouped], count: matches.length };
  }, [category, query, range]);

  const inRange = (day: string) => {
    if (!range) return false;
    const [a, b] = [eventDays.indexOf(range.from), eventDays.indexOf(range.to)].sort(
      (x, y) => x - y,
    );
    const i = eventDays.indexOf(day);
    return i >= a && i <= b;
  };

  const pickDay = (day: string) => {
    setRange((current) => {
      if (!current) return { from: day, to: day };
      if (current.from === current.to && current.from !== day) return { ...current, to: day };
      if (current.from === day && current.to === day) return null; // tapping again clears it
      return { from: day, to: day };
    });
  };

  const reset = () => {
    setQuery("");
    setCategory("All");
    setRange(null);
  };

  return (
    <main className="space-y-5 pb-6 pt-6">
      <section className="px-5">
        <h2 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
          All events in Vilnius
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] leading-[1.4] text-muted-foreground">
          <Hourglass className="size-3.5 shrink-0 text-rausch" strokeWidth={2} />
          {SCAN.events} events, {SCAN.sources} sources, {SCAN.savedHours}h saved
        </p>
      </section>

      {/* Pick the days you are free: tap a first day, then a last day. */}
      <div className="flex gap-2 overflow-x-auto px-5">
        {eventDays.map((day) => {
          const [weekday, date, month] = day.split(" ");
          const active = inRange(day);
          return (
            <button
              key={day}
              onClick={() => pickDay(day)}
              aria-pressed={active}
              className={cn(
                "flex h-[62px] w-[56px] shrink-0 flex-col items-center justify-center rounded-2xl transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground ring-1 ring-hairline",
              )}
            >
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.04em]",
                  active ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {weekday}
              </span>
              <span className="text-[17px] font-semibold leading-tight">{date}</span>
              <span
                className={cn(
                  "text-[11px]",
                  active ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {month}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categories, with search tucked behind a magnifier so it costs no space */}
      <div className="flex items-center gap-2 px-5">
        <button
          type="button"
          aria-label={searchOpen ? "Close search" : "Search events"}
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open);
            if (searchOpen) setQuery("");
          }}
          className={cn(
            "icon-button size-9 shrink-0 transition-colors",
            searchOpen || query
              ? "bg-foreground text-background"
              : "bg-card text-foreground ring-1 ring-hairline",
          )}
        >
          {searchOpen ? (
            <X className="size-4" strokeWidth={2.5} />
          ) : (
            <Search className="size-4" strokeWidth={2.5} />
          )}
        </button>

        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
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
      </div>

      {searchOpen && (
        <div className="px-5">
          <label className="flex min-w-0 items-center gap-2.5 rounded-full bg-card px-4 ring-1 ring-hairline">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
            <input
              autoFocus
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
      )}

      <p className="px-5 text-[13px] leading-[1.4] text-muted-foreground">
        {days.count === 0
          ? "Nothing matches yet."
          : `${days.count} ${days.count === 1 ? "event" : "events"}${range ? " on those days" : " this week"}`}
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
              Try other days or another category.
            </p>
            <button
              onClick={reset}
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
