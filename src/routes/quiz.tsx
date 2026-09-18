import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CITY, canonicalUrl } from "@/config/site";
import { formatWhen, picks, priceLabel } from "@/data/events";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Set your taste in a minute | Sponsa" },
      {
        name: "description",
        content:
          "Twenty quick taps and Sponsa knows which nights in the city are yours. Seven days free.",
      },
      { property: "og:title", content: "Set your taste in a minute" },
      {
        property: "og:description",
        content: "Twenty quick taps and your week in the city is planned.",
      },

      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/quiz") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/quiz") }],
  }),
  component: Quiz,
});

type Question = {
  id: string;
  title: string;
  note?: string;
  options: string[];
  multi?: boolean;
  /** Answers here also drive the picks in the app. */
  interests?: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: "city",
    title: "Which city are you in?",
    options: ["Vilnius", "Warsaw", "Berlin", "Somewhere else"],
  },
  {
    id: "newcomer",
    title: "How long have you been here?",
    options: ["Just arrived", "A few months", "A few years", "All my life"],
  },
  {
    id: "scenes",
    title: "What pulls you out of the house?",
    note: "Pick as many as you like",
    multi: true,
    interests: true,
    options: [
      "Music",
      "Art",
      "Clubs",
      "Food",
      "Film",
      "Theatre",
      "Sports",
      "Talks",
      "Outdoors",
      "Markets",
    ],
  },
  {
    id: "music",
    title: "Your sound?",
    multi: true,
    options: ["Techno", "House", "Live bands", "Jazz", "Classical", "Hip hop", "Ambient"],
  },
  {
    id: "energy",
    title: "Ideal night?",
    options: ["Loud and late", "Warm and social", "Quiet and curious", "Depends on the week"],
  },
  {
    id: "nights",
    title: "Which nights are yours?",
    multi: true,
    options: ["Thursday", "Friday", "Saturday", "Sunday", "Weekdays too"],
  },
  {
    id: "start",
    title: "When do you like to start?",
    options: ["Before 18:00", "18:00 to 21:00", "After 21:00", "After midnight"],
  },
  {
    id: "frequency",
    title: "How often do you go out?",
    options: ["Once a week", "Two or three times", "Almost daily", "Once a month"],
  },
  {
    id: "company",
    title: "Who is usually with you?",
    options: ["Alone", "Partner", "Close friends", "A big group"],
  },
  {
    id: "budget",
    title: "Comfortable ticket price?",
    options: ["Free only", "Up to €15", "Up to €40", "Price is not the issue"],
  },
  {
    id: "distance",
    title: "How far will you travel?",
    options: ["Walking distance", "Up to 20 min", "Anywhere in the city", "Nearby towns too"],
  },
  {
    id: "size",
    title: "Room size you enjoy?",
    options: ["Under 50 people", "Small venue", "Big hall", "Festival scale"],
  },
  {
    id: "discovery",
    title: "New or known?",
    options: ["Names I know", "Mostly new things", "Half and half"],
  },
  {
    id: "food",
    title: "Food and drinks matter?",
    options: ["Essential", "Nice to have", "Not really"],
  },
  {
    id: "plan",
    title: "How do you plan?",
    options: ["Weeks ahead", "A few days", "Same day", "Never plan"],
  },
  {
    id: "language",
    title: "Language for events?",
    multi: true,
    options: ["English", "Lithuanian", "Russian", "No talking needed"],
  },
  {
    id: "avoid",
    title: "Anything you would rather skip?",
    multi: true,
    options: ["Crowds", "Standing all night", "Smoke", "Loud bass", "Nothing"],
  },
  {
    id: "source",
    title: "How do you find events today?",
    multi: true,
    options: ["Instagram", "Friends", "Facebook events", "Ticket sites", "I mostly miss them"],
  },
  {
    id: "pain",
    title: "What annoys you most?",
    options: [
      "Finding out too late",
      "Endless scrolling",
      "Same places every time",
      "Nothing good nearby",
    ],
  },
  {
    id: "goal",
    title: "What would a good week look like?",
    options: [
      "Two solid nights out",
      "One perfect night",
      "Something new every day",
      "Just never bored",
    ],
  },
];

