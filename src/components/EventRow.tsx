import { Link } from "@tanstack/react-router";

import { SaveButton } from "@/components/SaveButton";
import { formatWhen, isFree, type EventItem } from "@/data/events";

/** One compact calendar line. The row navigates; the heart stays outside it. */
export function EventRow({ event }: { event: EventItem }) {
  return (
    <div className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_auto] items-center rounded-xl bg-card pr-2">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3 text-left active:opacity-70"
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
        <span className="shrink-0 text-[14px] font-semibold text-foreground">
          {isFree(event) ? "Free" : event.price}
        </span>
      </Link>
      <SaveButton id={event.id} />
    </div>
  );
}
