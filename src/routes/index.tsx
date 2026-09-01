import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  Heart,
  Hourglass,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Sparkles,
  User,
} from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { allEvents, categories, picks } from "@/data/events";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-sponsa-panda.png";

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
  const [tab, setTab] = useState<"foryou" | "all" | "profile">("foryou");
  const [category, setCategory] = useState("All");

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
      <div className="mx-auto max-w-md pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <header
          className={cn(
            "px-5 pb-3 pt-[calc(1.25rem+env(safe-area-inset-top))] transition-all duration-300",
            headerHidden && "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <img
              src={logoMark}
              alt="Sponsa logo"
              width={1024}
              height={1024}
              className="size-9 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <h1 className="truncate text-[26px] font-bold leading-none tracking-[-0.02em] text-foreground">
                Sponsa
              </h1>
              <p className="mt-1.5 truncate text-[13px] leading-4 text-muted-foreground">
                Your shortcut to the city
              </p>
            </div>
            {/* Profile lives in the header, so the tabs stay a pure feed switch */}
            <button
              onClick={() => setTab(tab === "profile" ? "foryou" : "profile")}
              aria-label="Profile"
              aria-current={tab === "profile" ? "page" : undefined}
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full transition-colors",
                tab === "profile"
                  ? "bg-surface-2 text-brand ring-1 ring-hairline"
                  : "text-muted-foreground",
              )}
            >
              <User className="size-[21px]" />
            </button>
          </div>

        </header>

        {/* Feed switch only — sticky, so it survives the header collapsing.
            The sliding pill is the only filled shape, the track stays transparent. */}
        <div
          className={cn(
            "sticky top-0 z-20 bg-glass px-5 pb-3 pt-2 backdrop-blur-xl",
            tab === "profile" && "hidden",
          )}
        >
          <div className="relative grid grid-cols-2">
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-surface-2 ring-1 ring-hairline transition-transform duration-300 ease-out",
                tab === "all" && "translate-x-full",
              )}
            />
            {(
              [
                ["foryou", "For you", Sparkles],
                ["all", "All events", LayoutGrid],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-selected={tab === id}
                role="tab"
                className={cn(
                  "relative z-10 flex h-11 min-w-0 items-center justify-center gap-2 rounded-full text-[14px] font-semibold leading-none transition-colors",
                  tab === id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-[18px] shrink-0", tab === id && "text-brand")} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === "foryou" ? (
          <main className="space-y-8 pt-5">
            {/* Entry point of the scroll: the time saved, stated as work already done for you */}
            <section className="px-5">
              <div className="rounded-3xl bg-card p-5 ring-1 ring-hairline">
                <div className="flex gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
                    <Hourglass className="size-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] leading-[1.45] text-foreground text-balance-tight">
                      We scanned <span className="font-semibold text-brand">746 events</span> across{" "}
                      <span className="font-semibold text-brand">15 sources</span> in Vilnius this
                      week and picked the {picks.length} worth your time.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[12px] leading-4 text-muted-foreground">
                      <span>Updated 2 h ago</span>
                      <span className="size-1 rounded-full bg-surface-3" />
                      <span>~3 h of scrolling saved</span>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            <section className="px-5">
              <div className="space-y-4">
                {picks.map((event, i) => (
                  <EventCard key={event.id} event={event} featured={i === 0} />
                ))}
              </div>
            </section>

            {/* Lower density as the eye tires: compact rows instead of full cards */}
            <section className="px-5">
              <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Also this weekend
              </h2>
              <div className="divide-y divide-hairline">
                {allEvents.slice(3).map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </section>

            <p className="px-5 pt-1 text-center text-[12px] leading-4 text-muted-foreground">
              That's everything worth your time this week.
            </p>
          </main>
        ) : tab === "all" ? (
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
        ) : (
          <main className="space-y-8 pt-5">
            <section className="px-5">
              <div className="flex items-center gap-4 rounded-3xl bg-card p-5 ring-1 ring-hairline">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
                  <User className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-bold leading-tight tracking-[-0.01em] text-foreground">
                    Eduard
                  </p>
                  <p className="mt-1 truncate text-[13px] leading-4 text-muted-foreground">
                    Vilnius · 12 picks liked
                  </p>
                </div>
              </div>
            </section>

            <section className="px-5">
              <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Your taste
              </h2>
              <div className="divide-y divide-hairline rounded-3xl bg-card ring-1 ring-hairline">
                {(
                  [
                    ["Saved events", Heart],
                    ["Interests", Sparkles],
                    ["Notifications", Bell],
                  ] as const
                ).map(([label, Icon]) => (
                  <button
                    key={label}
                    className="flex min-h-[56px] w-full items-center gap-3.5 px-5 text-left"
                  >
                    <Icon className="size-[18px] shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">
                      {label}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
