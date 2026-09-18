/**
 * Weekly digest email: "your week is ready".
 *
 * Built as a single table-based HTML string so it renders in Gmail, Outlook and
 * Apple Mail without a build step. Conversion rules baked in on purpose:
 *  - one goal, one single call to action, placed right after the picks
 *  - subject and preheader read as one sentence, both short enough for mobile
 *  - value before the ask: three real picks with match %, time, price
 *  - the rest of the week stays behind the CTA (curiosity gap, honest count)
 *  - 600px single column, 44px+ tap targets, alt text, inline styles only
 *  - plain-text alternative for deliverability and for clients blocking HTML
 *
 * INTEGRATION: pass the signed-in person's first name, city, picks and the
 * total pick count from the backend; render with renderWeeklyDigest() and send
 * with whichever provider is wired up. Image and link URLs resolve against
 * baseUrl, which defaults to the production site URL, so previews on another
 * origin must pass their own origin.
 */

import { SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem, priceLabel } from "@/data/events";
import {
  CORAL,
  ctaBlock,
  esc,
  eventUrl,
  footerReason,
  headlineBlock,
  layout,
  makeAbsolute,
  picksBlock,
} from "@/emails/shared";

export type WeeklyDigestInput = {
  /** First name, or "" for the neutral greeting. */
  firstName?: string;
  city: string;
  /** Week label shown in the header, e.g. "17 to 23 Sep". */
  weekLabel: string;
  /** The three events shown in the email. */
  picks: EventItem[];
  /** How many picks are waiting in the app in total. */
  totalPicks: number;
  /** Events scanned for this week. */
  eventsScanned: number;
  sources: number;
  /** Origin that root-relative images and links resolve against. */
  baseUrl?: string;
  /** Absolute or root-relative URLs. */
  appUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
};

/** Subject: short, specific, one number, no hype. */
export const subjectFor = (input: WeeklyDigestInput) =>
  `Your ${input.city} week is ready: ${input.totalPicks} picks`;

/** Preheader continues the subject instead of repeating it. */
export const preheaderFor = (input: WeeklyDigestInput) =>
  `${input.picks[0]?.title ?? "Your top pick"} and ${Math.max(input.totalPicks - 1, 0)} more, matched to your taste.`;

export const renderWeeklyDigestHtml = (input: WeeklyDigestInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const greeting = input.firstName ? `${esc(input.firstName)}, your` : "Your";

  return layout({
    subject: subjectFor(input),
    preheader: preheaderFor(input),
    headerNote: input.weekLabel,
    content: `
  ${headlineBlock(
    `${greeting} <span style="color:${CORAL};">${esc(input.city)}</span> week is ready.`,
    `${input.sources} sources, ${input.eventsScanned} events, ${input.totalPicks} that match your taste.`,
  )}
  ${picksBlock(input.picks, appUrl)}
  ${ctaBlock(appUrl, `See all ${input.totalPicks} picks`, absolute("/email-crown.png"))}`,
    reason: footerReason("Once a week, because you set up picks"),
    preferencesUrl: absolute(input.preferencesUrl ?? "/app"),
    unsubscribeUrl: absolute(input.unsubscribeUrl ?? "/app"),
  });
};

/** Plain-text alternative. Same order, same single ask. */
export const renderWeeklyDigestText = (input: WeeklyDigestInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const rest = Math.max(input.totalPicks - input.picks.length, 0);
  return [
    `${input.firstName ? `${input.firstName}, your` : "Your"} ${input.city} week is ready.`,
    "",
    `We read ${input.sources} sources and ${input.eventsScanned} events. ${input.totalPicks} of them match your taste.`,
    "",
    ...input.picks.map(
      (e) =>
        `${e.match ?? ""}% ${e.title}\n${e.day + " · " + e.time} · ${e.venue} · ${priceLabel(e)}\n${eventUrl(appUrl, e.id)}`,
    ),
    "",
    `${rest} more picks: ${appUrl}`,
    "",
    `${TAGLINE}. Unsubscribe: ${absolute(input.unsubscribeUrl ?? "/app")}`,
  ].join("\n");
};

export const renderWeeklyDigest = (input: WeeklyDigestInput) => ({
  subject: subjectFor(input),
  preheader: preheaderFor(input),
  html: renderWeeklyDigestHtml(input),
  text: renderWeeklyDigestText(input),
});
