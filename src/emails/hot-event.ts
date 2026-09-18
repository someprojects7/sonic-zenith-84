/**
 * Alert email for one unmissable event, sent the moment tickets go on sale.
 *
 * Job: one event, one reason it matters, one link to tickets. Urgency comes from
 * facts only (on sale now, expected to sell out, the match with this person's
 * taste), never from invented countdowns. This is the rarest email in the set,
 * so the rule is at most one per person per week.
 *
 * INTEGRATION: trigger when a scan finds an event above a high match threshold
 * whose tickets just opened. Pass the event, the reason line and the ticket URL
 * from the source listing.
 */

import { SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem, formatWhen, priceLabel } from "@/data/events";
import {
  CORAL,
  HEAD_FONT,
  INK,
  SLATE,
  ctaBlock,
  esc,
  eventRow,
  footerReason,
  layout,
  makeAbsolute,
} from "@/emails/shared";

export type HotEventInput = {
  firstName?: string;
  city: string;
  event: EventItem;
  /** One short sentence: why this one is worth breaking the weekly rhythm. */
  reason: string;
  /** Where tickets are sold, plus the name shown next to the link. */
  ticketUrl: string;
  ticketSource?: string;
  baseUrl?: string;
  appUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
};

export const hotEventSubject = (input: HotEventInput) =>
  `Tickets just opened: ${input.event.title}`;

export const hotEventPreheader = (input: HotEventInput) =>
  `${formatWhen(input.event)} · ${input.event.venue} · ${priceLabel(input.event)}. ${input.event.match ?? 0}% match with your taste.`;

/** Small coral label above the headline: the one thing that makes this urgent. */
const alertLabel = (text: string) => `
<tr><td align="center" style="padding:28px 24px 0 24px;text-align:center;">
  <span style="display:inline-block;font-family:${HEAD_FONT};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${CORAL};">${esc(text)}</span>
</td></tr>`;

const reasonBlock = (reason: string, source?: string) => `
<tr><td style="padding:4px 24px 0 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-radius:10px;"><tr><td style="padding:14px 16px;font-family:Figtree,'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${SLATE};">Why now</div>
    <div style="padding-top:4px;font-size:14px;line-height:20px;color:${INK};">${esc(reason)}</div>
    ${source ? `<div style="padding-top:6px;font-size:12px;line-height:18px;color:${SLATE};">Sold by ${esc(source)}</div>` : ""}
  </td></tr></table>
</td></tr>`;

export const renderHotEventHtml = (input: HotEventInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const name = input.firstName ? `${esc(input.firstName)}, this` : "This";

  return layout({
    subject: hotEventSubject(input),
    preheader: hotEventPreheader(input),
    headerNote: esc(input.city),
    content: `
  ${alertLabel("On sale now")}
  <tr><td align="center" style="padding:10px 24px 20px 24px;font-family:Figtree,'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;">
    <h1 style="margin:0;font-family:${HEAD_FONT};font-size:25px;line-height:31px;font-weight:700;color:${INK};letter-spacing:-0.02em;">${name} one is a <span style="color:${CORAL};">${input.event.match ?? 0}% match</span>.</h1>
    <p style="margin:8px 0 0 0;font-size:15px;line-height:22px;color:${SLATE};">Tickets opened today and this kind of night sells out early.</p>
  </td></tr>
  <tr><td style="padding:0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${eventRow(input.event, appUrl)}</table>
  </td></tr>
  ${reasonBlock(input.reason, input.ticketSource)}
  ${ctaBlock(input.ticketUrl, "Get tickets", absolute("/email-crown.png"))}`,
    reason: footerReason("Rare alerts only, for events far above your usual match"),
    preferencesUrl: absolute(input.preferencesUrl ?? "/app"),
    unsubscribeUrl: absolute(input.unsubscribeUrl ?? "/app"),
  });
};

export const renderHotEventText = (input: HotEventInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  return [
    `On sale now: ${input.event.title}`,
    "",
    `${formatWhen(input.event)} · ${input.event.venue} · ${priceLabel(input.event)}`,
    `${input.event.match ?? 0}% match with your taste.`,
    "",
    `Why now: ${input.reason}`,
    "",
    `Get tickets: ${input.ticketUrl}`,
    "",
    `${TAGLINE}. Unsubscribe: ${absolute(input.unsubscribeUrl ?? "/app")}`,
  ].join("\n");
};

export const renderHotEvent = (input: HotEventInput) => ({
  subject: hotEventSubject(input),
  preheader: hotEventPreheader(input),
  html: renderHotEventHtml(input),
  text: renderHotEventText(input),
});
