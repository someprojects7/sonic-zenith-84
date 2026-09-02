import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatWhen, isFree, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/**
 * Compact recommendation card: the photo is an avatar next to the title, so
 * three cards fit on one mobile screen. Reading order stays identity → when →
 * why → action.
 */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const free = isFree(event);

  return (
    <article className="overflow-hidden rounded-3xl bg-card p-4 shadow-elevated ring-1 ring-hairline">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3.5">
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="size-[68px] shrink-0 rounded-2xl object-cover ring-1 ring-hairline"
        />
        <div className="min-w-0">
          <span className="eyebrow-brand">
            {event.match ? `${event.match}% match` : event.category}
          </span>
          <h3 className="mt-1 line-clamp-2 text-[16px] font-semibold leading-[1.25] text-foreground">
            {event.title}
          </h3>
          <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[12.5px] leading-4 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-brand" />
            <span className="truncate">
              {formatWhen(event)} · {event.city}
            </span>
          </div>
        </div>
      </Link>

      {event.reason && (
        <div className="surface-inset mt-3 p-3">
          <div className="flex gap-2">
            <Sparkles className="mt-[3px] size-3.5 shrink-0 text-brand" />
            <p className="text-[12.5px] leading-[1.4] text-foreground/90">{event.reason}</p>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-hairline pt-2">
            <span className="min-w-0 truncate text-[11.5px] text-muted-foreground">
              {vote === "up"
                ? "Thanks — more like this"
                : vote === "down"
                  ? "Got it — fewer like this"
                  : "Good pick?"}
            </span>
            <div className="-my-1 flex shrink-0 items-center gap-0.5">
              <VoteButton
                label="Good pick"
                icon={ThumbsUp}
                active={vote === "up"}
                activeClass="bg-brand text-brand-foreground"
                onClick={() => setVote(vote === "up" ? null : "up")}
              />
              <VoteButton
                label="Not for me"
                icon={ThumbsDown}
                active={vote === "down"}
                activeClass="bg-surface-3 text-foreground"
                onClick={() => setVote(vote === "down" ? null : "down")}
              />
            </div>
          </div>
        </div>
      )}

      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="btn-brand mt-3 h-11 w-full px-4 text-[14px]">
        <span className="truncate">{free ? "See details" : `Tickets · ${event.price}`}</span>
        <ArrowUpRight className="size-4 shrink-0" />
      </Link>
    </article>
  );
}

function VoteButton({
  label,
  icon: Icon,
  active,
  activeClass,
  onClick,
}: {
  label: string;
  icon: typeof ThumbsUp;
  active: boolean;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-full transition-colors",
        active ? activeClass : "text-muted-foreground active:bg-surface-3",
      )}>
      <Icon className="size-4" />
    </button>
  );
}
