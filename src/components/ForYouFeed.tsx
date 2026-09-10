import { Hourglass } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { allEvents, picks } from "@/data/events";

/** How the weekly shortlist was produced — the promise the feed delivers on. */
const SCAN = { events: 746, sources: 15, savedHours: 3, nextScanInDays: 3 };

/** The weekly shortlist, ordered from highest-attention picks to compact extras. */
export function ForYouFeed() {
  return (
    <main className="space-y-7 pb-4 pt-4">
      <section className="px-5 text-center">
        <h2 className="text-[24px] font-extrabold leading-[1.25] tracking-[-0.03em] text-foreground text-balance-tight">
          Your week in Vilnius
        </h2>
        <p className="mx-auto mt-2 max-w-[19rem] text-[13.5px] leading-[1.6] text-muted-foreground">
          Scanned <span className="font-bold text-brand">{SCAN.events} events</span> across{" "}
          <span className="font-bold text-brand">{SCAN.sources} sources</span> — here is what's
          worth your time.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[12px] font-semibold text-brand">
          <Hourglass className="size-3.5" strokeWidth={2.2} />
          {SCAN.savedHours}h of scrolling saved
          <span className="text-brand/45">·</span>
          next scan in {SCAN.nextScanInDays} days
        </p>
      </section>

      <section className="bg-tone-warm py-7">
        <p className="eyebrow mb-4 text-center">Picked for you</p>
        <div className="space-y-3 px-4">
          {picks.map((event, i) => (
            <EventCard key={event.id} event={event} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="px-5">
        <p className="eyebrow mb-3.5 text-center">Also this weekend</p>
        <div className="space-y-2.5">
          {allEvents.slice(picks.length).map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>

      <p className="px-8 pt-1 text-center text-[12px] leading-relaxed text-muted-foreground">
        That's everything worth your time this week.
      </p>
    </main>
  );
}
