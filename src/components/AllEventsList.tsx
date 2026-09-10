import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Hourglass, Search, X } from "lucide-react";
import { format, isWithinInterval, startOfDay } from "date-fns";

import { EventRow } from "@/components/EventRow";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { allEvents, categories, eventDate, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/** How the week was assembled, shown above the full calendar. */
const SCAN = { events: 746, sources: 15, savedHours: 3 };

/** The full calendar: dates and categories, search behind a magnifier, events by day. */
export function AllEventsList() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  const days = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = range?.from ? startOfDay(range.from) : null;
    const to = range?.to ? startOfDay(range.to) : from;

    const matches = allEvents.filter((event) => {
      const inCategory = category === "All" || event.category === category;
      const inDates =
        !from || !to || isWithinInterval(startOfDay(eventDate(event)), { start: from, end: to });
      const inQuery =
        q === "" ||
        [event.title, event.venue, event.category, event.city].some((field) =>
          field.toLowerCase().includes(q),
        );
      return inCategory && inDates && inQuery;
    });

    // One heading per day, so a newcomer reads the week, not a flat list.
    const grouped = new Map<string, EventItem[]>();
    for (const event of matches) {
      grouped.set(event.day, [...(grouped.get(event.day) ?? []), event]);
    }
    return { groups: [...grouped], count: matches.length };
  }, [category, query, range]);

  const dateLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${format(range.from, "d MMM")} – ${format(range.to, "d MMM")}`
      : format(range.from, "d MMM")
    : null;

  const reset = () => {
    setQuery("");
    setCategory("All");
    setRange(undefined);
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

      {/* One quiet row: dates, search, then categories. Both filters open on demand. */}
      <div className="flex items-center gap-2 px-5">
        <Popover open={datesOpen} onOpenChange={setDatesOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Pick dates"
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full text-[13px] font-medium transition-colors",
                dateLabel ? "bg-foreground px-3.5 text-background" : "w-9 justify-center bg-card text-foreground ring-1 ring-hairline",
              )}
            >
              <CalendarDays className="size-4 shrink-0" strokeWidth={2.5} />
              {dateLabel && <span className="whitespace-nowrap">{dateLabel}</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from ?? eventDate(allEvents[0]!)}
              numberOfMonths={1}
              // Days between the two picked dates read as one filled band.
              className="pointer-events-auto p-3 [&_[data-range-end=true]]:!bg-rausch [&_[data-range-end=true]]:!text-white [&_[data-range-middle=true]]:!bg-rausch/12 [&_[data-range-middle=true]]:!text-foreground [&_[data-range-start=true]]:!bg-rausch [&_[data-range-start=true]]:!text-white [&_[data-selected-single=true]]:!bg-rausch [&_[data-selected-single=true]]:!text-white"
              classNames={{
                range_middle: "bg-rausch/12 rounded-none",
                range_start: "bg-rausch/12 rounded-l-full",
                range_end: "bg-rausch/12 rounded-r-full",
              }}
            />
            <div className="flex items-center justify-between gap-2 border-t border-hairline p-3">
              <button
                type="button"
                onClick={() => setRange(undefined)}
                className="h-9 rounded-full px-3 text-[13px] font-medium text-muted-foreground"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDatesOpen(false)}
                className="h-9 rounded-full bg-brand px-4 text-[13px] font-semibold text-brand-foreground"
              >
                Done
              </button>
            </div>
          </PopoverContent>
        </Popover>

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
          : `${days.count} ${days.count === 1 ? "event" : "events"}${dateLabel ? ` on ${dateLabel}` : " this week"}`}
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
              Try other dates or another category.
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
