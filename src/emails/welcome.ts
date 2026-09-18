/**
 * Welcome email, sent once right after sign up.
 *
 * Job: confirm the account works, show that the work is already done (numbers +
 * the person's top pick) and pull them into the app while intent is high. One
 * CTA, no marketing extras.
 *
 * INTEGRATION: send immediately after the account is created, with the person's
 * first name, city, the picks already waiting and their strongest match.
 */

import { SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem, formatWhen, priceLabel } from "@/data/events";
import {
  CORAL,
  ctaBlock,
  esc,
  eventRow,
  eyebrow,
  factsBlock,
  footerReason,
  HEAD_FONT,
  INK,
  layout,
  makeAbsolute,
  sectionLabel,
  SLATE,
  statsStrip,
} from "@/emails/shared";

export type WelcomeInput = {
  firstName?: string;
  city: string;
  /** Picks already waiting in the app. */
  totalPicks: number;
  sources: number;
  /** Events read in the latest scan. */
  eventsScanned: number;
  /** Strongest match, shown as a taste of the feed. */
  topPick?: EventItem;
  baseUrl?: string;
  appUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
};

export const welcomeSubject = (input: WelcomeInput) =>
  `You're in. ${input.totalPicks} ${input.city} picks are waiting`;

export const welcomePreheader = (input: WelcomeInput) =>
  input.topPick
    ? `Starting with ${input.topPick.title}, a ${input.topPick.match ?? 0}% match.`
    : `We read ${input.sources} sources so you can read one list.`;

const facts = (input: WelcomeInput) => [
  "Like or skip an event and next week lands closer to your taste.",
  `Every Monday morning a fresh ${input.city} week. Nothing in between.`,
];

export const renderWelcomeHtml = (input: WelcomeInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const name = input.firstName ? `${esc(input.firstName)}, your` : "Your";

  return layout({
    subject: welcomeSubject(input),
    preheader: welcomePreheader(input),
    headerNote: esc(input.city),
    content: `
  ${eyebrow("Welcome to Sponsa")}
  <tr><td align="center" style="padding:10px 24px 20px 24px;font-family:${HEAD_FONT};text-align:center;">
    <h1 style="margin:0;font-size:25px;line-height:31px;font-weight:700;color:${INK};letter-spacing:-0.02em;">${name} <span style="color:${CORAL};">${esc(input.city)}</span> week is already picked.</h1>
    <p style="margin:8px 0 0 0;font-family:Figtree,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:${SLATE};">No scrolling through pages of listings. Just the nights worth your evening.</p>
  </td></tr>
  ${statsStrip([
    { value: String(input.sources), label: "sources read" },
    { value: String(input.eventsScanned), label: "events checked" },
    { value: String(input.totalPicks), label: "picks for you" },
  ])}
  ${
    input.topPick
      ? `${sectionLabel("Start with your top match")}
  <tr><td style="padding:0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${eventRow(input.topPick, appUrl)}</table>
  </td></tr>`
      : ""
  }
  ${factsBlock(facts(input))}
  ${ctaBlock(appUrl, `Open my ${input.totalPicks} picks`, absolute("/email-crown.png"))}`,
    reason: footerReason("You are getting this because you just created an account"),
    preferencesUrl: absolute(input.preferencesUrl ?? "/app"),
    unsubscribeUrl: absolute(input.unsubscribeUrl ?? "/app"),
  });
};

export const renderWelcomeText = (input: WelcomeInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  return [
    `${input.firstName ? `${input.firstName}, your` : "Your"} ${input.city} week is already picked.`,
    "",
    `${input.sources} sources read, ${input.eventsScanned} events checked, ${input.totalPicks} picks for you.`,
    ...(input.topPick
      ? [
          "",
          `Top match: ${input.topPick.title} (${input.topPick.match ?? 0}%)`,
          `${formatWhen(input.topPick)} · ${input.topPick.venue} · ${priceLabel(input.topPick)}`,
        ]
      : []),
    "",
    ...facts(input).map((fact, index) => `${index + 1}. ${fact}`),
    "",
    `Open my picks: ${appUrl}`,
    "",
    `${TAGLINE}. Unsubscribe: ${absolute(input.unsubscribeUrl ?? "/app")}`,
  ].join("\n");
};

export const renderWelcome = (input: WelcomeInput) => ({
  subject: welcomeSubject(input),
  preheader: welcomePreheader(input),
  html: renderWelcomeHtml(input),
  text: renderWelcomeText(input),
});
