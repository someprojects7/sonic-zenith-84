import { type EventItem } from "@/data/events";

/**
 * Category above the title, day and time below it. The "new" flag rides on the
 * category line, so the title keeps its full width.
 */
export function EventCategory({ event, isNew = false }: { event: EventItem; isNew?: boolean }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      <span className="truncate">{event.category}</span>
      {isNew && <NewBadge />}
    </p>
  );
}

/** Small red flag for events added since the last visit. */
export function NewBadge() {
  return (
    <span className="inline-flex h-4 shrink-0 items-center rounded-full bg-rausch px-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.06em] text-white">
      New
    </span>
  );
}
