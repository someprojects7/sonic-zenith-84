import { ChevronRight } from "lucide-react";
import type { EventItem } from "@/data/events";

export function EventRow({ event }: { event: EventItem }) {
  return (
    <button className="grid min-h-[72px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl px-2 py-2.5 text-left transition-colors active:bg-surface-2">
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
          {event.day} · {event.time} · {event.venue}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-[12px] font-semibold text-brand">{event.price}</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </button>
  );
}
