import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Instagram, Sparkles, Star } from "lucide-react";

import { CITY, SCAN, SITE_NAME, TAGLINE, canonicalUrl } from "@/config/site";
import founderArtem from "@/assets/founder-artem.jpg";
import founderEduard from "@/assets/founder-eduard.jpg";
import heroCity from "@/assets/hero-event.jpg";

const TITLE = `${SITE_NAME}: ${TAGLINE.toLowerCase()}`;
const DESCRIPTION =
  "New in town or bored of the same three bars? Answer 20 quick taps and get the ten events in your city that are actually worth your week.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "20 taps. Ten events a week, chosen for your taste. Start free, upgrade when you love it.",
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

const CTA = "Find my week";

/* ---------------------------------------------------------------------------
 * Shared marketing primitives. The landing page uses its own fixed light
 * palette (ink / signal / cloud tokens in styles.css) so it never flips to the
 * app's night theme.
 * ------------------------------------------------------------------------- */

function Wordmark() {
  return (
    <span className="font-wordmark text-[18px] font-bold uppercase leading-none tracking-[0.1em] text-ink">
      Sponsa<span className="text-signal">.</span>net
    </span>
  );
}

function Cta({ variant = "signal" }: { variant?: "signal" | "ink" }) {
  return (
    <Link
      to="/quiz"
      className={`press inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[17px] font-semibold text-paper ${
        variant === "signal" ? "bg-signal" : "bg-ink"
      }`}
    >
      {CTA}
      <ArrowRight className="size-[18px] shrink-0" strokeWidth={2.5} />
    </Link>
  );
}

function Section({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={`px-5 py-14 sm:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate">{eyebrow}</p>
      <h2 className="mt-3 text-[30px] font-bold leading-[1.15] text-ink sm:text-[44px]">{title}</h2>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-cloud font-marketing">
      <Nav />
      <Hero />
      <Steps />
      <Preview />
      <Pricing />
      <Team />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-cloud/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 sm:h-16">
        <Wordmark />
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className="text-[15px] font-semibold text-ink transition-opacity active:opacity-70"
          >
            Sign in
          </Link>
          <Link
            to="/quiz"
            className="press hidden h-10 items-center rounded-lg bg-ink px-4 text-[15px] font-semibold text-paper sm:inline-flex"
          >
            {CTA}
          </Link>
        </div>
      </div>
    </div>
  );
}

const FUNNEL = [
  { k: SCAN.sourcesClaim, v: "sources scanned" },
  { k: SCAN.eventsPerWeekClaim, v: "events a week" },
  { k: SCAN.picksPerWeekClaim, v: "picks for you" },
];

/** Hero is sized to sit on one screen: min-h minus the 56/64px nav. */
function Hero() {
  return (
    <section className="flex min-h-[calc(100svh-56px)] items-center px-5 py-10 sm:min-h-[calc(100svh-64px)] sm:py-12">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 sm:grid-cols-2 sm:items-center sm:gap-12">
        <div>
          <span className="inline-flex rounded-full bg-pebble px-2.5 py-1 text-[12px] font-semibold text-cobalt">
            {CITY} · this week
          </span>
          <h1 className="mt-4 text-[38px] font-bold leading-[1.1] text-ink sm:text-[58px]">
            The best events in your city, picked for you
          </h1>
          <p className="mt-4 max-w-md text-[17px] leading-[1.5] text-slate">
            Everything worth going to, in one place. Ten picks a week that match your taste.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Cta />
            <p className="text-[14px] text-slate">
              60 seconds to set up. 7 days free, then €7.99 a month.
            </p>
          </div>

          <div className="mt-7 flex items-center gap-2 text-[15px] text-slate">
            <Star className="size-4 shrink-0 fill-signal text-signal" />
            <span className="font-semibold text-ink">4.8</span> from 12,800 people
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 size-40 rounded-full bg-magenta/25 blur-3xl" />
          <div className="absolute -bottom-8 -right-4 size-48 rounded-full bg-cyan/25 blur-3xl" />

          <div className="card-lift relative overflow-hidden rounded-2xl bg-paper">
            <div className="relative">
              <img
                src={heroCity}
                alt="Crowd with hands up at a live concert in a small city venue"
                width={900}
                height={1200}
                className="h-52 w-full object-cover sm:h-[360px]"
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-[13px] font-semibold text-ink">
                <Sparkles className="size-3.5 text-signal" />
                94% match
              </span>
            </div>

            <dl className="divide-y divide-line">
              {FUNNEL.map((s, i) => (
                <div key={s.v} className="flex items-center justify-between gap-3 px-5 py-3">
                  <dt className="text-[15px] text-slate">{s.v}</dt>
                  <dd
                    className={`text-[20px] font-bold leading-none ${
                      i === 2 ? "text-signal" : "text-ink"
                    }`}
                  >
                    {s.k}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "1", title: "Tell us your taste", note: "Sound, budget, nights you go out. 20 taps." },
  { n: "2", title: "We scan the city", note: "Venues, promoters, ticket sites, channels." },
  { n: "3", title: "Ten picks a week", note: "Only the best, each with a reason." },
];

function Steps() {
  return (
    <Section className="bg-paper">
      <SectionHead eyebrow="How it works" title="Three steps to a better week." />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <article key={s.n} className="rounded-3xl border border-line bg-cloud p-6">
            <span className="grid size-9 place-items-center rounded-full bg-signal text-[15px] font-bold text-paper">
              {s.n}
            </span>
            <h3 className="mt-4 text-[24px] font-bold leading-[1.2] text-ink">{s.title}</h3>
            <p className="mt-2 text-[16px] leading-[1.5] text-slate">{s.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Cta />
      </div>
    </Section>
  );
}


const SAMPLE = [
  {
    time: "Thu 19:00",
    title: "Nils Frahm, live piano",
    place: "Old Power Plant",
    match: "94%",
    why: "You saved two ambient gigs",
  },
  {
    time: "Fri 19:30",
    title: "Ceramics opening night",
    place: "Studio Kraft",
    match: "91%",
    why: "You go to openings",
  },
  {
    time: "Sat 23:30",
    title: "Smala Nights: Ø Room",
    place: "Smala",
    match: "88%",
    why: "Late techno near you",
  },
];

function Preview() {
  return (
    <Section>
      <SectionHead eyebrow="Your week" title="Ten picks, each with a reason." />

      <div className="relative mx-auto mt-10 max-w-lg">
        <div className="absolute -right-8 top-8 size-40 rounded-full bg-cyan/25 blur-3xl" />
        <div className="card-lift relative space-y-2 rounded-2xl bg-paper p-4">
          {SAMPLE.map((p) => (
            <div key={p.title} className="rounded-xl border border-line p-3">
              <p className="flex items-center justify-between gap-3">
                <span className="truncate text-[16px] font-semibold leading-[1.3] text-ink">
                  {p.title}
                </span>
                <span className="shrink-0 text-[14px] font-bold text-signal">{p.match}</span>
              </p>
              <p className="mt-0.5 truncate text-[14px] text-slate">
                {p.time} · {p.place}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-slate">
                <Sparkles className="size-3.5 shrink-0 text-signal" />
                <span className="min-w-0 truncate">{p.why}</span>
              </p>
            </div>
          ))}
          <p className="pt-1 text-center text-[14px] text-slate">+ 7 more picks</p>
        </div>
      </div>
    </Section>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "€0",
    unit: "",
    perks: ["3 picks a week", "One city", "Basic filters"],
    accent: false,
  },
  {
    name: "Pro",
    price: "€7.99",
    unit: "/ month",
    perks: [
      "All 10 picks every week",
      "New events the hour we find them",
      "Saved lists and calendar sync",
      "Every city we cover",
    ],
    accent: true,
  },
];

function Pricing() {
  return (
    <Section className="bg-paper">
      <SectionHead eyebrow="Pricing" title="Start free. Go Pro when you are out every week." />

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-3xl bg-cloud p-6 ${
              plan.accent ? "border-2 border-signal" : "border border-line"
            }`}
          >
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[24px] font-bold text-ink">{plan.name}</span>
              <span className="text-[14px] text-slate">
                <span className="text-[20px] font-bold text-ink">{plan.price}</span> {plan.unit}
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-[16px] text-slate">
                  <Check
                    className={`size-4 shrink-0 ${plan.accent ? "text-signal" : "text-ink"}`}
                    strokeWidth={2.5}
                  />
                  {perk}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-5 text-center text-[14px] text-slate">Cancel any time.</p>
    </Section>
  );
}

