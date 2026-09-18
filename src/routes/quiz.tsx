import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Building2,
  Bus,
  CalendarClock,
  CalendarDays,
  Check,
  Cigarette,
  Clock,
  Coffee,
  Compass,
  Disc3,
  Dumbbell,
  Facebook,
  Film,
  Flame,
  Footprints,
  Globe,
  Guitar,
  Headphones,
  Heart,
  Instagram,
  Languages,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  Mic,
  Moon,
  MoonStar,
  Music,
  Palette,
  PartyPopper,
  Piano,
  Radar,
  Repeat,
  Search,
  ShoppingBag,
  Sparkles,
  Speaker,
  Star,
  Sun,
  Sunset,
  Target,
  Tent,
  Theater,
  ThumbsUp,
  Ticket,
  Train,
  Trees,
  User,
  UserRound,
  Users,
  UtensilsCrossed,
  Volume2,
  Wallet,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";
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

/**
 * Layout per question, so twenty steps don't read as one long form:
 * - tiles: two-column icon cards
 * - rows: full-width icon rows
 * - chips: wrapping pills
 * - scale: ordered rows with a growing level bar
 */
type Layout = "tiles" | "rows" | "chips" | "scale" | "days";

type Question = {
  id: string;
  title: string;
  note?: string;
  icon: LucideIcon;
  layout: Layout;
  options: string[];
  multi?: boolean;
  /** Answers here also drive the picks in the app. */
  interests?: boolean;
};

/** Icons are per option where an option has an obvious symbol. */
const OPTION_ICON: Record<string, LucideIcon> = {
  // cities and time here
  Vilnius: MapPin,
  Warsaw: MapPin,
  Berlin: MapPin,
  "Somewhere else": Globe,
  "Just arrived": Compass,
  "A few months": CalendarDays,
  "A few years": Building2,
  "All my life": Heart,

  // scenes
  Music: Music,
  Art: Palette,
  Clubs: Disc3,
  Food: UtensilsCrossed,
  Film: Film,
  Theatre: Theater,
  Sports: Dumbbell,
  Talks: Mic,
  Outdoors: Trees,
  Markets: ShoppingBag,

  // sound
  Techno: Speaker,
  House: Headphones,
  "Live bands": Guitar,
  Jazz: Piano,
  Classical: Piano,
  "Hip hop": Mic,
  Ambient: Moon,

  // energy
  "Loud and late": Flame,
  "Warm and social": Users,
  "Quiet and curious": Coffee,
  "Depends on the week": Repeat,

  // start
  "Before 18:00": Sun,
  "18:00 to 21:00": Sunset,
  "After 21:00": Moon,
  "After midnight": MoonStar,

  // company
  Alone: User,
  Partner: UserRound,
  "Close friends": Users,
  "A big group": PartyPopper,

  // distance
  "Walking distance": Footprints,
  "Up to 20 min": Bus,
  "Anywhere in the city": MapPin,
  "Nearby towns too": Train,

  // discovery
  "Names I know": Star,
  "Mostly new things": Sparkles,
  "Half and half": Layers,

  // food
  Essential: Wine,
  "Nice to have": Coffee,
  "Not really": ThumbsUp,

  // language
  English: Languages,
  Lithuanian: Languages,
  Russian: Languages,
  "No talking needed": MessageSquare,

  // avoid
  Crowds: Users,
  "Standing all night": Armchair,
  Smoke: Cigarette,
  "Loud bass": Volume2,
  Nothing: Check,

  // sources
  Instagram: Instagram,
  Friends: Users,
  "Facebook events": Facebook,
  "Ticket sites": Ticket,
  "I mostly miss them": Search,

  // pain and goal
  "Finding out too late": Clock,
  "Endless scrolling": Search,
  "Same places every time": Repeat,
  "Nothing good nearby": MapPin,
  "Two solid nights out": CalendarDays,
  "One perfect night": Star,
  "Something new every day": Sparkles,
  "Just never bored": Zap,
};

