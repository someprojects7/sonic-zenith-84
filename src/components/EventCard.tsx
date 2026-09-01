import { ArrowUpRight, MapPin, Share2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-elevated ring-1 ring-hairline">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          width={1024}
          height={768}
          loading={featured ? undefined : "lazy"}
          className="h-52 w-full object-cover"
        />
        <div className="absolute inset-0 bg-scrim" />
        <span className="absolute left-4 top-4 rounded-full bg-glass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-md">
          {event.category}
        </span>
        {typeof event.match === "number" && (
          <span className="absolute right-4 top-4 rounded-full bg-glass px-3 py-1 text-[11px] font-semibold text-brand backdrop-blur-md">
            {event.match}% match
          </span>
        )}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <h3 className="min-w-0 text-[19px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex min-w-0 items-center gap-2 text-[13px] text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-brand" />
          <span className="truncate">
            {event.day} · {event.time} · {event.venue}
          </span>
        </div>

        {event.reason && (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-2 p-3">
            <p className="flex min-w-0 gap-2 text-[13px] leading-snug text-muted-foreground">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>{event.reason}</span>
            </p>
            <div className="flex shrink-0 gap-1.5">
              <button
                aria-label="Good pick"
                onClick={() => setVote(vote === "up" ? null : "up")}
                className={cn(
                  "grid size-9 place-items-center rounded-full ring-1 ring-hairline transition-colors",
                  vote === "up" ? "bg-brand text-brand-foreground" : "text-muted-foreground",
                )}
              >
                <ThumbsUp className="size-4" />
              </button>
              <button
                aria-label="Not for me"
                onClick={() => setVote(vote === "down" ? null : "down")}
                className={cn(
                  "grid size-9 place-items-center rounded-full ring-1 ring-hairline transition-colors",
                  vote === "down" ? "bg-surface-3 text-foreground" : "text-muted-foreground",
                )}
              >
                <ThumbsDown className="size-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient text-[15px] font-semibold text-brand-foreground shadow-brand transition-transform active:scale-[0.98]">
            {event.price === "Free" || event.price === "Free entry" ? "Details" : `Tickets · ${event.price}`}
            <ArrowUpRight className="size-4" />
          </button>
          <button
            aria-label="Share"
            className="grid size-12 shrink-0 place-items-center rounded-full text-muted-foreground ring-1 ring-hairline transition-colors active:bg-surface-2"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
