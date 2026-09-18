import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CITY, SCAN, canonicalUrl } from "@/config/site";
import { picks } from "@/data/events";
import { renderFinishSetup } from "@/emails/finish-setup";
import { renderHotEvent } from "@/emails/hot-event";
import { renderWeeklyDigest } from "@/emails/weekly-digest";
import { renderWelcome } from "@/emails/welcome";

/**
 * /email — preview of every Sponsa email.
 *
 * Internal page: each email is built in src/emails/*.ts, so a backend job can
 * render the same HTML and text without touching this route.
 */
export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email previews | Sponsa" },
      {
        name: "description",
        content: "Previews of the Sponsa emails: welcome, unfinished setup, weekly picks and alerts.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/email") }],
  }),
  component: EmailPreview,
});

const TABS = [
  { id: "welcome", label: "Welcome", note: "Right after sign up" },
  { id: "finish", label: "Unfinished setup", note: "A few hours after the quiz was left" },
  { id: "weekly", label: "Weekly picks", note: "Monday morning, once a week" },
  { id: "hot", label: "Unmissable event", note: "The moment big tickets open" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function EmailPreview() {
  const [tab, setTab] = useState<TabId>("welcome");
  const [copied, setCopied] = useState(false);
  // Grows with the rendered email so the page has no empty tail.
  const [height, setHeight] = useState(900);
  // Resolved after mount so server and client render the same markup.
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const emails = useMemo(() => {
    const base = origin ? { baseUrl: origin } : {};
    const [top] = picks;
    return {
      welcome: renderWelcome({
        firstName: "Eduard",
        city: CITY,
        totalPicks: 10,
        sources: SCAN.sources,
        ...base,
      }),
      finish: renderFinishSetup({
        firstName: "Eduard",
        city: CITY,
        answered: 14,
        totalQuestions: 20,
        totalPicks: 10,
        ...(top ? { teaser: top } : {}),
        ...base,
      }),
      weekly: renderWeeklyDigest({
        firstName: "Eduard",
        city: CITY,
        weekLabel: "17 to 23 Sep",
        picks,
        totalPicks: 10,
        eventsScanned: SCAN.eventsScanned,
        sources: SCAN.sources,
        ...base,
      }),
      hot: top
        ? renderHotEvent({
            firstName: "Eduard",
            city: CITY,
            event: { ...top, match: 97 },
            reason:
              "One night only, the hall holds 400 seats and the last two festival concerts sold out in a day.",
            ticketUrl: "https://www.tiketa.lt",
            ticketSource: "tiketa.lt",
            ...base,
          })
        : null,
    } as Record<TabId, { subject: string; preheader: string; html: string; text: string } | null>;
  }, [origin]);

  const email = emails[tab];
  const active = TABS.find((item) => item.id === tab);

  const copy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen bg-cloud font-marketing text-ink">
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-[-0.02em]">Emails</h1>
            <p className="mt-1 text-sm text-slate">{active?.note}</p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-paper"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy HTML"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "bg-ink text-paper"
                  : "border border-line bg-paper text-slate hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {email ? (
          <>
            <div className="mt-6 rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold tracking-[0.06em] text-slate uppercase">
                Inbox line
              </p>
              <p className="mt-2 text-[15px] font-bold">{email.subject}</p>
              <p className="text-[14px] text-slate">{email.preheader}</p>
            </div>

            <div className="mt-6 flex justify-center pb-6">
              {origin ? (
                <iframe
                  key={tab}
                  title={`${active?.label} email preview`}
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
          </>
        ) : null}
      </div>
    </div>
  );
}
