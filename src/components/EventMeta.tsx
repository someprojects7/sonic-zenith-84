import type { EventItem } from "@/data/events";

/**
 * One line under a title: day, then category. Never wraps and never clips, so
 * every card in the list is exactly the same height.
 */
export function EventMeta({ event }: { event: EventItem }) {
  return (
    <p className="mt-1 flex items-center gap-1.5 text-[14px] leading-[1.43] text-muted-foreground">
      <span className="whitespace-nowrap">{event.day}</span>
      <span aria-hidden>·</span>
      <span className="whitespace-nowrap">{event.category}</span>
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
