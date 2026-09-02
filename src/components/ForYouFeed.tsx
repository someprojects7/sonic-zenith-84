import { Hourglass } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { allEvents, picks } from "@/data/events";

/** How the weekly shortlist was produced — the promise the feed delivers on. */
const SCAN = { events: 746, sources: 15, updated: "2 h ago", saved: "~3 h of scrolling saved" };

/** The weekly shortlist, ordered from highest-attention picks to compact extras. */
export function ForYouFeed() {
  return (
    <main className="space-y-6 pt-4">
      <section className="px-5">
        <div className="surface-card flex items-center gap-3 p-3.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
            <Hourglass className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-5 text-foreground">
              Scanned <span className="font-semibold text-brand">{SCAN.events} events</span> across{" "}
              <span className="font-semibold text-brand">{SCAN.sources} sources</span> · picked {picks.length} for you.
            </p>
            <p className="truncate text-[11px] leading-4 text-muted-foreground">
              Updated {SCAN.updated} · {SCAN.saved}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-2.5 px-5">
        {picks.map((event, i) => (
          <EventCard key={event.id} event={event} featured={i === 0} />
        ))}
      </section>

      <section className="px-5">
        <h2 className="eyebrow mb-3">Also this weekend</h2>
        <div className="divide-y divide-hairline">
          {allEvents.slice(picks.length).map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>

      <p className="px-5 pt-1 text-center text-[12px] leading-4 text-muted-foreground">
        That's everything worth your time this week.
      </p>
    </main>
  );
}
