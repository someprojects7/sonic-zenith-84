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
    <article className="relative flex items-center gap-3 bg-card px-4 py-2.5">
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        aria-label={event.title}
        className="absolute inset-0 transition-colors active:bg-surface-2"
      />

      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-rausch text-primary-foreground dark:text-foreground">
        <Icon className="size-[18px]" strokeWidth={2} />
      </div>

      <div className="pointer-events-none relative min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
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
