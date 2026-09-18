/**
 * Welcome email, sent once right after sign up.
 *
 * Job: confirm the account works, set the expectation (picks every Monday) and
 * pull the person into the app once while intent is still high. One CTA, three
 * short facts, no marketing extras.
 *
 * INTEGRATION: send immediately after the account is created, with the person's
 * first name, city and the number of picks already waiting for them.
 */

import { SITE_URL, TAGLINE } from "@/config/site";
import {
  CORAL,
  ctaBlock,
  esc,
  factsBlock,
  footerReason,
  headlineBlock,
  layout,
  makeAbsolute,
} from "@/emails/shared";

export type WelcomeInput = {
  firstName?: string;
  city: string;
  /** Picks already waiting in the app. */
  totalPicks: number;
  sources: number;
  baseUrl?: string;
  appUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
};

export const welcomeSubject = (input: WelcomeInput) =>
  `You're in. ${input.totalPicks} ${input.city} picks are waiting`;

export const welcomePreheader = (input: WelcomeInput) =>
  `We read ${input.sources} sources so you can read one list. New picks every Monday.`;

const facts = (input: WelcomeInput) => [
  `${input.totalPicks} picks are in your feed right now, with times, prices and ticket links.`,
  "Like or skip an event and the next week gets closer to your taste.",
  "Every Monday morning we send a fresh week. Nothing in between.",
];

export const renderWelcomeHtml = (input: WelcomeInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const greeting = input.firstName
    ? `Welcome, ${esc(input.firstName)}.`
    : `Welcome to ${esc("Sponsa")}.`;

  return layout({
    subject: welcomeSubject(input),
    preheader: welcomePreheader(input),
    headerNote: esc(input.city),
    content: `
  ${headlineBlock(
    `${greeting} Your <span style="color:${CORAL};">${esc(input.city)}</span> picks are live.`,
    `${input.totalPicks} events chosen for you out of everything happening this week.`,
  )}
  ${factsBlock(facts(input))}
  ${ctaBlock(appUrl, "Open my picks", absolute("/email-crown.png"))}`,
    reason: footerReason("You are getting this because you just created an account"),
    preferencesUrl: absolute(input.preferencesUrl ?? "/app"),
    unsubscribeUrl: absolute(input.unsubscribeUrl ?? "/app"),
  });
};

export const renderWelcomeText = (input: WelcomeInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  return [
    `${input.firstName ? `Welcome, ${input.firstName}.` : "Welcome to Sponsa."} Your ${input.city} picks are live.`,
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
