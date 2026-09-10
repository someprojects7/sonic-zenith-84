import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Search, X } from "lucide-react";
import { format, isWithinInterval, startOfDay } from "date-fns";

import { EventRow } from "@/components/EventRow";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { allEvents, categories, eventDate, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

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
      {/* Dates and search stay put; categories get their own scroll track below. */}
      <div className="flex items-center justify-between gap-3 px-5">
        <div className="min-w-0">
          <h2 className="text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
            All events
          </h2>
          <p className="mt-0.5 text-[14px] leading-[1.43] text-muted-foreground">
            {days.count === 0
              ? "Nothing matches"
              : `${days.count} ${days.count === 1 ? "event" : "events"}`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
        </div>
      </div>

      {/* Own scroll track, edge to edge, so pills never slide under the controls. */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-0.5">
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

      {searchOpen && (
        <div className="px-5">
          <label className="flex min-w-0 items-center gap-2.5 rounded-full bg-card px-4 ring-1 ring-hairline">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
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
            <p className="text-[16px] font-medium text-foreground">Nothing matches</p>
            <p className="mt-1.5 text-[14px] leading-[1.43] text-muted-foreground">
              Try other dates.
            </p>
            <button
              onClick={reset}
              className="mt-4 h-11 rounded-full bg-brand px-5 text-[14px] font-semibold text-brand-foreground"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