const QUESTIONS: Question[] = [
  {
    id: "city",
    title: "Which city are you in?",
    icon: MapPin,
    layout: "tiles",
    options: ["Vilnius", "Warsaw", "Berlin", "Somewhere else"],
  },
  {
    id: "newcomer",
    title: "How long have you been here?",
    icon: Compass,
    layout: "rows",
    options: ["Just arrived", "A few months", "A few years", "All my life"],
  },
  {
    id: "scenes",
    title: "What pulls you out of the house?",
    note: "Pick as many as you like",
    icon: Sparkles,
    layout: "tiles",
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
    icon: Headphones,
    layout: "chips",
    multi: true,
    options: ["Techno", "House", "Live bands", "Jazz", "Classical", "Hip hop", "Ambient"],
  },
  {
    id: "energy",
    title: "Ideal night?",
    icon: Flame,
    layout: "tiles",
    options: ["Loud and late", "Warm and social", "Quiet and curious", "Depends on the week"],
  },
  {
    id: "nights",
    title: "Which nights are yours?",
    note: "Tap the days you usually go out.",
    icon: CalendarDays,
    layout: "days",
    multi: true,
    options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "start",
    title: "When do you like to start?",
    icon: Clock,
    layout: "rows",
    options: ["Before 18:00", "18:00 to 21:00", "After 21:00", "After midnight"],
  },
  {
    id: "frequency",
    title: "How often do you go out?",
    icon: Repeat,
    layout: "scale",
    options: ["Once a month", "Once a week", "Two or three times", "Almost daily"],
  },
  {
    id: "company",
    title: "Who is usually with you?",
    icon: Users,
    layout: "tiles",
    options: ["Alone", "Partner", "Close friends", "A big group"],
  },
  {
    id: "budget",
    title: "Comfortable ticket price?",
    icon: Wallet,
    layout: "scale",
    options: ["Free only", "Up to €15", "Up to €40", "Price is not the issue"],
  },
  {
    id: "distance",
    title: "How far will you travel?",
    icon: Footprints,
    layout: "rows",
    options: ["Walking distance", "Up to 20 min", "Anywhere in the city", "Nearby towns too"],
  },
  {
    id: "size",
    title: "Room size you enjoy?",
    icon: Building2,
    layout: "scale",
    options: ["Under 50 people", "Small venue", "Big hall", "Festival scale"],
  },
  {
    id: "discovery",
    title: "New or known?",
    icon: Compass,
    layout: "tiles",
    options: ["Names I know", "Mostly new things", "Half and half"],
  },
  {
    id: "food",
    title: "Food and drinks matter?",
    icon: Wine,
    layout: "rows",
    options: ["Essential", "Nice to have", "Not really"],
  },
  {
    id: "plan",
    title: "How do you plan?",
    icon: CalendarClock,
    layout: "scale",
    options: ["Never plan", "Same day", "A few days", "Weeks ahead"],
  },
  {
    id: "language",
    title: "Language for events?",
    icon: Languages,
    layout: "chips",
    multi: true,
    options: ["English", "Lithuanian", "Russian", "No talking needed"],
  },
  {
    id: "avoid",
    title: "Anything you would rather skip?",
    icon: Armchair,
    layout: "tiles",
    multi: true,
    options: ["Crowds", "Standing all night", "Smoke", "Loud bass", "Nothing"],
  },
  {
    id: "source",
    title: "How do you find events today?",
    icon: Search,
    layout: "tiles",
    multi: true,
    options: ["Instagram", "Friends", "Facebook events", "Ticket sites", "I mostly miss them"],
  },
  {
    id: "pain",
    title: "What annoys you most?",
    icon: Zap,
    layout: "rows",
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
    icon: Target,
    layout: "tiles",
    options: [
      "Two solid nights out",
      "One perfect night",
      "Something new every day",
      "Just never bored",
    ],
  },
];

type Interstitial = {
  title: string;
  body: string;
  visual: "funnel" | "match";
};

/**
 * Reassurance screens between question blocks, each with its own animated
 * visual instead of another pair of number cards.
 */
const INTERSTITIALS: Record<number, Interstitial> = {
  5: {
    title: "Good start.",
    body: "Your taste already cuts the week down to a shortlist.",
    visual: "funnel",
  },
  12: {
    title: "Almost there.",
    body: "The last few taps decide how close your picks land.",
    visual: "match",
  },
};

