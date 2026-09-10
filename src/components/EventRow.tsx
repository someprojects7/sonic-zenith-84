import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { formatWhen, type EventItem } from "@/data/events";

export function EventRow({ event }: { event: EventItem }) {
  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className="grid min-h-[76px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors active:bg-surface-2"
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
        <p className="line-clamp-1 text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-foreground">
          {event.title}
        </p>
        <p className="mt-1 truncate text-[14px] leading-[1.43] text-muted-foreground">
          {formatWhen(event)} · {event.category}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-[14px] font-semibold text-foreground">{event.price}</span>
        <ChevronRight className="size-[18px] text-muted-foreground" strokeWidth={2} />
      </div>
    </Link>
  );
}
