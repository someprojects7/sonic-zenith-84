import { Check, X } from "lucide-react";

import { categories } from "@/data/events";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** "Most popular" is not a category: it pulls the highest-matching events up. */
export const POPULAR = "Most popular";

const OPTIONS = [POPULAR, ...categories.filter((c) => c !== "All")];

/**
 * The first thing a newcomer does: tap what they are into. One row, no form,
 * no account. The feed reorders itself immediately.
 */
export function InterestPicker({ onDismiss }: { onDismiss?: () => void }) {
  const { interests, toggleInterest } = usePreferences();

  return (
    <section className="rounded-xl bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold leading-5 text-foreground">
            {interests.length === 0 ? "What are you into?" : "Your interests"}
          </h3>
          <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">
            {interests.length === 0
              ? "Tap a few and your week reorders."
              : `${interests.length} selected`}
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Hide interests"
            className="icon-button press -mr-1 -mt-1 size-8 shrink-0 text-muted-foreground"
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const active = interests.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleInterest(option)}
              aria-pressed={active}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium transition-colors",
                active
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-2 text-muted-foreground ring-1 ring-hairline",
              )}
            >
              {active && <Check className="size-3.5" strokeWidth={2.5} />}
              {option}
            </button>
          );
        })}
      </div>

      {/* On the feed the block is a one-off task, so it ends with a clear done
          action. In the profile it is a permanent setting and needs no button. */}
      {onDismiss && interests.length > 0 && (
        <button
          type="button"
          onClick={onDismiss}
          className="press mt-4 flex h-11 w-full items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-brand-foreground"
        >
          Save interests
        </button>
      )}
    </section>
  );
}
