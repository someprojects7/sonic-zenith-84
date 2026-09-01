import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { allEvents, categories, picks } from "@/data/events";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sponsa — events worth your time in Vilnius" },
      {
        name: "description",
        content:
          "We scanned 746 events in Vilnius this week and picked the ones worth your time. Concerts, clubs, art and food, curated for you.",
      },
      { property: "og:title", content: "Sponsa — events worth your time" },
      {
        property: "og:description",
        content: "A weekly shortlist of city events, picked for your taste.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<"foryou" | "all">("foryou");
  const [category, setCategory] = useState("All");
  const [nav, setNav] = useState("events");

  const filtered = useMemo(
    () => (category === "All" ? allEvents : allEvents.filter((e) => e.category === category)),
    [category],
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-20 bg-glass px-5 pb-3 pt-5 backdrop-blur-xl">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h1 className="text-[26px] font-bold leading-none text-foreground">Sponsa</h1>
              <p className="mt-1 truncate text-[13px] text-muted-foreground">
                Your shortcut to the city
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              <span className="size-1.5 rounded-full bg-brand" />
              Beta
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-full bg-surface-2 p-1">
            {(
              [
                ["foryou", "For you"],
                ["all", "All events"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-full py-2.5 text-[14px] font-semibold transition-colors",
                  tab === id
                    ? "bg-background text-foreground shadow-elevated"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {tab === "foryou" ? (
          <main className="space-y-6 px-5 pt-4">
            <section className="rounded-3xl bg-card p-5 ring-1 ring-hairline">
              <p className="text-[17px] leading-snug text-foreground text-balance-tight">
                We scanned <span className="font-semibold text-brand">746 events</span> in Vilnius
                this week and picked the {picks.length} worth your time.
              </p>
              <div className="mt-4 flex gap-4 text-[12px] text-muted-foreground">
                <span>Updated 2 h ago</span>
                <span>·</span>
                <span>Tuned to your taste</span>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Your picks
              </h2>
              {picks.map((event, i) => (
                <EventCard key={event.id} event={event} featured={i === 0} />
              ))}
            </section>

            <section className="space-y-1">
              <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Also this weekend
              </h2>
              {allEvents.slice(3).map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </section>
          </main>
        ) : (
          <main className="space-y-5 px-5 pt-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <label className="flex min-w-0 items-center gap-2 rounded-full bg-surface-2 px-4">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  placeholder="Search events, venues, artists"
                  className="h-12 w-full min-w-0 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button
                aria-label="Filters"
                className="grid size-12 shrink-0 place-items-center rounded-full text-muted-foreground ring-1 ring-hairline"
              >
                <SlidersHorizontal className="size-4" />
              </button>
            </div>

            <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                    category === c
                      ? "bg-brand-gradient text-brand-foreground"
                      : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {filtered.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {filtered.length === 0 && (
                <p className="py-12 text-center text-[14px] text-muted-foreground">
                  Nothing in this category this week.
                </p>
              )}
            </div>
          </main>
        )}
      </div>

      <BottomNav active={nav} onChange={setNav} />
    </div>
  );
}
