import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";

import { EventCategory, EventMeta, NewBadge } from "@/components/EventMeta";
import { VoteButtons, voteLabel } from "@/components/VoteButtons";
import { priceLabel, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/**
 * A recommendation card. The whole card opens the event page, where tickets and
 * saving live, so the only controls here are the two feedback thumbs.
 */
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const { vote, isSeen } = usePreferences();
  const isNew = event.isNew && !isSeen(event.id);

  return (
    <article className="overflow-hidden rounded-xl bg-card">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="grid min-h-[88px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 p-3 active:opacity-70"
      >
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="size-[60px] shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <EventCategory event={event} />
          <p className="truncate text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-foreground">
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
          {priceLabel(event)}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
      </Link>

      {event.match && (
        <div className="flex items-center gap-2 border-t border-hairline px-3 py-2">
          <Sparkles className="size-3.5 shrink-0 text-rausch" />
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium leading-4 text-muted-foreground">
            {voteLabel(vote(event.id), event.match)}
          </p>
          <VoteButtons id={event.id} />
        </div>
      )}
    </article>
  );
}
