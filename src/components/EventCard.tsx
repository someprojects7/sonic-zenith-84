import { ArrowUpRight, MapPin, Share2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const isFree = event.price.toLowerCase().startsWith("free");

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-elevated ring-1 ring-hairline">
      {/* Cover: fixed 3:2 ratio keeps every card the same height so the scroll rhythm is predictable */}
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
          <span className="truncate rounded-full bg-glass px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-md">
            {event.category}
          </span>
          {/* Share lives on the cover so the action row below stays a single decision */}
          <button
            aria-label="Share"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-glass text-foreground backdrop-blur-md transition-transform active:scale-95"
          >
            <Share2 className="size-[17px]" />
          </button>
        </div>
      </div>

      {/* Content: 20px gutter, 12px rhythm between text blocks, 16px before the single action */}
      <div className="p-5">
        <h3 className="text-[20px] font-semibold leading-[1.2] text-foreground text-balance-tight">
          {event.title}
        </h3>

        <div className="mt-2.5 flex min-w-0 items-center gap-2 text-[13px] leading-5 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-brand" />
          <span className="truncate">
            {event.day} · {event.time} · {event.venue}
          </span>
        </div>

        {event.reason && (
          <div className="mt-3.5 flex items-start gap-2.5 rounded-2xl bg-surface-2 p-3.5">
            <Sparkles className="mt-px size-4 shrink-0 text-brand" />
            <p className="min-w-0 flex-1 text-[13px] leading-[1.45] text-muted-foreground">
              {event.reason}
              {typeof event.match === "number" && (
                <span className="font-semibold text-brand"> · {event.match}% match</span>
              )}
            </p>
            {/* Feedback reduced to two quiet glyphs attached to the reason it rates */}
            <div className="-my-1 flex shrink-0 items-center">
              <button
                aria-label="Good pick"
                onClick={() => setVote(vote === "up" ? null : "up")}
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors",
                  vote === "up" ? "text-brand" : "text-surface-3 hover:text-muted-foreground",
                )}
              >
                <ThumbsUp className="size-[17px]" />
              </button>
              <button
                aria-label="Not for me"
                onClick={() => setVote(vote === "down" ? null : "down")}
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors",
                  vote === "down" ? "text-foreground" : "text-surface-3 hover:text-muted-foreground",
                )}
              >
                <ThumbsDown className="size-[17px]" />
              </button>
            </div>
          </div>
        )}

        <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 text-[15px] font-semibold text-brand-foreground shadow-brand transition-transform active:scale-[0.98]">
          <span className="truncate">{isFree ? "See details" : `Tickets · ${event.price}`}</span>
          <ArrowUpRight className="size-4 shrink-0" />
        </button>
      </div>
    </article>
  );
}
