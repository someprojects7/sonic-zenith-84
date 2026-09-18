import { useMemo } from "react";
import { Hourglass } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { InterestPicker } from "@/components/InterestPicker";
import { SCAN } from "@/config/site";
import { allEvents, picks } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** The weekly shortlist, ordered from highest-attention picks to compact extras. */
export function ForYouFeed() {
  const { interests, interestsDismissed, dismissInterests } = usePreferences();

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
    <main className="space-y-8 pb-4 pt-6">
      {!interestsDismissed && (
        <div className="px-5">
          <InterestPicker onDismiss={dismissInterests} />
        </div>
      )}

      <section className="px-5">
        <h3 className="text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          Picked for you
        </h3>
        <p className="mb-3 mt-1 flex items-center gap-1.5 text-[14px] leading-[1.43] text-muted-foreground">
          <Hourglass className="size-3.5 shrink-0 text-rausch" strokeWidth={2} />
          {order.sorted.length} of {SCAN.eventsScanned} events
        </p>

        <div className="space-y-2">
          {order.sorted.map((event, i) => (
            <EventCard key={event.id} event={event} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="px-5">
        <h3 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          More this week
        </h3>
        <div className="space-y-2">
          {order.rest.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <p className="px-5 text-[13px] leading-[1.43] text-muted-foreground">That's the week.</p>
    </main>
  );
}
