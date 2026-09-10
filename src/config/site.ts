/**
 * Single source of truth for site-wide constants.
 *
 * Everything here is placeholder marketing/demo data. When the real backend
 * lands, replace SCAN with values fetched from the API and CITY with the
 * signed-in user's city. Nothing else in the UI hardcodes these numbers.
 */

/** Absolute origin, used for canonical URLs, og:url and the sitemap. */
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
