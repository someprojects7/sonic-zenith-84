/**
 * Single source of truth for site-wide constants.
 *
 * Everything here is placeholder marketing/demo data. When the real backend
 * lands, replace SCAN with values fetched from the API and CITY with the
 * signed-in user's city. Nothing else in the UI hardcodes these numbers.
 */

/**
 * Absolute origin, used for canonical URLs, og:url and the sitemap.
 *
 * This is the live origin the site is served from today. When the custom domain
 * (sponsa.net) is connected, change this one line and regenerate
 * public/sitemap.xml + public/robots.txt to match.
 */
export const SITE_URL = "https://sponsanet.lovable.app";

export const SITE_NAME = "Sponsa";

/** Product tagline, reused in metadata and on the landing page. */
export const TAGLINE = "Your shortcut to the city";

/** Default city of the demo feed. Replace with the user's city. */
export const CITY = "Vilnius";

/** Numbers shown in the app feed and the landing infographic. */
export const SCAN = {
  /** Events found in the latest scan (app feed). */
  eventsScanned: 746,
  /** Sources covered by the latest scan (app feed). */
  sources: 15,
  /** Scrolling time saved, already formatted (app feed). */
  timeSaved: "3h",
  /** Landing-page rounded claims. */
  sourcesClaim: "50+",
  eventsPerWeekClaim: "700+",
  picksPerWeekClaim: "10",
} as const;

/** Absolute canonical URL for a route path such as "/app". */
export const canonicalUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * Operator details shown on /terms. The service is run by an individual, so no
 * company registration or street address is published; postal details are
 * provided on request to the contact address below.
 */
export const LEGAL = {
  operatorName: "Artsiom Derenchuk",
  operatorForm: "an individual operating the service",
  country: "Lithuania",
  courtsCity: "Vilnius",
  contactEmail: "legal@sponsa.net",
  noticeEmail: "notice@sponsa.net",
  liabilityCap: "EUR 100",
  lastUpdated: "18 September 2026",
} as const;