const STATS = [
  { k: "4 years", v: "in events" },
  { k: "600+", v: "events attended" },
  { k: "200+", v: "events organised" },
  { k: "50,000+", v: "guests hosted" },
];

const FOUNDERS = [
  { name: "Eduard Titov", img: founderEduard, handle: "edititov", role: "Product and algorithm" },
  {
    name: "Artem Derenchuk",
    img: founderArtem,
    handle: "artem.derenchuk",
    role: "Partners and venues",
  },
];

function Team() {
  return (
    <Section>
      <SectionHead eyebrow="Team" title="Built by two people who live in events." />

      <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.v} className="rounded-2xl border border-line bg-paper p-5 text-center">
            <dt className="text-[22px] font-bold text-ink">{s.k}</dt>
            <dd className="mt-1 text-[14px] text-slate">{s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mx-auto mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
        {FOUNDERS.map((f) => (
          <div
            key={f.name}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-line bg-paper p-5"
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
              <h3 className="truncate text-[17px] font-bold leading-[1.25] text-ink">{f.name}</h3>
              <p className="truncate text-[14px] text-slate">{f.role}</p>
              <a
                href={`https://instagram.com/${f.handle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-[14px] font-semibold text-signal"
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
      <div className="rounded-3xl bg-ink px-5 py-14 text-center sm:py-20">
        <h2 className="mx-auto max-w-xl text-[30px] font-bold leading-[1.15] text-paper sm:text-[44px]">
          Your weekend, already picked.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[17px] leading-[1.5] text-paper/70">
          One minute now. Ten picks waiting.
        </p>
        <div className="mt-8">
          <Cta />
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-cloud px-5 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <Wordmark />
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
          <Link
            to="/terms"
            className="text-[14px] font-semibold text-ink transition-opacity active:opacity-70"
          >
            Terms
          </Link>
          <p className="text-[14px] text-slate">
            © {new Date().getFullYear()} Sponsa.net, your shortcut to the city
          </p>
        </div>
      </div>
    </footer>
  );
}
