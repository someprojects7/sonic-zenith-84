import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";

import { EventCategory } from "@/components/EventMeta";
import { VoteButtons, voteLabel } from "@/components/VoteButtons";
import { priceLabel, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** "Thu 17 Sep" split into the three lines of the date block. */
const splitDay = (day: string) => {
  const [weekday = "", date = "", month = ""] = day.trim().split(/\s+/);
  return { weekday, date, month };
};

/**
 * A recommendation card. The date block on the left replaces the photo, so the
 * card reads the same way as the weekly email. The whole card opens the event
 * page, where tickets and saving live.
 */
export function EventCard({ event }: { event: EventItem }) {
  const { vote, isSeen } = usePreferences();
  const isNew = Boolean(event.isNew) && !isSeen(event.id);
  const { weekday, date, month } = splitDay(event.day);

  return (
    <article className="overflow-hidden rounded-xl bg-card">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="press grid min-h-[88px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3"
      >
        <div className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-xl bg-muted">
          <span className="text-[12px] font-semibold leading-[1.3] tracking-[0.06em] text-muted-foreground">
            {date}
          </span>
          <span className="text-[16px] font-bold leading-[1.25] tracking-[-0.01em] text-foreground">
            {weekday}
          </span>
          <span className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.06em] text-muted-foreground">
            {month}
          </span>
        </div>
        <div className="min-w-0">
          <EventCategory event={event} isNew={isNew} />
          <p className="line-clamp-2 text-[16px] font-medium leading-[1.25] text-foreground">
            {event.title}
          </p>

          <p className="mt-0.5 whitespace-nowrap text-[12px] leading-[1.4] text-muted-foreground">
            {event.time} ·{" "}
            <span className="font-semibold text-foreground">{priceLabel(event)}</span>
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
      </Link>

      {event.match && (
        <div className="flex items-center gap-2 border-t border-hairline px-3 py-2">
          <Sparkles className="size-3.5 shrink-0 text-rausch" />
          <p className="min-w-0 flex-1 truncate text-[12px] font-medium leading-[1.4] text-muted-foreground">
            {voteLabel(vote(event.id), event.match)}
          </p>
          <VoteButtons id={event.id} />
        </div>
      )}

    </article>
  );
}
