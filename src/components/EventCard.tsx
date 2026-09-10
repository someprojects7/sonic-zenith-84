import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { SaveButton } from "@/components/SaveButton";
import { formatWhen, isFree, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

/**
 * A recommendation card. The whole card is the tap target and opens the event
 * page — tickets live there, so no competing button here.
 */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <article className="overflow-hidden rounded-xl bg-card">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 active:opacity-70"
      >
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="size-[56px] shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-foreground">
            {event.title}
          </p>
          <p className="mt-1 truncate text-[14px] leading-[1.43] text-muted-foreground">
            {formatWhen(event)} · {event.category}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[14px] font-semibold text-foreground">
            {isFree(event) ? "Free" : event.price}
          </span>
          <SaveButton id={event.id} />
        </div>
      </Link>

      {event.match && (
        <div className="flex items-center gap-2 border-t border-hairline px-3 py-2">
          <Sparkles className="size-3.5 shrink-0 text-rausch" />
          <p className="min-w-0 flex-1 text-[13px] font-medium leading-4 text-muted-foreground">
            {vote === "up"
              ? "More like this"
              : vote === "down"
                ? "Fewer like this"
                : `${event.match}% match`}
          </p>

          <div className="flex shrink-0 items-center gap-0.5">
            <VoteButton
              label="Good pick"
              icon={ThumbsUp}
              active={vote === "up"}
              onClick={() => setVote(vote === "up" ? null : "up")}
            />
            <VoteButton
              label="Not for me"
              icon={ThumbsDown}
              active={vote === "down"}
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
  onClick,
}: {
  label: string;
  icon: typeof ThumbsUp;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-full transition-colors",
        active ? "bg-brand text-brand-foreground" : "text-muted-foreground active:bg-surface-2",
      )}
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  );
}
