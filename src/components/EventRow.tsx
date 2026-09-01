import { ChevronRight } from "lucide-react";
import type { EventItem } from "@/data/events";

export function EventRow({ event }: { event: EventItem }) {
  return (
    <button className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2 text-left transition-colors active:bg-surface-2">
      <img
        src={event.image}
        alt={event.title}
        width={1024}
        height={768}
        loading="lazy"
        className="size-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-foreground">{event.title}</p>
        <p className="truncate text-[13px] text-muted-foreground">
          {event.day} · {event.time} · {event.venue}
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-brand">{event.price}</p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
