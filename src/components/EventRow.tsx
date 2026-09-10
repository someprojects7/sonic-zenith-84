import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { EventMeta, NewBadge } from "@/components/EventMeta";
import { isFree, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** One compact calendar line, the same shape and height as a recommendation card. */
export function EventRow({ event }: { event: EventItem }) {
  const { isSeen } = usePreferences();
  const isNew = event.isNew && !isSeen(event.id);

  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className="grid min-h-[80px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-card p-3 text-left active:opacity-70"
    >
      <img
        src={event.image}
        alt={event.title}
        width={1024}
        height={768}
        loading="lazy"
        className="size-[56px] shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-foreground">
          {isNew && (
            <>
              <NewBadge />{" "}
            </>
          )}
          {event.title}
        </p>
        <EventMeta event={event} />
      </div>
      <span className="shrink-0 text-[14px] font-semibold text-foreground">
        {isFree(event) ? "Free" : event.price}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
    </Link>
  );
}
