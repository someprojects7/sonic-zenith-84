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

import { SITE_NAME, SITE_URL, TAGLINE } from "@/config/site";
import { type EventItem, priceLabel } from "@/data/events";

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

/** Same tokens as the app and the site: Airbnb-style canvas, hairlines, coral. */
const INK = "#222222";
const SLATE = "#6a6a6a";
const LINE = "#ebebeb";
const CANVAS = "#f7f7f8";
const CORAL = "#ff385c";

/** Site fonts with mail-safe fallbacks. */
const BODY_FONT = "Figtree,'Helvetica Neue',Helvetica,Arial,sans-serif";
const HEAD_FONT = "Outfit,'Helvetica Neue',Helvetica,Arial,sans-serif";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const makeAbsolute = (base: string) => (url: string) =>
  /^https?:\/\//.test(url)
    ? url
    : `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

/** Subject: short, specific, one number, no hype. */
export const subjectFor = (input: WeeklyDigestInput) =>
  `Your ${input.city} week is ready: ${input.totalPicks} picks`;

/** Preheader continues the subject instead of repeating it. */
export const preheaderFor = (input: WeeklyDigestInput) =>
  `${input.picks[0]?.title ?? "Your top pick"} and ${Math.max(input.totalPicks - 1, 0)} more, matched to your taste.`;

/** The site wordmark: uppercase, wide tracking, coral dot. */
const wordmark = () =>
  `<span style="font-family:${HEAD_FONT};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${SLATE};">Sponsa<span style="color:${CORAL};">.</span>net</span>`;

/** Single CTA, same shape as the app buttons. Crown = the Picks tab icon. */
const button = (href: string, label: string, crownSrc: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="#ffe4e9" style="border-radius:18px;padding:6px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td align="center" bgcolor="${CORAL}" style="border-radius:12px;">
            <a href="${esc(href)}" style="display:block;padding:14px 26px;font-family:${BODY_FONT};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
              <img src="${esc(crownSrc)}" width="18" height="18" alt="" style="display:inline-block;width:18px;height:18px;border:0;vertical-align:-3px;margin-right:8px;" />${esc(label)}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

/** "Thu 17 Sep" split into the three lines of the date block. */
const splitDay = (day: string) => {
  const [weekday = "", date = "", month = ""] = day.trim().split(/\s+/);
  return { weekday, date, month };
};

/** One pick, laid out like the event card in the app: date block, category, title, when, price. */
const eventRow = (event: EventItem, appUrl: string) => {
  const href = `${appUrl.replace(/\/app\/?$/, "")}/event/${event.id}`;
  const match = event.match
    ? `<span style="color:${CORAL};font-weight:600;">${event.match}% match</span> · `
    : "";
  const { weekday, date, month } = splitDay(event.day);
  return `
<tr>
  <td style="padding:0 0 10px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border-radius:10px;"><tr><td style="padding:12px 14px;">
    <a href="${esc(href)}" style="display:block;text-decoration:none;color:${INK};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="72" valign="top" style="width:72px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="56" style="width:56px;background-color:${INK};border-radius:8px;">
              <tr><td align="center" style="font-family:${HEAD_FONT};padding:8px 0 9px 0;">
                <div style="font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.06em;color:rgba(255,255,255,0.7);">${esc(date)}</div>
                <div style="font-size:20px;line-height:24px;font-weight:700;letter-spacing:-0.01em;color:#ffffff;">${esc(weekday)}</div>
                <div style="font-size:11px;line-height:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.7);">${esc(month)}</div>



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

/** Picks sit in a narrower centred column so they do not span the full email. */
const picksBlock = (picks: EventItem[], appUrl: string) => `
<tr><td style="padding:0 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
    ${picks.map((event) => eventRow(event, appUrl)).join("")}
  </table>
</td></tr>`;

export const renderWeeklyDigestHtml = (input: WeeklyDigestInput) => {
  const absolute = makeAbsolute(input.baseUrl ?? SITE_URL);
  const appUrl = absolute(input.appUrl ?? "/app");
  const rest = Math.max(input.totalPicks - input.picks.length, 0);
  const greeting = input.firstName ? `${esc(input.firstName)}, your` : "Your";

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(subjectFor(input))}</title>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
<div style="display:none;font-size:1px;color:${CANVAS};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheaderFor(input))}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${CANVAS};">
<tr><td align="center" style="padding:20px 12px 28px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:${CANVAS};">

  <tr><td style="padding:8px 24px 0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td>${wordmark()}</td>
      <td align="right" style="font-family:${BODY_FONT};font-size:13px;font-weight:500;color:${SLATE};">${esc(input.weekLabel)}</td>
    </tr></table>
  </td></tr>

  <tr><td align="center" style="padding:36px 24px 18px 24px;font-family:${BODY_FONT};text-align:center;">
    <h1 style="margin:0;font-family:${HEAD_FONT};font-size:25px;line-height:31px;font-weight:700;color:${INK};letter-spacing:-0.02em;">${greeting} <span style="color:${CORAL};">${esc(input.city)}</span> week is ready.</h1>
    <p style="margin:8px 0 0 0;font-size:15px;line-height:22px;color:${SLATE};">${input.sources} sources, ${input.eventsScanned} events, ${input.totalPicks} that match your taste.</p>
  </td></tr>

  ${picksBlock(input.picks, appUrl)}

  <tr><td style="padding:20px 24px 14px 24px;font-family:${BODY_FONT};text-align:center;border-top:1px solid ${LINE};">
    <p style="margin:0;font-size:15px;line-height:21px;color:${SLATE};">${rest} more picks waiting, with times, prices and tickets.</p>
  </td></tr>

  <tr><td style="padding:0 24px 26px 24px;" align="center">${button(appUrl, `See all ${input.totalPicks} picks`, absolute("/email-crown.png"))}</td></tr>

  <tr><td style="padding:0 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="border-top:1px solid ${LINE};font-family:${BODY_FONT};text-align:center;">
      <p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:${SLATE};">
        ${esc(TAGLINE)}. Once a week, because you set up picks on ${esc(SITE_NAME)}.net.<br />
        <a href="${esc(absolute(input.preferencesUrl ?? "/app"))}" style="color:${SLATE};">Change your interests</a> ·
        <a href="${esc(absolute(input.unsubscribeUrl ?? "/app"))}" style="color:${SLATE};">Unsubscribe</a>
      </p>
    </td></tr></table>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
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
        `${e.match ?? ""}% ${e.title}\n${e.day + " · " + e.time} · ${e.venue} · ${priceLabel(e)}\n${appUrl.replace(/\/app\/?$/, "")}/event/${e.id}`,
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
