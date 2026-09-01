import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { EventItem } from "@/data/events";

export function EventRow({ event }: { event: EventItem }) {
  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className="-mx-2 grid min-h-[76px] w-[calc(100%+1rem)] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl px-2 py-3 text-left transition-colors active:bg-surface-2">
      <img
        src={event.image}
        alt={event.title}
        width={1024}
        height={768}
        loading="lazy"
        className="size-14 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold leading-5 text-foreground">
          {event.title}
        </p>
        <p className="mt-1 truncate text-[13px] leading-[1.35] text-muted-foreground">
          {event.day} · {event.time} · {event.category}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-[12px] font-semibold text-brand">{event.price}</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
