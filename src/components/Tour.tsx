import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type TourStep = {
  /** CSS selector of the element to highlight; the step is skipped if absent. */
  selector: string;
  title: string;
  body: string;
};

type Box = { top: number; left: number; width: number; height: number };

/** Breathing room around the highlighted element. */
const PAD = 8;
/** Space between the cut-out and the tooltip. */
const GAP = 12;

/**
 * First-run coach marks: the rest of the screen dims, one element stays lit and
 * a short tooltip explains it. One idea per step, always skippable, and the
 * highlighted element is scrolled into view before it is shown.
 *
 * Positions are measured against this overlay's own box, so it also works inside
 * the desktop phone frame (a transformed ancestor).
 */
export function Tour({
  steps,
  onFinish,
  startDelay = 700,
}: {
  steps: TourStep[];
  onFinish: () => void;
  startDelay?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [ready, setReady] = useState(false);

  const step = steps[index];

  // Let the feed paint (and settle) before the first coach mark appears.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), startDelay);
    return () => window.clearTimeout(timer);
  }, [startDelay]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root || !step) return;
    const target = document.querySelector(step.selector);
    if (!target) {
      setBox(null);
      return;
    }
    const origin = root.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    setBox({
      top: rect.top - origin.top,
      left: rect.left - origin.left,
      width: rect.width,
      height: rect.height,
    });
  }, [step]);

  // Bring the target into view, then follow it while the page moves.
  useLayoutEffect(() => {
    if (!ready || !step) return;
    const target = document.querySelector(step.selector);
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
    const timer = window.setTimeout(measure, 320);
    measure();

    const onMove = () => measure();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [ready, step, measure]);

  const next = () => (index + 1 < steps.length ? setIndex(index + 1) : onFinish());

  // Escape skips, arrows and Enter move on: the tour is keyboard reachable too.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onFinish();
      if (event.key === "Enter" || event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!ready || !step) return null;

  const last = index === steps.length - 1;
  const hole = box && {
    top: box.top - PAD,
    left: box.left - PAD,
    width: box.width + PAD * 2,
    height: box.height + PAD * 2,
  };
  // Tooltip sits under the highlight, or above it when the bottom is crowded.
  const rootHeight = rootRef.current?.clientHeight ?? 0;
  const below = !hole || hole.top + hole.height < rootHeight - 220;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Quick tour"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* The dim layer: tapping anywhere moves the tour forward. */}
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className={cn("absolute inset-0 h-full w-full cursor-default", !hole && "bg-black/55")}
      />

      {hole && (
        <div
          aria-hidden
          style={{ ...hole, boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }}
          className="pointer-events-none absolute rounded-xl ring-2 ring-rausch transition-all duration-300 ease-out"
        />
      )}

      <div
        style={
          hole
            ? below
              ? { top: hole.top + hole.height + GAP }
              : { bottom: rootHeight - hole.top + GAP }
            : { top: "50%" }
        }
        className="pointer-events-none absolute inset-x-4 mx-auto max-w-[360px] transition-all duration-300 ease-out"
      >
        {/* Coaching layer, not app furniture: dark ink bubble so it never reads
            as a card the person could interact with. */}
        <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-1 rounded-xl bg-[#222222] px-4 py-3.5 duration-200">
          <p className="text-[16px] font-semibold leading-5 text-white">{step.title}</p>
          <p className="mt-1 text-[14px] leading-[1.43] text-white/70">{step.body}</p>

          <div className="mt-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              {steps.map((s, i) => (
                <span
                  key={s.selector}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-4 bg-white" : "w-1.5 bg-white/30",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {!last && (
                <button
                  type="button"
                  onClick={onFinish}
                  className="press flex h-9 items-center rounded-full px-3 text-[14px] font-medium text-white/60"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={next}
                className="press flex h-9 items-center rounded-full bg-white px-4 text-[14px] font-semibold text-[#222222]"
              >
                {last ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
