import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatWhen, isFree, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/** A compact recommendation with one clear action and quiet feedback controls. */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const free = isFree(event);

  return (
    <article className="rounded-2xl bg-card p-3.5 ring-1 ring-hairline">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-3"
      >
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="size-[52px] shrink-0 rounded-xl object-cover ring-1 ring-hairline"
        />
        <div className="min-w-0">
          <span className="eyebrow-brand text-[10px]">
            {event.match ? `${event.match}% match` : event.category}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-[1.18] text-foreground">
            {event.title}
          </h3>
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] leading-4 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-brand" />
            <span className="truncate">
              {formatWhen(event)} · {event.city}
            </span>
          </div>
        </div>
      </Link>

      {event.reason && (
        <div className="mt-3 flex min-w-0 items-center gap-2 border-t border-hairline pt-2.5">
          <Sparkles className="size-3.5 shrink-0 text-brand" />
          <p className="min-w-0 truncate text-[12px] leading-4 text-muted-foreground">
            {vote === "up"
              ? "Thanks — more like this."
              : vote === "down"
                ? "Got it — fewer like this."
                : event.reason}
          </p>
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2">
        <Link
          to="/event/$id"
          params={{ id: event.id }}
          className="btn-brand h-10 shrink-0 px-3.5 text-[13px]"
        >
          <span>{free ? "View event" : `Tickets · ${event.price}`}</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
        {event.reason && (
          <div className="ml-auto flex shrink-0 items-center gap-0.5">
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
        )}
      </div>
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
        "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors",
        active ? activeClass : "active:bg-surface-3",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
