import { formatWhen, type EventItem } from "@/data/events";

/**
 * Category above the title, day and time below it. The category sits on its own
 * full-width line, so any length fits, and the time is never dropped.
 */
export function EventCategory({ event }: { event: EventItem }) {
  return (
    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {event.category}
    </p>
  );
}

export function EventMeta({ event }: { event: EventItem }) {
  return (
    <p className="mt-0.5 whitespace-nowrap text-[14px] leading-[1.43] text-muted-foreground">
      {formatWhen(event)}
    </p>
  );
}

/** Small red flag for events added since the last visit. */
export function NewBadge() {
  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-rausch px-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
      New
    </span>
  );
}
