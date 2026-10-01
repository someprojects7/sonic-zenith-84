import { Link } from "@tanstack/react-router";

import { NewBadge } from "@/components/EventMeta";
import { priceLabel, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/**
 * A feed card that reads in one glance, the way ticket apps do it:
 * when (date tile) → what (title) → where (time · venue) → why and how much.
 * No buttons inside: the whole card opens the event, where voting lives.
 */
export function EventCard({ event }: { event: EventItem }) {
  const { isSeen } = usePreferences();
  const isNew = Boolean(event.isNew) && !isSeen(event.id);
  const [weekday, date] = event.day.split(" ");

  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className="press flex items-center gap-3.5 rounded-xl bg-card p-3"
    >
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-2">
        <span className="text-[12px] font-medium leading-none text-muted-foreground">
          {weekday}
        </span>
        <span className="mt-1 text-[20px] font-semibold leading-none text-foreground">{date}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[16px] font-medium leading-[1.3] text-foreground">
          {event.title}
        </p>
        <p className="mt-0.5 truncate text-[13px] leading-[1.4] text-muted-foreground">
          {event.time} · {event.venue}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[13px] leading-none">
          <span className="font-semibold text-foreground">{priceLabel(event)}</span>
          {event.match && <span className="font-medium text-rausch">{event.match}% match</span>}
          {isNew && <NewBadge />}
        </div>
      </div>
    </Link>
  );
}
