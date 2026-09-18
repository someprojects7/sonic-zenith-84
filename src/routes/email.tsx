import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Monitor, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";

import { CITY, SCAN, canonicalUrl } from "@/config/site";
import { picks } from "@/data/events";
import { renderWeeklyDigest } from "@/emails/weekly-digest";

/**
 * /email — preview of the weekly digest email.
 *
 * Internal page: the email itself is built in src/emails/weekly-digest.ts, so a
 * backend job can render the same HTML and text without touching this route.
 */
export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Weekly email preview | Sponsa" },
      {
        name: "description",
        content: "Preview of the Sponsa weekly digest email: three picks and one call to action.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/email") }],
  }),
  component: EmailPreview,
});

const WHY = [
  "One goal and one call to action, so nothing competes with it.",
  "Subject and preheader read as one line: what it is, and one number.",
  "Value first: three real picks with match, time and price before the ask.",
  "The other picks stay in the app, so the click has a reason.",
  "600px single column, inline styles, alt text, plain-text twin, one-tap unsubscribe.",
];

function EmailPreview() {
  const [mobile, setMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = useMemo(
    () =>
      renderWeeklyDigest({
        firstName: "Eduard",
        city: CITY,
        weekLabel: "17 to 23 Sep",
        picks,
        totalPicks: 10,
        eventsScanned: SCAN.eventsScanned,
        sources: SCAN.sources,
        // Preview renders on this origin, so bundled images resolve here.
        ...(typeof window === "undefined" ? {} : { baseUrl: window.location.origin }),
      }),
    [],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(email.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen bg-cloud font-marketing text-ink">
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-[-0.02em]">
              Weekly email
            </h1>
            <p className="mt-1 text-sm text-slate">Sent Monday morning, once a week.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobile((value) => !value)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm font-semibold"
            >
              {mobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
              {mobile ? "Mobile" : "Desktop"}
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-paper"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy HTML"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold tracking-[0.06em] text-slate uppercase">Inbox line</p>
          <p className="mt-2 text-[15px] font-bold">{email.subject}</p>
          <p className="text-[14px] text-slate">{email.preheader}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <iframe
            title="Weekly email preview"
            srcDoc={email.html}
            className="h-[1200px] rounded-2xl border border-line bg-paper"
            style={{ width: mobile ? 390 : 680 }}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
          <p className="font-heading text-lg font-bold">Why it is built this way</p>
          <ul className="mt-3 space-y-2">
            {WHY.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] text-slate">
                <Check className="mt-1 size-4 shrink-0 text-signal" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate">
            Plain-text version is generated alongside the HTML.{" "}
            <Link to="/app" className="font-semibold text-ink">
              Open the app
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
