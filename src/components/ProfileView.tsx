import { Heart, Sparkles, User } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { InterestPicker } from "@/components/InterestPicker";
import { allEvents } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

/** Who Sponsa thinks you are, and the events you kept. */
export function ProfileView({ onReplayTour }: { onReplayTour: () => void }) {
  const { saved, interests } = usePreferences();
  const savedEvents = allEvents.filter((event) => saved.includes(event.id));

  return (
    <main className="space-y-8 pb-6 pt-8">
      <section className="px-5">
        <span className="grid size-16 place-items-center rounded-full bg-brand text-brand-foreground">
          <User className="size-7" strokeWidth={2} />
        </span>
        <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
          You
        </h2>
        <p className="mt-1.5 text-[14px] leading-[1.43] text-muted-foreground">
          {savedEvents.length} saved · {interests.length}{" "}
          {interests.length === 1 ? "interest" : "interests"}
        </p>
      </section>

      <div className="px-5">
        <InterestPicker />
      </div>

      <section className="px-5">
        <h3 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          Saved
        </h3>
        {savedEvents.length > 0 ? (
          <div className="space-y-2">
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-card p-6 text-center">
            <span className="icon-button mx-auto size-11 bg-surface-2 text-muted-foreground">
              <Heart className="size-[18px]" strokeWidth={2} />
            </span>
            <p className="mt-3 text-[16px] font-medium text-foreground">Nothing saved</p>
            <p className="mt-1.5 text-[14px] leading-[1.43] text-muted-foreground">
              Tap a heart to keep an event.
            </p>
          </div>
        )}
      </section>

      <section className="px-5">
        <button
          type="button"
          onClick={onReplayTour}
          className="press flex min-h-12 w-full items-center gap-3 rounded-xl bg-card px-4 text-left"
        >
          <span className="icon-button size-9 bg-surface-2 text-muted-foreground">
            <Sparkles className="size-[17px]" strokeWidth={2} />
          </span>
          <span className="text-[16px] font-medium text-foreground">Show me around again</span>
        </button>
      </section>
    </main>
  );
}
