import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatWhen, isFree, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/**
 * A recommendation card. The whole card is the tap target and opens the event
 * page — tickets live there, so no competing button here.
 */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <article className="surface-card overflow-hidden">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 p-3.5 active:opacity-70"
      >
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="size-[54px] shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-[15px] font-bold leading-[1.3] tracking-[-0.01em] text-foreground">
            {event.title}
          </p>
          <p className="mt-[3px] truncate text-[12px] leading-snug text-muted-foreground">
            {formatWhen(event)} · {event.category}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-[12px] font-bold text-brand">
            {isFree(event) ? "Free" : event.price}
          </span>
          <ChevronRight className="size-[18px] text-muted-foreground" strokeWidth={2.2} />
        </div>
      </Link>

      {(event.match || event.reason) && (
        <div className="flex items-center gap-2 bg-tone-cool px-3.5 py-2">
          <Sparkles className="size-3.5 shrink-0 text-brand" />
          <p className="min-w-0 flex-1 text-[12px] font-semibold leading-4 text-brand">
            {vote === "up"
              ? "Thanks — more like this."
              : vote === "down"
                ? "Got it — fewer like this."
                : event.match
                  ? `${event.match}% match`
                  : "Recommended"}
          </p>

          <div className="flex shrink-0 items-center gap-0.5">
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
      )}
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
        active ? activeClass : "active:bg-card",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
