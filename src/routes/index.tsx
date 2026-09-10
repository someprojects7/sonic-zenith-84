import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Crown,
  Filter,
  Instagram,
  Radar,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import founderArtem from "@/assets/founder-artem.jpg";
import founderEduard from "@/assets/founder-eduard.jpg";
import sceneConcert from "@/assets/scene-concert.jpg";
import sceneGallery from "@/assets/scene-gallery.jpg";
import sceneMarket from "@/assets/scene-market.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sponsa: your shortcut to the city" },
      {
        name: "description",
        content:
          "New in town or bored of the same three bars? Answer 20 quick taps and get the ten events in your city that are actually worth your week.",
      },
      { property: "og:title", content: "Sponsa: your shortcut to the city" },
      {
        property: "og:description",
        content: "20 taps. Ten events a week, chosen for your taste. Start free, upgrade when you love it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const CTA = "Find my week";

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-wordmark text-[19px] font-bold uppercase leading-none tracking-[0.1em] ${
        light ? "text-white" : "text-foreground"
      }`}
    >
      Sponsa<span className="text-rausch">.</span>net
    </span>
  );
}

function Cta({ variant = "coral" }: { variant?: "coral" | "ink" }) {
  return (
    <Link
      to="/quiz"
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-opacity active:opacity-80 ${
        variant === "coral" ? "bg-rausch text-white" : "bg-foreground text-background"
      }`}
    >
      {CTA}
      <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} />
    </Link>
  );
}


