import { formatWhen, type EventItem } from "@/data/events";

/**
 * Date and category under a title. The date shortens if space runs out, the
 * category never does: an ellipsised category tells the reader nothing.
 */
export function EventMeta({ event }: { event: EventItem }) {
  return (
    <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[14px] leading-[1.43] text-muted-foreground">
      <span className="truncate">{formatWhen(event)}</span>
      <span aria-hidden className="shrink-0">
        ·
      </span>
      <span className="shrink-0">{event.category}</span>
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
