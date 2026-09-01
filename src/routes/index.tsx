import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* Layout rules used across this screen:
   - one horizontal gutter: px-5 (20px) for every block, edge-to-edge only for scrollers
   - vertical rhythm: 32px between sections, 16px between cards, 8px inside a text block
   - every tappable element is at least 44px high
   - bottom padding clears the 76px tab bar + safe area */
function Index() {
  const [tab, setTab] = useState<"foryou" | "all">("foryou");
  const [category, setCategory] = useState("All");
  const [nav, setNav] = useState("events");

  /* Header is decoration, tabs are navigation: the title scrolls away, the tabs stay pinned */
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 12) setHeaderHidden(false);
      else if (y > lastY.current + 4) setHeaderHidden(true);
      else if (y < lastY.current - 24) setHeaderHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(
    () => (category === "All" ? allEvents : allEvents.filter((e) => e.category === category)),
    [category],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <header
          className={cn(
            "px-5 pb-3 pt-[calc(1.25rem+env(safe-area-inset-top))] transition-all duration-300",
            headerHidden && "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[26px] font-bold leading-none text-foreground">
                Sponsa
              </h1>
              <p className="mt-1.5 truncate text-[13px] leading-4 text-muted-foreground">
                Your shortcut to the city
              </p>
            </div>
            <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              <span className="size-1.5 rounded-full bg-brand" />
              Beta
            </span>
          </div>
        </header>

        {/* Tabs: own sticky layer so they survive the header collapsing */}
        <div className="sticky top-0 z-20 bg-glass px-5 pb-3 pt-[calc(0.5rem+env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
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
                  "h-11 rounded-full text-[14px] font-semibold transition-colors",
                  tab === id
                    ? "bg-background text-foreground shadow-elevated"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>


        {tab === "foryou" ? (
          <main className="space-y-8 pt-5">
            {/* Entry point of the scroll: one short sentence, biggest text on the screen after the logo */}
            <section className="px-5">
              <div className="rounded-3xl bg-card p-5 ring-1 ring-hairline">
                <p className="text-[17px] leading-[1.4] text-foreground text-balance-tight">
                  We scanned <span className="font-semibold text-brand">746 events</span> in Vilnius
                  this week and picked the {picks.length} worth your time.
                </p>
                <div className="mt-3.5 flex items-center gap-2 text-[12px] leading-4 text-muted-foreground">
                  <span>Updated 2 h ago</span>
                  <span className="size-1 rounded-full bg-surface-3" />
                  <span>Tuned to your taste</span>
                </div>
              </div>
            </section>

            <section className="px-5">
              <div className="mb-3.5 flex items-baseline justify-between gap-3">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Your picks
                </h2>
                <span className="text-[12px] text-muted-foreground">{picks.length} of 746</span>
              </div>
              <div className="space-y-4">
                {picks.map((event, i) => (
                  <EventCard key={event.id} event={event} featured={i === 0} />
                ))}
              </div>
            </section>

            {/* Lower density as the eye tires: compact rows instead of full cards */}
            <section className="px-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Also this weekend
              </h2>
              <div className="divide-y divide-hairline">
                {allEvents.slice(3).map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </section>

            <p className="px-5 pb-2 text-center text-[12px] leading-4 text-muted-foreground">
              That's everything worth your time this week.
            </p>
          </main>
        ) : (
          <main className="space-y-5 pt-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 px-5">
              <label className="flex min-w-0 items-center gap-2.5 rounded-full bg-surface-2 px-4">
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
                <SlidersHorizontal className="size-[18px]" />
              </button>
            </div>

            {/* Edge-to-edge scroller: last chip peeks out so the row reads as scrollable */}
            <div className="flex gap-2 overflow-x-auto px-5 pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors",
                    category === c
                      ? "bg-brand-gradient text-brand-foreground"
                      : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="divide-y divide-hairline px-5">
              {filtered.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {filtered.length === 0 && (
                <p className="py-14 text-center text-[14px] text-muted-foreground">
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
