/**
 * Shared email primitives: tokens, escaping, wordmark, button, event row and the
 * outer layout. Every Sponsa email is built from these so the inbox looks like
 * the app and the site: Airbnb-style canvas, white cards, coral only on actions.
 *
 * INTEGRATION: these helpers are pure strings, so any backend job can render an
 * email without React. Absolute URLs resolve against baseUrl (production site
 * URL by default), which previews on another origin must override.
 */

import { SITE_NAME, SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem, priceLabel } from "@/data/events";

export const INK = "#222222";
export const SLATE = "#6a6a6a";
export const LINE = "#ebebeb";
export const CANVAS = "#f7f7f8";
export const CORAL = "#ff385c";

/** Site fonts with mail-safe fallbacks. */
export const BODY_FONT = "Figtree,'Helvetica Neue',Helvetica,Arial,sans-serif";
export const HEAD_FONT = "Outfit,'Helvetica Neue',Helvetica,Arial,sans-serif";

export const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const makeAbsolute = (base: string) => (url: string) =>
  /^https?:\/\//.test(url)
    ? url
    : `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

/** The site wordmark: uppercase, wide tracking, coral dot. */
export const wordmark = () =>
  `<span style="font-family:${HEAD_FONT};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${SLATE};">Sponsa<span style="color:${CORAL};">.</span>net</span>`;

/** Single CTA, same shape as the app buttons. The icon is optional. */
export const button = (href: string, label: string, iconSrc?: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="#ffe4e9" style="border-radius:18px;padding:6px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td align="center" bgcolor="${CORAL}" style="border-radius:12px;">
            <a href="${esc(href)}" style="display:block;padding:14px 26px;font-family:${BODY_FONT};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
              ${iconSrc ? `<img src="${esc(iconSrc)}" width="18" height="18" alt="" style="display:inline-block;width:18px;height:18px;border:0;vertical-align:-3px;margin-right:8px;" />` : ""}${esc(label)}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

/** "Thu 17 Sep" split into the three lines of the date block. */
export const splitDay = (day: string) => {
  const [weekday = "", date = "", month = ""] = day.trim().split(/\s+/);
  return { weekday, date, month };
};

/** Event link on the site, derived from an app URL on the same origin. */
export const eventUrl = (appUrl: string, id: string) =>
  `${appUrl.replace(/\/app\/?$/, "")}/event/${id}`;

/** One pick, laid out like the event card in the app: date block, category, title, when, price. */
export const eventRow = (event: EventItem, appUrl: string) => {
  const href = eventUrl(appUrl, event.id);
  const match = event.match
    ? `<span style="color:${CORAL};font-weight:600;">${event.match}% match</span> · `
    : "";
  const { weekday, date, month } = splitDay(event.day);
  return `
<tr>
  <td style="padding:0 0 8px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-radius:10px;"><tr><td style="padding:12px 14px;">
    <a href="${esc(href)}" style="display:block;text-decoration:none;color:${INK};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="72" valign="top" style="width:72px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="56" style="width:56px;background-color:#ffffff;border:1px solid ${LINE};border-radius:8px;">
              <tr><td style="line-height:0;font-size:0;padding:0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td height="3" bgcolor="${CORAL}" style="height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr></table></td></tr>
              <tr><td align="center" style="font-family:${HEAD_FONT};padding:7px 0 8px 0;">
                <div style="font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.06em;color:${SLATE};">${esc(date)}</div>
                <div style="font-size:20px;line-height:24px;font-weight:700;letter-spacing:-0.01em;color:${INK};">${esc(weekday)}</div>
                <div style="font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.06em;color:${SLATE};">${esc(month)}</div>
              </td></tr>
            </table>
        </td>

        <td style="font-family:${BODY_FONT};">
            <div style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${SLATE};">${match}${esc(event.category)}</div>
            <div style="padding-top:3px;font-size:16px;line-height:21px;font-weight:600;letter-spacing:-0.01em;color:${INK};">${esc(event.title)}</div>
            <div style="padding-top:3px;font-size:14px;line-height:19px;color:${SLATE};">${esc(event.time)} · <span style="color:${INK};font-weight:600;">${esc(priceLabel(event))}</span></div>
        </td>
        <td align="right" valign="middle" style="font-family:${BODY_FONT};font-size:18px;font-weight:400;color:${CORAL};white-space:nowrap;padding-left:10px;">&rsaquo;</td>
      </tr>
    </table>
    </a>
    </td></tr></table>
  </td>
</tr>`;
};

/** A list of picks in the shared 600px column. */
export const picksBlock = (picks: EventItem[], appUrl: string) => `
<tr><td style="padding:0 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
    ${picks.map((event) => eventRow(event, appUrl)).join("")}
  </table>
