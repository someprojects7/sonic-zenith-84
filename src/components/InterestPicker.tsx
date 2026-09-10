import { Check } from "lucide-react";

import { categories } from "@/data/events";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const OPTIONS = categories.filter((c) => c !== "All");

/**
 * The first thing a newcomer does: tap what they are into. One row, no form,
 * no account. The feed reorders itself immediately.
 */
export function InterestPicker() {
  const { interests, toggleInterest } = usePreferences();

  return (
    <section className="rounded-xl bg-card p-4">
      <h3 className="text-[16px] font-semibold leading-5 text-foreground">
        {interests.length === 0 ? "New in town? Tap what you are into" : "What you are into"}
      </h3>
      <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">
        {interests.length === 0
          ? "Two taps and the week is sorted for you."
          : `${interests.length} selected. Tap to change any time.`}
      </p>
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
    </section>
  );
}
