import { Link } from "@tanstack/react-router";

import { NewBadge } from "@/components/EventMeta";
import { VoteButtons } from "@/components/VoteButtons";
import { priceLabel, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** "Thu 17 Sep" split into the three lines of the date block. */
const splitDay = (day: string) => {
  const [weekday = "", date = "", month = ""] = day.trim().split(/\s+/);
  return { weekday, date, month };
};

/**
 * A recommendation card, built like the weekly email: one block with the date
 * on the left, the match and category on one line, then title and time price.
 * The whole card opens the event page; the vote buttons stay clickable on top.
 */
export function EventCard({ event }: { event: EventItem }) {
  const { isSeen } = usePreferences();
  const isNew = Boolean(event.isNew) && !isSeen(event.id);
  const { weekday, date, month } = splitDay(event.day);

  return (
    <article className="relative flex items-center gap-3 rounded-xl bg-card p-3">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        aria-label={event.title}
        className="press absolute inset-0 rounded-xl"
      />

      <div className="relative flex w-[56px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-hairline bg-card pb-2 pt-[8px]">
        <span className="absolute inset-x-0 top-0 h-[3px] bg-rausch" />
        <span className="text-[11px] font-semibold leading-[14px] tracking-[0.06em] text-muted-foreground">
          {date}
        </span>
        <span className="text-[20px] font-bold leading-[24px] tracking-[-0.01em] text-foreground">
          {weekday}
        </span>
        <span className="text-[11px] font-semibold leading-[14px] tracking-[0.06em] text-muted-foreground">
          {month}
        </span>
      </div>


      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {event.match && <span className="shrink-0 text-rausch">{event.match}% match ·</span>}
          <span className="truncate">{event.category}</span>
          {isNew && <NewBadge />}
        </p>
        <p className="line-clamp-2 text-[16px] font-medium leading-[1.25] text-foreground">
          {event.title}
        </p>
        <p className="mt-0.5 whitespace-nowrap text-[12px] leading-[1.4] text-muted-foreground">
          {event.time} · <span className="font-semibold text-foreground">{priceLabel(event)}</span>
        </p>
      </div>

      <div className="relative shrink-0" data-tour-vote>
        <VoteButtons id={event.id} />
      </div>
    </article>
  );
}