const FUNNEL: { value: string; label: string; width: string; icon: LucideIcon }[] = [
  { value: "50+", label: "sources read", width: "100%", icon: Radar },
  { value: "700+", label: "events a week", width: "62%", icon: Layers },
  { value: "10", label: "picks for you", width: "16%", icon: Star },
];

/** The curation work, step by step. Each line gets its own beat. */
const LOADER_LINES = [
  "Reading your answers",
  "Opening 50+ sources",
  "Reading Facebook events",
  "Checking ticket sites",
  "Scanning Telegram channels",
  "Sweeping Instagram",
  "Collecting 700+ events this week",
  "Dropping sold out and past dates",
  "Matching music and scenes",
  "Filtering your nights and hours",
  "Ranking by how close they land",
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
  const QuestionIcon = question.icon;

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

          <div className="mt-7">
            {pausePanel.visual === "funnel" ? <FunnelVisual /> : <MatchVisual />}
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
          <span className="icon-button size-10 bg-rausch/10 text-rausch">
            <QuestionIcon className="size-5" strokeWidth={2.2} />
          </span>
          <h1 className="mt-3 text-[26px] font-medium leading-[1.12] tracking-[-0.02em] text-foreground">
            {question.title}
          </h1>
          {question.note ? (
            <p className="mt-2 text-[14px] leading-[1.43] text-muted-foreground">{question.note}</p>
          ) : null}

          <Options question={question} picked={picked} onChoose={choose} />
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

function Options({
  question,
  picked,
  onChoose,
}: {
  question: Question;
  picked: string[];
  onChoose: (option: string) => void;
}) {
  const delay = (i: number) => ({ animationDelay: `${40 + i * 35}ms` });

  if (question.layout === "chips") {
    return (
      <div className="mt-6 flex flex-wrap gap-2">
        {question.options.map((option, i) => {
          const active = picked.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChoose(option)}
              style={delay(i)}
              className={`rise-in press inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-medium ${
                active
                  ? "border-rausch bg-rausch text-white"
                  : "border-hairline bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              {active ? <Check className="size-4 shrink-0" strokeWidth={2.6} /> : null}
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  // A week strip: days read as a calendar week, not as a list of words.
  if (question.layout === "days") {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-1.5">
          {question.options.map((option, i) => {
            const active = picked.includes(option);
            const weekend = i >= 5;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChoose(option)}
                style={delay(i)}
                aria-pressed={active}
                className={`rise-in press flex flex-col items-center gap-1.5 rounded-xl border py-2.5 ${
                  active
                    ? "border-rausch bg-rausch/5"
                    : "border-hairline bg-card hover:border-foreground/30"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${
                    active
                      ? "text-rausch"
                      : weekend
                        ? "text-foreground/70"
                        : "text-muted-foreground"
                  }`}
                >
                  {option}
                </span>
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${
                    active ? "bg-rausch text-white" : "bg-surface-2 text-transparent"
                  }`}
                >
                  <Check className="size-4" strokeWidth={2.8} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          {[
            { label: "Weekends", days: ["Fri", "Sat", "Sun"] },
            { label: "Every night", days: question.options },
          ].map((preset) => {
            const on = preset.days.every((d) => picked.includes(d));
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  preset.days.forEach((d) => {
                    if (on ? picked.includes(d) : !picked.includes(d)) onChoose(d);
                  });
                }}
                className={`press rounded-full border px-3.5 py-2 text-[13px] font-medium ${
                  on
                    ? "border-rausch bg-rausch/5 text-rausch"
                    : "border-hairline bg-card text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.layout === "tiles") {
    return (
      <div className="mt-6 grid grid-cols-2 gap-2">
        {question.options.map((option, i) => {
          const active = picked.includes(option);
          const Icon = OPTION_ICON[option] ?? question.icon;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChoose(option)}
              style={delay(i)}
              className={`rise-in press relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left ${
                active
                  ? "border-rausch bg-rausch/5"
                  : "border-hairline bg-card hover:border-foreground/30"
              }`}
            >
              <Icon
                className={`size-6 shrink-0 ${active ? "text-rausch" : "text-muted-foreground"}`}
                strokeWidth={1.9}
              />
              <span className="text-[15px] font-medium leading-[1.25] text-foreground">
                {option}
              </span>
              {active ? (
                <Check className="absolute right-3 top-3 size-4 text-rausch" strokeWidth={2.6} />
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.layout === "scale") {
    return (
      <div className="mt-6 space-y-2">
        {question.options.map((option, i) => {
          const active = picked.includes(option);
          const level = (i + 1) / question.options.length;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChoose(option)}
              style={delay(i)}
              className={`rise-in press flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left ${
                active
                  ? "border-rausch bg-rausch/5"
                  : "border-hairline bg-card hover:border-foreground/30"
              }`}
            >
              <span className="flex h-6 w-14 shrink-0 items-end gap-1" aria-hidden>
                {question.options.map((_, bar) => (
                  <span
                    key={bar}
                    className={`w-2 rounded-sm ${
                      bar <= i ? (active ? "bg-rausch" : "bg-foreground/25") : "bg-surface-2"
                    }`}
                    style={{ height: `${28 + bar * 22}%` }}
                  />
                ))}
              </span>
              <span className="min-w-0 flex-1 text-[16px] font-medium text-foreground">
                {option}
              </span>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
                {Math.round(level * 100)}%
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-2">
      {question.options.map((option, i) => {
        const active = picked.includes(option);
        const Icon = OPTION_ICON[option] ?? question.icon;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChoose(option)}
            style={delay(i)}
            className={`rise-in press flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left ${
              active
                ? "border-rausch bg-rausch/5"
                : "border-hairline bg-card hover:border-foreground/30"
            }`}
          >
            <span
              className={`icon-button size-10 shrink-0 ${
                active ? "bg-rausch text-white" : "bg-surface-2 text-muted-foreground"
              }`}
            >
              <Icon className="size-5" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1 text-[16px] font-medium text-foreground">{option}</span>
            {active ? <Check className="size-5 shrink-0 text-rausch" strokeWidth={2.5} /> : null}
          </button>
        );
      })}
    </div>
  );
}

/** Sources narrowing to ten picks, drawn as bars that grow in sequence. */
function FunnelVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-card p-5">
      <div className="space-y-4">
        {FUNNEL.map((row, i) => {
          const Icon = row.icon;
          const last = i === FUNNEL.length - 1;
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-[14px] text-muted-foreground">
                  <Icon
                    className={`size-4 shrink-0 ${last ? "text-rausch" : "text-muted-foreground"}`}
                    strokeWidth={2}
                  />
                  {row.label}
                </span>
                <span
                  className={`shrink-0 text-[18px] font-semibold tabular-nums ${
                    last ? "text-rausch" : "text-foreground"
                  }`}
                >
                  {row.value}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`bar-fill h-full rounded-full ${last ? "bg-rausch" : "bg-foreground/20"}`}
                  style={{ width: row.width, animationDelay: `${120 + i * 180}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Match ring: the number climbs once the screen appears. */
function MatchVisual() {
  const [shown, setShown] = useState(false);
  const target = 94;

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-hairline bg-card p-5">
      <div className="relative size-[120px] shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-surface-2" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-rausch transition-[stroke-dashoffset] duration-700 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - (shown ? target / 100 : 0))}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[24px] font-semibold tabular-nums text-foreground">
          {target}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-foreground">Average match so far</p>
        <ul className="mt-2 space-y-1.5">
          {["Your scenes", "Your nights", "Your budget"].map((line, i) => (
            <li
              key={line}
              className="pop-in flex items-center gap-2 text-[14px] text-muted-foreground"
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <Check className="size-4 shrink-0 text-rausch" strokeWidth={2.5} />
              {line}
            </li>
          ))}
        </ul>
      </div>
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
          {preview.map((event, i) => (
            <div
              key={event.id}
              className="rise-in rounded-xl border border-hairline bg-card p-3"
              style={{ animationDelay: `${60 + i * 70}ms` }}
            >
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
