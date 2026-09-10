import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { EventMeta, NewBadge } from "@/components/EventMeta";
import { SaveButton } from "@/components/SaveButton";
import { VoteButtons, voteLabel } from "@/components/VoteButtons";
import { isFree, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/**
 * A recommendation card. The whole card is the tap target and opens the event
 * page, where tickets live, so no competing button here.
 */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const { vote, isSeen } = usePreferences();
  const isNew = event.isNew && !isSeen(event.id);

  return (
    <article className="overflow-hidden rounded-xl bg-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center pr-2">
        <Link
          to="/event/$id"
          params={{ id: event.id }}
          className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 active:opacity-70"
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
              {isNew && (
                <>
                  <NewBadge />{" "}
                </>
              )}
              {event.title}
            </p>
            <EventMeta event={event} />
          </div>
          <span className="shrink-0 text-[14px] font-semibold text-foreground">
            {isFree(event) ? "Free" : event.price}
          </span>
        </Link>
        <SaveButton id={event.id} />
      </div>

      {event.match && (
        <div className="flex items-center gap-2 border-t border-hairline px-3 py-2">
          <Sparkles className="size-3.5 shrink-0 text-rausch" />
          <p className="min-w-0 flex-1 text-[13px] font-medium leading-4 text-muted-foreground">
            {voteLabel(vote(event.id), event.match)}
          </p>
          <VoteButtons id={event.id} />
        </div>
      )}
    </article>
  );
}
