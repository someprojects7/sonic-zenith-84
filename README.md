# Sponsa — your shortcut to the city

Sponsa scans everything happening in a city and keeps only the events worth
someone's week. This repository holds the production-ready frontend: landing
page, 20-question onboarding quiz, weekly picks feed, full event calendar and
event detail pages.

The UI is complete and consistent. All content is **demo data** — the next step
is wiring real sources, a database, real quiz logic and real photos.

## Stack

| Concern       | Choice                                                               |
| ------------- | -------------------------------------------------------------------- |
| Framework     | TanStack Start v1 (React 19, SSR)                                    |
| Build         | Vite 7                                                               |
| Routing       | TanStack Router, file-based (`src/routes`)                           |
| Data fetching | TanStack Query (already provided at the router root)                 |
| Styling       | Tailwind CSS v4 via `src/styles.css` (design tokens, no config file) |
| UI primitives | shadcn/ui + Radix (`src/components/ui`)                              |
| Icons         | lucide-react                                                         |

```sh
npm i
npm run dev      # http://localhost:8080
npm run build    # production build
npm run lint     # eslint
```

## Project structure

```
src/
  config/site.ts        site-wide constants (URL, city, scan numbers)
  data/events.ts        demo events + helpers (formatWhen, priceLabel, isFree…)
  routes/
    __root.tsx          app shell, providers, site-wide metadata
    index.tsx           landing page (public, indexed)
    quiz.tsx            20-question onboarding (animated, 4 question shapes)
    paywall.tsx         Sponsa Pro plans (noindex; billing not wired yet)
    terms.tsx           terms of service (public, indexed)
    app.tsx             feed shell: tabs (Picks / All) + profile (noindex)
    event.$id.tsx       event detail (noindex until real events exist)
  components/           feature components (feed, cards, header, tabs…)
  components/PhoneFrame phone shell + city backdrop on desktop only
  components/ui/        shadcn primitives — avoid editing
  lib/
    preferences.tsx     interests, saved events, votes, viewed state (localStorage)
    use-hide-on-scroll  header hide-on-scroll behaviour
    theme.tsx           light by day, dark by night (local time)
    utils.ts            cn()
```

`src/routeTree.gen.ts` is generated — never edit it.

## Design system

All colours, radii and type sizes follow an Airbnb-style reference and live as
tokens in `src/styles.css`:

| Token              | Value     | Use                          |
| ------------------ | --------- | ---------------------------- |
| `background`       | `#f7f7f7` | page canvas                  |
| `card`             | `#ffffff` | cards, sheets, header        |
| `foreground`       | `#222222` | primary text                 |
| `muted-foreground` | `#6a6a6a` | secondary text               |
| `hairline`         | `#ebebeb` | 1px borders                  |
| `rausch`           | `#ff385c` | accent, primary actions only |

Rules that keep screens consistent:

- Never hardcode colours (`text-white`, `bg-[#…]`) — use tokens.
- One horizontal gutter: `px-5` (20px); only scrollers go edge to edge.
- Vertical rhythm: 32px between sections, 16px between cards, 8px inside text.
- Tap targets are at least 44px high.
- Card radius 12px; controls are pills or circles.
- Fonts: Inter for app UI, Figtree for landing body copy, Outfit for the
  `SPONSA` wordmark and landing headings.
- The landing page uses its own fixed light palette (`ink`, `slate`, `cloud`,
  `paper`, `line`, `signal`) so it never flips to the app's night theme.

## Where real data plugs in

| What                     | Where                                                                        | Notes                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Events                   | `src/data/events.ts`                                                         | Keep the `EventItem` type and the helpers; swap the array for an API/database read. `picks` is the personalised shortlist, `allEvents` the full calendar. |
| Scan numbers             | `src/config/site.ts` (`SCAN`)                                                | Events scanned, sources, time saved and landing claims — one place, used by feed and landing.                                                             |
| City                     | `src/config/site.ts` (`CITY`)                                                | Currently Vilnius; should come from the signed-in user.                                                                                                   |
| Quiz                     | `src/routes/quiz.tsx` (`QUESTIONS`)                                          | 20 questions with placeholder copy; answers land in `PreferencesProvider`. Persist them server-side.                                                      |
| Preferences              | `src/lib/preferences.tsx`                                                    | localStorage today; replace the read/write calls with API calls, keep the hook shape.                                                                     |
| Photos                   | `src/assets/*`                                                               | Generated placeholders. Replace with real event/venue/team images and keep the same import pattern.                                                       |
| Auth, payments, Pro plan | landing + quiz result                                                        | CTAs route to `/quiz` and `/app`; there is no auth or billing yet.                                                                                        |
| Canonical domain         | `src/config/site.ts` (`SITE_URL`), `public/sitemap.xml`, `public/robots.txt` | Currently `https://sponsanet.lovable.app`. Switch all three to `https://sponsa.net` the day the custom domain is connected.                               |
| Legal details            | `src/config/site.ts` (`LEGAL`)                                               | Operator name, contact and notice mailboxes, liability cap, last-updated date. Have `/terms` reviewed by a Lithuanian lawyer before launch.               |

## Recommended backend steps

1. Add auth (accounts, sign-in) and gate `/app` behind it.
2. Model `events`, `sources`, `users`, `preferences`, `votes`, `saves` in the
   database, with row-level security per user.
3. Move scraping/scanning into scheduled server jobs writing into `events`.
4. Serve events through server functions (`createServerFn`) and read them in
   route loaders with `queryClient.ensureQueryData`.
5. Add billing for Sponsa Pro; keep the free tier limits in one config file.
6. Generate the sitemap from real events once event pages should be indexed.

## SEO

- Every route defines its own `head()`: title, description, `og:*`,
  `twitter:card`, `og:url` and a self-referencing canonical.
- `/` carries `WebSite` JSON-LD, the root carries `Organization`, event pages
  carry `Event` JSON-LD (place, offer, attendance mode).
- `/app`, `/paywall` and `/event/*` are `noindex, follow` — personal feed,
  funnel and demo data. Flip event pages to indexable once events are real.
- `public/robots.txt` allows all crawlers and points at `public/sitemap.xml`,
  which lists only the indexable pages (`/`, `/quiz`, `/terms`).
- Performance: fonts load with `display=swap` behind `preconnect`, every
  below-the-fold image is `loading="lazy"` with intrinsic `width`/`height` (no
  layout shift), and images are compressed JPEGs bundled by Vite with hashed
  filenames for long-term caching.
- Add `og:image` / `twitter:image` (1200×630, absolute URL) once real hosted
  images exist; bundled assets resolve to relative URLs and are intentionally
  omitted.
- Semantic HTML with one `h1` per page and alt text on every image.

## Conventions

- TypeScript everywhere, no `any` in feature code.
- Server logic goes in `createServerFn` (`@tanstack/react-start`); raw HTTP
  endpoints and webhooks go under `src/routes/api/public/*` and must verify the
  caller.
- `process.env` is server-only and read inside handlers; browser config uses
  `import.meta.env.VITE_*`.
- Keep copy short: one word for tabs, no filler sentences, no long dashes.

## Built with Lovable

Continue in the [Lovable editor](https://lovable.dev/projects/6ce5eba8-ce4b-4c79-98bf-58d137a9f131).
Pushes to `main` sync back into Lovable, so keep the branch working and avoid
rewriting published history.
