import { Link } from "@tanstack/react-router";
import { Martini, Music, Palette, PartyPopper, Sparkles, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { NewBadge } from "@/components/EventMeta";
import { VoteButtons } from "@/components/VoteButtons";
import { priceLabel, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** One icon per category, so the left block reads at a glance. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Festivals: PartyPopper,
  Clubs: Martini,
  "Live music": Music,
  Art: Palette,
  Food: UtensilsCrossed,
};

/**
 * A recommendation card: a category icon on the left, the match and category on
 * one line, then the title, and the date, time and price on the last line.
 * The whole card opens the event page; the vote buttons stay clickable on top.
 */
export function EventCard({ event }: { event: EventItem }) {
  const { isSeen } = usePreferences();
  const isNew = Boolean(event.isNew) && !isSeen(event.id);
  const Icon = CATEGORY_ICONS[event.category] ?? Sparkles;

  return (
    <article className="relative flex items-center gap-3 rounded-xl bg-card p-3">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        aria-label={event.title}
        className="press absolute inset-0 rounded-xl"
      />

      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rausch/10 text-rausch">
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {event.match && <span className="shrink-0 text-rausch">{event.match}% match ·</span>}
          <span className="truncate">{event.category}</span>
          {isNew && <NewBadge />}
        </p>
        <p className="line-clamp-2 text-[16px] font-medium leading-[1.25] text-foreground">
          {event.title}
        </p>
        <p className="mt-0.5 whitespace-nowrap text-[12px] leading-[1.4] text-muted-foreground">
          {event.day} · {event.time} ·{" "}
          <span className="font-semibold text-foreground">{priceLabel(event)}</span>
        </p>
      </div>

      <div className="relative shrink-0" data-tour-vote>
        <VoteButtons id={event.id} />
      </div>
    </article>
  );
}
