import { Hourglass } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { allEvents, picks } from "@/data/events";

/** How the weekly shortlist was produced — the promise the feed delivers on. */
const SCAN = { events: 746, sources: 15, updated: "2 h ago", saved: "~3 h of scrolling saved" };

/**
 * Reading order: work already done for you → full cards while attention is
 * high → compact rows as the eye tires → an explicit end of the list.
 */
export function ForYouFeed() {
  return (
    <main className="space-y-8 pt-5">
      <section className="px-5">
        <div className="surface-card flex gap-3.5 p-5">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
            <Hourglass className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] leading-[1.45] text-foreground text-balance-tight">
              We scanned <span className="font-semibold text-brand">{SCAN.events} events</span>{" "}
              across <span className="font-semibold text-brand">{SCAN.sources} sources</span> in
              Vilnius this week and picked the {picks.length} worth your time.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[12px] leading-4 text-muted-foreground">
              <span>Updated {SCAN.updated}</span>
              <span className="size-1 rounded-full bg-surface-3" />
              <span>{SCAN.saved}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 px-5">
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
