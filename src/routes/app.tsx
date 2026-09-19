import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AllEventsList } from "@/components/AllEventsList";
import { AppHeader } from "@/components/AppHeader";
import { FeedTabs, type FeedTab } from "@/components/FeedTabs";
import { ForYouFeed } from "@/components/ForYouFeed";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ProfileView } from "@/components/ProfileView";
import { Tour, type TourStep } from "@/components/Tour";
import { CITY, SCAN, SITE_NAME, canonicalUrl } from "@/config/site";
import { allEvents, picks, type EventItem } from "@/data/events";
import { usePreferences } from "@/lib/preferences";
import { useHideOnScroll } from "@/lib/use-hide-on-scroll";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: `Your week in ${CITY} | ${SITE_NAME}` },
      {
        name: "description",
        content: `We scanned ${SCAN.eventsScanned} events in ${CITY} this week and picked the ones worth your time. Concerts, clubs, art and food, curated for you.`,
      },
      { property: "og:title", content: `Your week in ${CITY}` },
      {
        property: "og:description",
        content: "A weekly shortlist of city events, picked for your taste.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/app") },
      { name: "twitter:card", content: "summary_large_image" },
      // Personal feed: useful to share, not useful in search results.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/app") }],
  }),
  component: AppScreen,
});

/* Mobile layout rules shared by every screen:
   - one horizontal gutter: px-5 (20px); only scrollers go edge to edge
   - vertical rhythm: 32px between sections, 16px between cards, 8px inside a text block
   - every tappable element is at least 44px high
   - recurring shapes come from the utilities in styles.css (eyebrow, icon-button…) */
type View = FeedTab | "profile";

/** Four coach marks on the first visit: read, rate, browse, adjust. */
const TOUR: TourStep[] = [
  {
    selector: '[data-tour="card"]',
    title: "One card, one event",
    body: "Day on the left, how well it fits you on the right. Tap it for the full event, tickets and map.",
  },
  {
    selector: '[data-tour="card"] [data-tour-vote]',
    title: "Like or skip, it learns",
    body: "Every like tells us the music, places and prices you want. Skips remove that kind of night. Two weeks in, your list barely has a miss.",
  },
  {
    selector: '[data-tour="tabs"]',
    title: "Picks is your 10 a week",
    body: `We read ${SCAN.eventsScanned} events in ${CITY} and keep the 10 best for you. All is the full week if you want to dig yourself.`,
  },
  {
    selector: '[data-tour="profile"]',
    title: "Saved and your taste",
    body: "Events you keep, your interests and your plan. Change an interest here and the next list follows.",
  },
];

function AppScreen() {
  const [view, setView] = useState<View>("foryou");
  const headerHidden = useHideOnScroll();
  const { isSeen, tourDone, finishTour, restartTour } = usePreferences();

  // "New" means found in the latest scan and not opened yet.
  const unseen = (list: EventItem[]) =>
    list.filter((event) => event.isNew && !isSeen(event.id)).length;
  const newCounts = { foryou: unseen(picks), all: unseen(allEvents) };

  // Runs once, on the Picks feed, and only after storage says it has not run.
  const tourRunning = tourDone === false && view === "foryou";

  return (
    <PhoneFrame>
      <div className="mx-auto min-h-screen max-w-md bg-background pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:min-h-full">
        <AppHeader
          hidden={headerHidden && !tourRunning}
          profileActive={view === "profile"}
          onProfileClick={() => setView(view === "profile" ? "foryou" : "profile")}
        />

        <FeedTabs
          value={view === "profile" ? "foryou" : view}
          onChange={setView}
          hidden={view === "profile"}
          newCounts={newCounts}
        />

        {/* Opacity-only crossfade: the switch is frequent, so it stays subtle. */}
        <div key={view} className="animate-in fade-in duration-150 ease-out">
          {view === "foryou" && <ForYouFeed />}
          {view === "all" && <AllEventsList />}
          {view === "profile" && (
            <ProfileView
              onReplayTour={() => {
                restartTour();
                setView("foryou");
              }}
            />
          )}
        </div>

        {tourRunning && <Tour steps={TOUR} onFinish={finishTour} />}
      </div>
    </PhoneFrame>
  );
}
