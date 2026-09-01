import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Share2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatWhen, isFree, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

const VOTE_LABELS = {
  up: "Thanks — more like this",
  down: "Got it — fewer like this",
  none: "Was this a good pick?",
} as const;

/** Full-attention card for a recommended event: cover, what it is, why it's here, one action. */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const free = isFree(event);

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-elevated ring-1 ring-hairline">
      {/* Fixed 3:2 cover keeps every card the same height, so the scroll rhythm is predictable */}
      <div className="relative aspect-[3/2] w-full">
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="truncate rounded-full bg-glass-media px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md">
            {event.category}
          </span>
          {/* Share sits on the cover so the action row below stays a single decision */}
          <button
            aria-label="Share"
            className="icon-button size-9 bg-glass-media backdrop-blur-md"
          >
            <Share2 className="size-[17px]" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <Link to="/event/$id" params={{ id: event.id }} className="block">
          <h3 className="text-[20px] font-semibold leading-[1.2] text-foreground text-balance-tight">
            {event.title}
          </h3>
          {/* City only on the feed — the full address belongs to the event page */}
          <div className="mt-2.5 flex min-w-0 items-center gap-2 text-[13px] leading-5 text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-brand" />
            <span className="truncate">
              {formatWhen(event)} · {event.city}
            </span>
          </div>
        </Link>

        {event.reason && (
          <div className="surface-inset mt-3.5 p-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0 text-brand" />
              <span className="eyebrow-brand">
                {event.match ? `${event.match}% match` : "Why this pick"}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-[1.45] text-foreground/90">{event.reason}</p>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-hairline pt-3">
              <span className="min-w-0 truncate text-[12px] text-muted-foreground">
                {VOTE_LABELS[vote ?? "none"]}
              </span>
              <div className="-my-1.5 flex shrink-0 items-center gap-1">
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

        <Link to="/event/$id" params={{ id: event.id }} className="btn-brand mt-4 w-full px-4">
          <span className="truncate">{free ? "See details" : `Tickets · ${event.price}`}</span>
          <ArrowUpRight className="size-4 shrink-0" />
        </Link>
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
        "grid size-10 place-items-center rounded-full transition-colors",
        active ? activeClass : "text-muted-foreground active:bg-surface-3",
      )}
    >
      <Icon className="size-[17px]" />
    </button>
  );
}
