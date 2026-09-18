import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  LogIn,
  MousePointerClick,
  Radar,
  Sparkles,
  Star,
} from "lucide-react";

import { CITY, SCAN, SITE_NAME, TAGLINE, canonicalUrl } from "@/config/site";
import eventLive from "@/assets/event-live.jpg";
import eventArt from "@/assets/event-art.jpg";
import eventClub from "@/assets/event-club.jpg";
import cityMap from "@/assets/city-map-stats.jpg";
import eventsPattern from "@/assets/events-pattern-stats.jpg";

const TITLE = `${SITE_NAME}: ${TAGLINE.toLowerCase()}`;
const DESCRIPTION =
  "The best events in your city, collected in one place and picked for your taste. Ten matched picks every week.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content: "Ten events a week, picked for your taste. One week free, then €7.99 a month.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/") }],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: canonicalUrl("/"),
          description: DESCRIPTION,
          potentialAction: {
            "@type": "SearchAction",
            target: `${canonicalUrl("/app")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Landing,
});

const CTA = "Build my week";

/* ---------------------------------------------------------------------------
 * Marketing primitives. The landing page uses its own fixed light palette
 * (ink / slate / cloud / paper / signal tokens in styles.css) so it never flips
 * to the app's night theme.
 * ------------------------------------------------------------------------- */

function Wordmark() {
  return (
    <span className="font-heading text-[18px] font-bold uppercase leading-none tracking-[0.08em] text-ink">
      Sponsa<span className="text-signal">.</span>net
    </span>
  );
}

function Cta({ full = false }: { full?: boolean }) {
  return (
    <Link
      to="/quiz"
      className={`press inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[16px] font-semibold text-paper ${
        full ? "w-full" : ""
      }`}
    >
      {CTA}
      <ArrowRight className="size-[18px] shrink-0" strokeWidth={2.5} />
    </Link>
  );
}

function TileTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[20px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">
      {children}
    </h2>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-cloud font-marketing text-ink">
      <Nav />
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <HeroTile />
          <PicksTile />
          <StepsTile />
          <div className="flex flex-col gap-4 md:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <StatTile value={SCAN.sourcesClaim} label="sources scanned" bg={cityMap} />
              <StatTile value={SCAN.eventsPerWeekClaim} label="events a week" bg={eventsPattern} />
            </div>
            <TrustTile />
          </div>
          <PricingTile />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <div className="sticky top-0 z-10 bg-cloud/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            to="/app"
            aria-label="Sign in"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-slate transition-colors hover:text-ink"
          >
            <LogIn className="size-[18px] shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
          <Link
            to="/quiz"
            className="press hidden h-10 items-center rounded-xl bg-signal px-5 text-[15px] font-semibold text-paper sm:inline-flex"
          >
            {CTA}
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroTile() {
  return (
    <section className="tile flex flex-col justify-center p-7 sm:p-11 md:col-span-8 md:min-h-[400px]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate">
        {CITY} · this week
      </p>
      <h1 className="mt-4 font-heading text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[60px]">
        The best events in <span className="text-signal">{CITY}</span>, picked for you.
      </h1>
      <p className="mt-5 max-w-md text-[17px] leading-[1.55] text-slate sm:text-[19px]">
        Stop scrolling five feeds. We read the whole city and keep the ten nights that match your
        taste.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Cta />
        <p className="text-[14px] text-slate">60 seconds. 7 days free, then €7.99 a month.</p>
      </div>

      <p className="mt-6 flex items-center gap-2 text-[15px] text-slate">
        <Star className="size-4 shrink-0 fill-signal text-signal" />
        <span className="font-semibold text-ink">4.8</span> from 12,800 people
      </p>
    </section>
  );
}

const STEPS = [
  { n: "1", icon: MousePointerClick, title: "20 quick taps", note: "Sound, budget, nights out." },
  { n: "2", icon: Radar, title: "We scan the city", note: "Venues, promoters, tickets, channels." },
  { n: "3", icon: CalendarCheck, title: "Ten picks a week", note: "Every Monday, with a reason." },
];

/**
 * Sits in the wide 6-column slot, so the three steps run left to right on a
 * hairline rail (they stack on phones).
 */
function StepsTile() {
  return (
    <section className="tile p-7 md:col-span-6">
      <div className="flex items-baseline justify-between gap-3">
        <TileTitle>How it works</TileTitle>
        <span className="text-[13px] font-semibold text-slate">60 seconds</span>
      </div>

      <ol className="relative mt-7 grid gap-7 sm:grid-cols-3 sm:gap-5">
        {/* Rail connecting the three steps, desktop only. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 right-[calc(33.333%+1.5rem)] top-6 hidden h-px bg-line sm:block"
        />
        {STEPS.map(({ n, icon: Icon, title, note }) => (
          <li key={n} className="relative flex gap-4 sm:block">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-paper text-signal">
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <div className="sm:mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate">
                Step {n}
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-[1.3] text-ink">{title}</p>
              <p className="mt-1 text-[14px] leading-[1.5] text-slate">{note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StatTile({ value, label, bg }: { value: string; label: string; bg: string }) {
  return (
    <div className="tile relative isolate flex flex-col items-center justify-center gap-1 overflow-hidden px-5 py-7 text-center">
      <img
        src={bg}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-90"
      />
      <p className="font-heading text-[40px] font-bold leading-none text-signal">{value}</p>
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate">{label}</p>
    </div>
  );
}

const SAMPLE = [
  {
    img: eventLive,
    match: "94%",
    title: "Nils Frahm, live piano",
    meta: "Thu 19:00 · Old Power Plant",
  },
  {
    img: eventArt,
    match: "91%",
    title: "Ceramics opening night",
    meta: "Fri 19:30 · Studio Kraft",
  },
  { img: eventClub, match: "88%", title: "Smala Nights: Ø Room", meta: "Sat 23:30 · Smala" },
];

/** Sits in the narrow 4-column slot beside the hero, so rows stay compact. */
function PicksTile() {
  return (
    <section className="tile flex flex-col p-7 md:col-span-4">
      <div className="flex items-baseline justify-between gap-3">
        <TileTitle>Your picks look like this</TileTitle>
        <span className="shrink-0 text-[13px] font-semibold text-slate">
          {SCAN.picksPerWeekClaim} a week
        </span>
      </div>

      <ul className="mt-6 space-y-4">
        {SAMPLE.map((p) => (
          <li key={p.title} className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={p.img}
                alt=""
                aria-hidden
                width={60}
                height={60}
                loading="lazy"
                decoding="async"
                className="size-[60px] rounded-xl object-cover"
              />
              <span className="absolute -right-2 -top-2 rounded-full bg-signal px-1.5 py-0.5 text-[10px] font-bold text-paper">
                {p.match}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold leading-[1.3] text-ink">{p.title}</p>
              <p className="mt-0.5 truncate text-[13px] text-slate">{p.meta}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-center gap-1.5 text-[13px] text-slate">
        <Sparkles className="size-3.5 shrink-0 text-signal" />
        Matched to your taste
      </p>
    </section>
  );
}

const STATS = [
  { k: "4 years", v: "in events" },
  { k: "600+", v: "events attended" },
  { k: "200+", v: "events organised" },
  { k: "50,000+", v: "guests hosted" },
];

function TrustTile() {
  return (
    <section className="tile flex-1 p-7">
      <TileTitle>Picked by people who run city nights</TileTitle>
      <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.v}>
            <dt className="font-heading text-[22px] font-bold leading-none text-ink">{s.k}</dt>
            <dd className="mt-1.5 text-[13px] leading-[1.35] text-slate">{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const PERKS = [
  "Ten matched picks every week",
  "New events the hour we find them",
  "Saved lists and calendar sync",
];

function PricingTile() {
  return (
    <section className="flex flex-col justify-between gap-7 rounded-2xl bg-ink p-7 text-paper md:col-span-12 md:flex-row md:items-center">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-paper/60">
          One plan
        </p>
        <p className="mt-3 font-heading text-[34px] font-bold leading-none">
          €7.99
          <span className="text-[16px] font-normal text-paper/60"> / month</span>
        </p>
        <p className="mt-3 inline-flex rounded-full bg-paper/10 px-3 py-1 text-[13px] font-semibold">
          7 days free
        </p>
      </div>

      <ul className="space-y-2">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-[15px] text-paper/80">
            <Check className="size-4 shrink-0 text-signal" strokeWidth={2.5} />
            {perk}
          </li>
        ))}
      </ul>

      <div className="w-full md:w-auto md:min-w-[240px]">
        <Cta full />
        <p className="mt-3 text-center text-[13px] text-paper/60">Cancel any time in the app.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 pb-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-7 text-center sm:flex-row sm:text-left">
        <p className="font-heading text-[18px] font-semibold text-ink">{TAGLINE}</p>
        <p className="flex items-center gap-2 text-[14px] text-slate">
          <span>© {new Date().getFullYear()} Sponsa.net</span>
          <span aria-hidden="true">·</span>
          <Link to="/terms" className="transition-colors hover:text-ink">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
