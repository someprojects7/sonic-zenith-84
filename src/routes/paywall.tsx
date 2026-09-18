import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

import { CITY, canonicalUrl } from "@/config/site";

/**
 * Paywall: the offer screen shown after the quiz result preview.
 *
 * PLACEHOLDER: no billing is wired up yet. "Start free trial" simply opens the
 * app. When Stripe/Paddle lands, replace the CTA handler with a checkout call
 * and keep every term on this screen (price, cadence, auto-renew, trial length,
 * cancellation) visible, as the store policies require.
 */
export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Unlock your week | Sponsa" },
      {
        name: "description",
        content:
          "Sponsa Pro: ten matched picks every week in your city. Seven days free, then €7.99 a month.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Unlock your week with Sponsa Pro" },
      {
        property: "og:description",
        content: "Ten matched picks a week. Seven days free, then €7.99 a month.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/paywall") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/paywall") }],
  }),
  component: Paywall,
});

const BENEFITS = [
  "All ten picks every week, matched to your answers",
  "New events the hour we find them",
  "Saved lists and calendar sync",
  "Every city we cover",
];

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    charge: "€7.99",
    cadence: "billed every month",
    note: "",
  },
  {
    id: "annual",
    name: "Yearly",
    charge: "€59.88",
    cadence: "billed once a year",
    note: "Saves €35.99",
  },
] as const;

function Paywall() {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const chosen = PLANS.find((p) => p.id === plan)!;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center px-5">
          <Link to="/quiz" className="icon-button press size-9 text-foreground" aria-label="Back">
            <ArrowLeft className="size-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-5 pb-10">
        <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
          Unlock your ten picks
        </h1>
        <p className="mt-3 text-[16px] leading-[1.5] text-muted-foreground">
          Free for seven days. Your week in {CITY} stays sorted after that for the price of one
          coffee.
        </p>

        <ul className="mt-6 space-y-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px] leading-[1.4] text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-rausch" strokeWidth={2.5} />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-7 space-y-2">
          {PLANS.map((p) => {
            const active = plan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                aria-pressed={active}
                className={`press flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left ${
                  active ? "border-rausch bg-rausch/5" : "border-hairline bg-card"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-medium text-foreground">{p.name}</span>
                  <span className="block text-[13px] text-muted-foreground">{p.cadence}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[16px] font-semibold text-foreground">{p.charge}</span>
                  {p.note ? (
                    <span className="block text-[13px] font-medium text-rausch">{p.note}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          to="/app"
          className="cta-halo press mt-6 flex h-12 w-full items-center justify-center rounded-full bg-rausch text-[15px] font-semibold text-white"
        >
          Start seven days free
        </Link>

        <p className="mt-3 text-center text-[13px] leading-[1.45] text-muted-foreground">
          Seven days free, then {chosen.charge} {chosen.cadence}. Renews automatically. Cancel any
          time in the app.{" "}
          <Link to="/terms" className="font-semibold text-foreground">
            Terms
          </Link>
        </p>

        <Link
          to="/app"
          className="press mt-5 flex h-11 w-full items-center justify-center text-[15px] font-semibold text-muted-foreground"
        >
          Not now
        </Link>
      </main>
    </div>
  );
}