function Section({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`px-5 py-14 sm:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 max-w-2xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
      {children}
    </h2>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Problem />
      <Steps />
      <Preview />
      <Scenes />
      <Pricing />
      <Team />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] flex-col justify-between overflow-hidden">
      <img
        src={sceneConcert}
        alt="Crowd at a live show in Vilnius"
        width={900}
        height={1200}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/85" />

      <div className="flex h-16 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <Wordmark light />
        <Link
          to="/app"
          className="text-[14px] font-semibold text-white/85 transition-colors hover:text-white"
        >
          Sign in
        </Link>
      </div>

      <div className="px-5 pb-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70">
          Vilnius, this week
        </p>
        <h1 className="mt-3 max-w-2xl text-[40px] font-medium leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl">
          Your shortcut to the city
        </h1>
        <p className="mt-4 max-w-md text-[17px] leading-[1.5] text-white/85">
          Stop scrolling five apps to find one decent night. Answer 20 taps, get the ten events
          in your city that fit you.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-4 shrink-0 fill-rausch text-rausch" />
            <span className="font-semibold text-white">4.8</span> from 12,800 people
          </span>
          <span>50+ sources</span>
        </div>

        <div className="mt-7">
          <Cta />
          <p className="mt-3 text-[13px] text-white/70">
            60 seconds. First picks free, Pro from €7.99 a month.
          </p>
        </div>
      </div>
    </section>
  );
}

const PROBLEMS = [
  {
    icon: Clock,
    title: "You hear about it on Monday",
    note: "The gig was Saturday. Again.",
  },
  {
    icon: Filter,
    title: "Five apps, none of them yours",
    note: "Instagram stories, ticket sites, a friend of a friend.",
  },
  {
    icon: MapPin,
    title: "The same three bars",
    note: "A city of a thousand nights and you keep repeating one.",
  },
];

function Problem() {
  return (
    <Section>
      <Eyebrow>Sound familiar</Eyebrow>
      <Heading>Finding a good night should take a minute, not an evening.</Heading>

      <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-4">
        {PROBLEMS.map((p) => (
          <article key={p.title} className="rounded-xl bg-card p-4">
            <span className="icon-button size-9 bg-surface-2 text-rausch">
              <p.icon className="size-4" strokeWidth={2.2} />
            </span>
            <h3 className="mt-3 text-[16px] font-medium leading-[1.25] text-foreground">
              {p.title}
            </h3>
            <p className="mt-1 text-[14px] leading-[1.43] text-muted-foreground">{p.note}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

const STEPS = [
  { icon: Sparkles, value: "20 taps", label: "you tell us your taste", note: "Sound, budget, nights, distance." },
  { icon: Radar, value: "1,000+", label: "events we read daily", note: "Venues, promoters, ticketing." },
  { icon: Crown, value: "10", label: "become your week", note: "Each one with a reason." },
];

function Steps() {
  return (
    <Section className="bg-card">
      <Eyebrow>How it works</Eyebrow>
      <Heading>One minute now, planned weeks after.</Heading>

      <div className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-4">
        {STEPS.map((s) => (
          <article key={s.label} className="rounded-xl bg-background p-4">
            <span className="icon-button size-9 bg-surface-2 text-rausch">
              <s.icon className="size-4" strokeWidth={2.2} />
            </span>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-[22px] font-medium tracking-[-0.02em] text-foreground">
                {s.value}
              </span>
              <span className="text-[14px] text-foreground">{s.label}</span>
            </p>
            <p className="mt-1 text-[14px] leading-[1.43] text-muted-foreground">{s.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Cta variant="ink" />
      </div>
    </Section>
  );
}


const SAMPLE = [
  { time: "Thu 19:00", title: "Nils Frahm, live piano", place: "Old Power Plant", match: "94%", why: "You saved two ambient gigs" },
  { time: "Fri 19:30", title: "Ceramics opening night", place: "Studio Kraft", match: "91%", why: "You go to openings" },
  { time: "Sat 23:30", title: "Smala Nights: Ø Room", place: "Smala", match: "88%", why: "Late techno near you" },
];

function Preview() {
  return (
    <Section>
      <Eyebrow>Your week</Eyebrow>
      <Heading>Ten picks, each with a reason.</Heading>

      <div className="mt-6 space-y-2 sm:max-w-lg">
        {SAMPLE.map((p) => (
          <div key={p.title} className="rounded-xl bg-card p-3">

            <p className="flex items-center justify-between gap-3">
              <span className="truncate text-[16px] font-medium leading-[1.25] text-foreground">
                {p.title}
              </span>
              <span className="shrink-0 text-[13px] font-semibold text-rausch">{p.match}</span>
            </p>
            <p className="mt-0.5 truncate text-[14px] leading-[1.43] text-muted-foreground">
              {p.time} · {p.place}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Sparkles className="size-3.5 shrink-0 text-rausch" />
              <span className="min-w-0 truncate">{p.why}</span>
            </p>
          </div>
        ))}
        <p className="pt-1 text-[13px] text-muted-foreground">+ 7 more picks</p>
      </div>
    </Section>
  );
}

const SCENES = [
  { img: sceneConcert, title: "Music", note: "Small rooms to arenas" },
  { img: sceneGallery, title: "Art", note: "Openings, talks, performance" },
  { img: sceneMarket, title: "City", note: "Markets, dinners, open air" },
];

const CITIES = ["Vilnius", "Warsaw", "Berlin", "Lisbon", "Barcelona", "Amsterdam", "Prague", "London"];

function Scenes() {
  return (
    <Section>
      <Eyebrow>Coverage</Eyebrow>
      <Heading>Every scene in your city.</Heading>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {SCENES.map((s) => (
          <article key={s.title} className="relative overflow-hidden rounded-xl">
            <img
              src={s.img}
              alt={s.title}
              loading="lazy"
              width={900}
              height={1200}
              className="h-40 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-[18px] font-medium tracking-[-0.02em] text-white">{s.title}</h3>
              <p className="mt-0.5 text-[13px] text-white/80">{s.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {CITIES.map((c) => (
          <span key={c}>{c}</span>
        ))}
        <span className="text-rausch">+ more soon</span>
      </div>
    </Section>
  );
}

const STATS = [
  { icon: CalendarCheck, k: "4 years", v: "in events" },
  { icon: Star, k: "600+", v: "events attended" },
  { icon: Sparkles, k: "200+", v: "events organised" },
  { icon: Users, k: "50,000+", v: "guests hosted" },
];

const FOUNDERS = [
  { name: "Eduard Titov", img: founderEduard, handle: "edititov", role: "Product and algorithm" },
  { name: "Artem Derenchuk", img: founderArtem, handle: "artem.derenchuk", role: "Partners and venues" },
];

function Team() {
  return (
    <Section className="bg-card">
      <Eyebrow>Team</Eyebrow>
      <Heading>Built by two people who live in events.</Heading>
      <p className="mt-4 max-w-xl text-[16px] leading-[1.5] text-muted-foreground">
        Four years running nights in this city. That is how we know which evening is worth yours.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {STATS.map((s) => (
          <div key={s.v} className="rounded-xl bg-background p-4">
            <span className="icon-button size-9 bg-surface-2 text-rausch">
              <s.icon className="size-4" strokeWidth={2.2} />
            </span>
            <dt className="mt-3 text-[20px] font-medium tracking-[-0.02em] text-foreground">{s.k}</dt>
            <dd className="mt-0.5 text-[14px] text-muted-foreground">{s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-4">
        {FOUNDERS.map((f) => (
          <div
            key={f.name}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-xl bg-background p-4"
          >
            <img
              src={f.img}
              alt={f.name}
              loading="lazy"
              width={768}
              height={768}
              className="size-16 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-medium leading-[1.25] text-foreground">
                {f.name}
              </h3>
              <p className="truncate text-[14px] text-muted-foreground">{f.role}</p>
              <a
                href={`https://instagram.com/${f.handle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-[14px] font-semibold text-foreground"
              >
                <Instagram className="size-4 shrink-0" />
                <span className="truncate">@{f.handle}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section>
      <div className="rounded-xl bg-foreground px-5 py-12 text-center sm:py-16">
        <h2 className="mx-auto max-w-xl text-[28px] font-medium leading-[1.12] tracking-[-0.02em] text-background sm:text-[40px]">
          Next week you already have a plan.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[16px] leading-[1.5] text-background/70">
          One minute to set your taste. Ten events a week, picked for you.
        </p>
        <div className="mt-7">
          <Cta />
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <Wordmark />
        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Sponsa.net, your event curator in Vilnius
        </p>
      </div>
    </footer>
  );
}