</td></tr>`;

/** Three short facts in one line: used for "what happens next" style blocks. */
/** Three numbers in one white card: the work already done for this person. */
export const statsStrip = (stats: { value: string; label: string }[]) => `
<tr><td style="padding:0 24px 8px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-radius:10px;"><tr><td style="padding:16px 8px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      ${stats
        .map(
          (stat) => `<td align="center" width="33%" style="font-family:${BODY_FONT};">
        <div style="font-family:${HEAD_FONT};font-size:22px;line-height:26px;font-weight:700;letter-spacing:-0.02em;color:${INK};">${esc(stat.value)}</div>
        <div style="padding-top:2px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${SLATE};">${esc(stat.label)}</div>
      </td>`,
        )
        .join("")}
    </tr></table>
  </td></tr></table>
</td></tr>`;

/** Small coral eyebrow above a headline. */
export const eyebrow = (text: string) => `
<tr><td align="center" style="padding:28px 24px 0 24px;text-align:center;">
  <span style="display:inline-block;font-family:${HEAD_FONT};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${CORAL};">${esc(text)}</span>
</td></tr>`;

/** Section label above a block of content. */
export const sectionLabel = (text: string) => `
<tr><td style="padding:16px 24px 8px 24px;font-family:${BODY_FONT};">
  <span style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${SLATE};">${esc(text)}</span>
</td></tr>`;

export const factsBlock = (facts: string[]) => `
<tr><td style="padding:0 24px 4px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-radius:10px;"><tr><td style="padding:14px 16px;font-family:${BODY_FONT};">
    ${facts
      .map(
        (
          fact,
          index,
        ) => `<div style="padding:${index ? "8px" : "0"} 0 0 0;font-size:14px;line-height:20px;color:${SLATE};">
      <span style="color:${CORAL};font-weight:700;">${index + 1}</span>&nbsp;&nbsp;${esc(fact)}
    </div>`,
      )
      .join("")}
  </td></tr></table>
</td></tr>`;

/** The outer email: preheader, canvas, header row, content rows, footer. */
export const layout = (options: {
  subject: string;
  preheader: string;
  /** Small text on the right of the header row. */
  headerNote?: string;
  /** Hide the wordmark row entirely (welcome email needs no header). */
  hideHeader?: boolean;
  /** Rows already wrapped in <tr>. */
  content: string;
  /** Footer sentence explaining why this email arrived. */
  reason: string;
  preferencesUrl: string;
  unsubscribeUrl: string;
}) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(options.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
<div style="display:none;font-size:1px;color:${CANVAS};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(options.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${CANVAS};">
<tr><td align="center" style="padding:20px 12px 28px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:${CANVAS};">

  <tr><td style="padding:8px 24px 0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td>${wordmark()}</td>
      <td align="right" style="font-family:${BODY_FONT};font-size:13px;font-weight:500;color:${SLATE};">${esc(options.headerNote ?? "")}</td>
    </tr></table>
  </td></tr>

  ${options.content}

  <tr><td style="padding:0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="border-top:1px solid ${LINE};font-family:${BODY_FONT};text-align:center;">
      <p style="margin:20px 0 0 0;font-size:12px;line-height:18px;color:${SLATE};">
        ${esc(options.reason)}<br />
        <a href="${esc(options.preferencesUrl)}" style="color:${SLATE};">Change your interests</a> ·
        <a href="${esc(options.unsubscribeUrl)}" style="color:${SLATE};">Unsubscribe</a>
      </p>
    </td></tr></table>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

/** Centred headline plus one supporting line. */
export const headlineBlock = (headline: string, sub: string) => `
<tr><td align="center" style="padding:32px 24px 20px 24px;font-family:${BODY_FONT};text-align:center;">
  <h1 style="margin:0;font-family:${HEAD_FONT};font-size:25px;line-height:31px;font-weight:700;color:${INK};letter-spacing:-0.02em;">${headline}</h1>
  <p style="margin:8px 0 0 0;font-size:15px;line-height:22px;color:${SLATE};">${sub}</p>
</td></tr>`;

/** One CTA row, always straight after the value. */
export const ctaBlock = (href: string, label: string, iconSrc?: string) => `
<tr><td style="padding:12px 24px 32px 24px;" align="center">${button(href, label, iconSrc)}</td></tr>`;

export const footerReason = (sentence: string) => `${TAGLINE}. ${sentence} on ${SITE_NAME}.net.`;

export { SITE_NAME, SITE_URL, TAGLINE };
