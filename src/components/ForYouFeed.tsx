import { useMemo } from "react";

import { EventCard } from "@/components/EventCard";
import { EventRow } from "@/components/EventRow";
import { InterestPicker } from "@/components/InterestPicker";
import { allEvents, picks } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** How the weekly shortlist was produced — the promise the feed delivers on. */
const SCAN = { events: 746, sources: 15, savedHours: 3 };

/** The weekly shortlist, ordered from highest-attention picks to compact extras. */
export function ForYouFeed() {
  const { interests } = usePreferences();

  // Chosen interests float to the top; nothing is hidden, so the week stays whole.
  const order = useMemo(() => {
    const rank = (category: string) => (interests.includes(category) ? 0 : 1);
    const sorted = [...picks].sort((a, b) => rank(a.category) - rank(b.category));
    const rest = allEvents
      .filter((e) => !picks.some((p) => p.id === e.id))
      .sort((a, b) => rank(a.category) - rank(b.category));
    return { sorted, rest };
  }, [interests]);

  return (
    <main className="space-y-8 pb-6 pt-6">
      <section className="px-5">
        <h2 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
          Your week in Vilnius
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] leading-[1.4] text-muted-foreground">
          <Hourglass className="size-3.5 shrink-0 text-rausch" strokeWidth={2} />
          {SCAN.events} events, {SCAN.sources} sources, {SCAN.savedHours}h saved
        </p>
      </section>

      <div className="px-5">
        <InterestPicker />
      </div>

      <section className="px-5">
        <h3 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          Picked for you
        </h3>
        <div className="space-y-2">
          {order.sorted.map((event, i) => (
            <EventCard key={event.id} event={event} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="px-5">
        <h3 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          Also this weekend
        </h3>
        <div className="space-y-2">
          {order.rest.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>

      <p className="px-5 text-[13px] leading-[1.43] text-muted-foreground">
        That's everything worth your time this week.
      </p>
    </main>
  );
}