/**
 * Reassurance screens shown between question blocks. Keyed by the number of
 * answered questions. They keep a 20-question flow from feeling like a form.
 */
const INTERSTITIALS: Record<number, { title: string; body: string; stats: [string, string][] }> = {
  5: {
    title: "Good start.",
    body: "Your taste already narrows the week down.",
    stats: [
      ["50+", "sources we read"],
      ["700+", "events a week"],
    ],
  },
  12: {
    title: "Almost there.",
    body: "The last few taps decide what lands in your picks.",
    stats: [
      ["10", "picks for you"],
      ["3h", "saved a week"],
    ],
  },
};

const LOADER_LINES = [
  "Reading your answers",
  "Scanning this week in the city",
  "Matching events to your taste",
  "Picking your ten",
];

function Quiz() {
  const { toggleInterest, interests } = usePreferences();
  const [step, setStep] = useState(0);
  const [pause, setPause] = useState<"interstitial" | null>(null);
  const [back, setBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const total = QUESTIONS.length;
  const done = step >= total;
  const question = QUESTIONS[Math.min(step, total - 1)]!;
  const picked = useMemo(() => answers[question.id] ?? [], [answers, question.id]);
  const progress = done ? 100 : Math.round((step / total) * 100);

  function advance(from: number) {
    setBack(false);
    const next = from + 1;
    if (INTERSTITIALS[next] && next < total) {
      setPause("interstitial");
      setStep(next);
      return;
    }
    if (next >= total) {
      setLoading(true);
      setStep(next);
      return;
    }
    setStep(next);
  }

  function goBack() {
    setBack(true);
    setPause(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function choose(option: string) {
    const isInterest = question.interests === true;
    if (isInterest) {
      const active = interests.includes(option);
      const shouldToggle = question.multi ? true : !active;
      if (shouldToggle) toggleInterest(option);
    }

    setAnswers((current) => {
      const existing = current[question.id] ?? [];
      const next = question.multi
        ? existing.includes(option)
          ? existing.filter((o) => o !== option)
          : [...existing, option]
        : [option];
      return { ...current, [question.id]: next };
    });

    // Single choice auto-advances, with a beat so the tick is visible.
    if (!question.multi) {
      const current = step;
      window.setTimeout(() => advance(current), 190);
    }
  }

  if (loading) return <Loader onDone={() => setLoading(false)} />;
  if (done) return <Result answers={answers} />;

  const pausePanel = pause === "interstitial" ? INTERSTITIALS[step] : undefined;
  const enter = back ? "step-in-back" : "step-in-forward";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-5">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="icon-button size-9 text-foreground disabled:opacity-30"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full origin-left rounded-full bg-rausch transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${Math.max(progress, 4) / 100})` }}
            />
          </div>
          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
            {Math.min(step + 1, total)}/{total}
          </span>
        </div>
      </header>

      {pausePanel ? (
        <main
          key={`pause-${step}`}
          className={`mx-auto w-full max-w-lg flex-1 px-5 pb-32 pt-10 ${enter}`}
        >
          <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
            {pausePanel.title}
          </h1>
          <p className="mt-3 text-[16px] leading-[1.5] text-muted-foreground">{pausePanel.body}</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {pausePanel.stats.map(([value, label], i) => (
              <div
                key={label}
                className="rise-in rounded-xl border border-hairline bg-card p-4"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <p className="text-[22px] font-semibold text-foreground">{value}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPause(null)}
            className="cta-halo press mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rausch text-[15px] font-semibold text-white"
          >
            Keep going
            <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} />
          </button>
        </main>
      ) : (
        <main
          key={question.id}
          className={`mx-auto w-full max-w-lg flex-1 px-5 pb-32 pt-6 ${enter}`}
        >
          <h1 className="text-[26px] font-medium leading-[1.12] tracking-[-0.02em] text-foreground">
            {question.title}
          </h1>
          {question.note ? (
            <p className="mt-2 text-[14px] leading-[1.43] text-muted-foreground">{question.note}</p>
          ) : null}

          <div className="mt-6 space-y-2">
            {question.options.map((option, i) => {
              const active = picked.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  style={{ animationDelay: `${40 + i * 35}ms` }}
                  className={`rise-in press flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[16px] font-medium ${
                    active
                      ? "border-rausch bg-rausch/5 text-foreground"
                      : "border-hairline bg-card text-foreground hover:border-foreground/30"
                  }`}
                >
                  <span className="min-w-0">{option}</span>
                  {active ? (
                    <Check className="size-5 shrink-0 text-rausch" strokeWidth={2.5} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </main>
      )}

      {question.multi && !pausePanel ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-hairline bg-background/95 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto w-full max-w-lg">
            <button
              type="button"
              onClick={() => advance(step)}
              className="cta-halo press flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rausch text-[15px] font-semibold text-white"
            >
              {picked.length ? "Continue" : "Skip"}
              <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Curation screen: the work between the last answer and the reveal, so the
 * result feels earned rather than instant.
 */
function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(2);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + 2));
    }, 32);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    if (pct < 100) return;
    const t = window.setTimeout(onDone, 380);
    return () => window.clearTimeout(t);
  }, [pct, onDone]);

  const stage = Math.min(LOADER_LINES.length - 1, Math.floor(pct / 26));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="w-full max-w-lg">
        <p className="text-[44px] font-semibold leading-none tabular-nums text-foreground">
          {pct}%
        </p>
        <h1 className="mt-3 text-[26px] font-medium leading-[1.12] tracking-[-0.02em] text-foreground">
          Building your week
        </h1>
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full origin-left rounded-full bg-rausch transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
        <div className="mt-6 space-y-2.5">
          {LOADER_LINES.map((line, i) => (
            <p
              key={line}
              className={`flex items-center gap-2.5 text-[14px] transition-colors duration-200 ${
                i <= stage ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {i < stage ? (
                <Check className="size-4 shrink-0 text-rausch" strokeWidth={2.5} />
              ) : (
                <span
                  className={`size-4 shrink-0 rounded-full border ${
                    i === stage
                      ? "border-rausch border-t-transparent animate-spin"
                      : "border-hairline"
                  }`}
                />
              )}
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Value reveal. The playbook rule: the paywall follows evidence. We name the
 * answers back, show three real picks, and keep the rest as visible depth.
 */
function Result({ answers }: { answers: Record<string, string[]> }) {
  const city = answers["city"]?.[0] ?? CITY;
  const scenes = answers["scenes"] ?? [];
  const preview = picks.slice(0, 3);
  const locked = Math.max(0, 10 - preview.length);

  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-lg">
        <span className="icon-button size-11 bg-rausch/10 text-rausch">
          <Sparkles className="size-5" strokeWidth={2.2} />
        </span>
        <h1 className="mt-4 text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
          Your week is ready
        </h1>
        <p className="mt-3 text-[16px] leading-[1.5] text-muted-foreground">
          {scenes.length
            ? `${scenes.slice(0, 3).join(", ")} in ${city}. Ten picks matched, three of them below.`
            : `Ten picks matched in ${city}, three of them below.`}
        </p>

        <div className="mt-6 space-y-2">
          {preview.map((event) => (
            <div key={event.id} className="rounded-xl border border-hairline bg-card p-3">
              <p className="flex items-center justify-between gap-3">
                <span className="truncate text-[16px] font-medium text-foreground">
                  {event.title}
                </span>
                {event.match ? (
                  <span className="shrink-0 text-[14px] font-semibold text-rausch">
                    {event.match}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 truncate text-[14px] text-muted-foreground">
                {formatWhen(event)} · {event.category} · {priceLabel(event)}
              </p>
            </div>
          ))}

          <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-hairline p-3">
            <Lock className="size-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 text-[14px] text-muted-foreground">
              {locked} more picks waiting for this week
            </p>
          </div>
        </div>

        <Link
          to="/paywall"
          className="cta-halo press mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rausch text-[15px] font-semibold text-white"
        >
          See my full week
          <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} />
        </Link>
        <p className="mt-3 text-center text-[13px] text-muted-foreground">
          Seven days free, then €7.99 a month. Cancel any time.
        </p>
      </div>
    </div>
  );
}
