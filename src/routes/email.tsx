import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

function EmailPreview() {
  const [copied, setCopied] = useState(false);
  // Grows with the rendered email so the page has no empty tail.
  const [height, setHeight] = useState(900);
  // Resolved after mount so server and client render the same markup.
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

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
        ...(origin ? { baseUrl: origin } : {}),
      }),
    [origin],
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

        <div className="mt-6 flex justify-center pb-6">
          {origin ? (
            <iframe
              title="Weekly email preview"
              srcDoc={email.html}
              onLoad={(event) => {
                const body = event.currentTarget.contentDocument?.body;
                if (body) setHeight(body.scrollHeight);
              }}
              className="w-full max-w-[680px] rounded-2xl border border-line bg-paper"
              style={{ height }}
            />
          ) : (
            <div
              className="w-full max-w-[680px] rounded-2xl border border-line bg-paper"
              style={{ height }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
