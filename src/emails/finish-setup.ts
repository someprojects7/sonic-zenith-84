/**
 * Recovery email for an unfinished quiz.
 *
 * Job: bring back someone who started the quiz and stopped. It works on three
 * levers, in this order: progress already made (loss aversion), how little is
 * left (effort), one concrete example of what is waiting (value). One CTA that
 * resumes the quiz at the question they left.
 *
 * INTEGRATION: send a few hours after the last answered question, only once, and
 * stop the sequence as soon as the quiz is completed. Pass answered/total and
 * the resume URL from the saved quiz session.
 */

import { SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem } from "@/data/events";
import {
  CORAL,
  ctaBlock,
  esc,
  factsBlock,
  footerReason,
  headlineBlock,
  layout,
  makeAbsolute,
  picksBlock,
} from "@/emails/shared";

export type FinishSetupInput = {
  firstName?: string;
  city: string;
  /** Questions already answered and the full length of the quiz. */
  answered: number;
  totalQuestions: number;
  /** One event to show what the finished list looks like. */
  teaser?: EventItem;
  /** Picks unlocked once the quiz is done. */
  totalPicks: number;
  baseUrl?: string;
  /** Resumes the quiz where the person stopped. */
  quizUrl?: string;
  appUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
};

const minutesLeft = (input: FinishSetupInput) =>
  Math.max(1, Math.round((input.totalQuestions - input.answered) * 0.2));

export const finishSetupSubject = (input: FinishSetupInput) =>
  `${input.answered} of ${input.totalQuestions} answered. Your ${input.city} picks are waiting`;

export const finishSetupPreheader = (input: FinishSetupInput) =>
  `About ${minutesLeft(input)} minute${minutesLeft(input) === 1 ? "" : "s"} left, then ${input.totalPicks} picks unlock.`;

const facts = (input: FinishSetupInput) => [
  `Your answers are saved. You pick up at question ${Math.min(input.answered + 1, input.totalQuestions)}.`,
  `About ${minutesLeft(input)} minute${minutesLeft(input) === 1 ? "" : "s"} of tapping, no typing.`,
  `Then ${input.totalPicks} picks for ${input.city} with times, prices and ticket links.`,
];

export const renderFinishSetupHtml = (input: FinishSetupInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const quizUrl = absolute(input.quizUrl ?? "/quiz");
  const appUrl = absolute(input.appUrl ?? "/app");
  const name = input.firstName ? `${esc(input.firstName)}, you` : "You";

  return layout({
    subject: finishSetupSubject(input),
    preheader: finishSetupPreheader(input),
    headerNote: `${input.answered}/${input.totalQuestions}`,
    content: `
  ${headlineBlock(
    `${name} are <span style="color:${CORAL};">almost</span> set up.`,
    `${input.answered} of ${input.totalQuestions} questions answered. The rest takes about ${minutesLeft(input)} minute${minutesLeft(input) === 1 ? "" : "s"}.`,
  )}
  ${factsBlock(facts(input))}
  ${input.teaser ? picksBlock([input.teaser], appUrl) : ""}
  ${ctaBlock(quizUrl, "Finish my setup", absolute("/email-crown.png"))}`,
    reason: footerReason("You started setting up your picks"),
    preferencesUrl: absolute(input.preferencesUrl ?? "/app"),
    unsubscribeUrl: absolute(input.unsubscribeUrl ?? "/app"),
  });
};

export const renderFinishSetupText = (input: FinishSetupInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const quizUrl = absolute(input.quizUrl ?? "/quiz");
  return [
    `${input.firstName ? `${input.firstName}, you` : "You"} are almost set up.`,
    "",
    ...facts(input).map((fact, index) => `${index + 1}. ${fact}`),
    "",
    `Finish my setup: ${quizUrl}`,
    "",
    `${TAGLINE}. Unsubscribe: ${absolute(input.unsubscribeUrl ?? "/app")}`,
  ].join("\n");
};

export const renderFinishSetup = (input: FinishSetupInput) => ({
  subject: finishSetupSubject(input),
  preheader: finishSetupPreheader(input),
  html: renderFinishSetupHtml(input),
  text: renderFinishSetupText(input),
});
