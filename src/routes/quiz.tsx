import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { canonicalUrl } from "@/config/site";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Set your taste in a minute | Sponsa" },
      {
        name: "description",
        content:
          "Twenty quick taps and Sponsa knows which nights in the city are yours. Free to start.",
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

function Quiz() {
  const { toggleInterest, interests } = usePreferences();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const total = QUESTIONS.length;
  const done = step >= total;
  const question = QUESTIONS[Math.min(step, total - 1)]!;
  const picked = useMemo(() => answers[question.id] ?? [], [answers, question.id]);
  const progress = done ? 100 : Math.round((step / total) * 100);

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

    if (!question.multi) setStep((s) => s + 1);
  }

  if (done) return <Result answers={answers} />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="icon-button size-9 text-foreground disabled:opacity-30"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full origin-left rounded-full bg-rausch transition-transform duration-200 ease-out"
              style={{ transform: `scaleX(${Math.max(progress, 4) / 100})` }}
            />
          </div>
          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
            {step + 1}/{total}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-5 pb-32 pt-6">
        <h1 className="text-[26px] font-medium leading-[1.12] tracking-[-0.02em] text-foreground">
          {question.title}
        </h1>
        {question.note ? (
          <p className="mt-2 text-[14px] leading-[1.43] text-muted-foreground">{question.note}</p>
        ) : null}

        <div className="mt-6 space-y-2">
          {question.options.map((option) => {
            const active = picked.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                className={`press flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[16px] font-medium ${
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

      {question.multi ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-hairline bg-background/95 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto w-full max-w-lg">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
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

const FREE = ["3 picks a week", "One city", "Basic filters"];
const PRO = [
  "All 10 picks, every week",
  "New events the hour we find them",
  "Saved lists and calendar sync",
  "Every city we cover",
];

function Result({ answers }: { answers: Record<string, string[]> }) {
  const city = answers["city"]?.[0] ?? "your city";
  const scenes = answers["scenes"] ?? [];

  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-lg">
        <span className="icon-button size-11 bg-rausch/10 text-rausch">
          <Sparkles className="size-5" strokeWidth={2.2} />
        </span>
        <h1 className="mt-4 text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
          Your taste is set.
        </h1>
        <p className="mt-3 text-[16px] leading-[1.5] text-muted-foreground">
          {scenes.length
            ? `${scenes.slice(0, 3).join(", ")} in ${city}. Your first picks are ready.`
            : `We are reading ${city} right now. Your first picks are ready.`}
        </p>

        <div className="mt-7 space-y-2">
          <div className="rounded-xl border border-hairline bg-card p-4">
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[17px] font-medium text-foreground">Start free</span>
              <span className="text-[14px] text-muted-foreground">€0</span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {FREE.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <Check className="size-4 shrink-0 text-foreground" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/app"
              className="mt-4 flex h-11 w-full items-center justify-center rounded-full border border-foreground text-[15px] font-semibold text-foreground"
            >
              Open the app
            </Link>
          </div>

          <div className="rounded-xl border-2 border-rausch bg-card p-4">
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[17px] font-medium text-foreground">Sponsa Pro</span>
              <span className="text-[14px] text-muted-foreground">
                <span className="text-[17px] font-semibold text-foreground">€7.99</span> / month
              </span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {PRO.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <Check className="size-4 shrink-0 text-rausch" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to="/app"
              className="cta-halo press mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-rausch text-[15px] font-semibold text-white"
            >
              <Lock className="size-4 shrink-0" />
              Go Pro
            </Link>
            <p className="mt-2 text-center text-[13px] text-muted-foreground">Cancel any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
