import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AllEventsList } from "@/components/AllEventsList";
import { AppHeader } from "@/components/AppHeader";
import { FeedTabs, type FeedTab } from "@/components/FeedTabs";
import { ForYouFeed } from "@/components/ForYouFeed";
import { ProfileView } from "@/components/ProfileView";
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

function AppScreen() {
  const [view, setView] = useState<View>("foryou");
  const headerHidden = useHideOnScroll();
  const { isSeen } = usePreferences();

  // "New" means found in the latest scan and not opened yet.
  const unseen = (list: EventItem[]) =>
    list.filter((event) => event.isNew && !isSeen(event.id)).length;
  const newCounts = { foryou: unseen(picks), all: unseen(allEvents) };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <AppHeader
          hidden={headerHidden}
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
          {view === "profile" && <ProfileView />}
        </div>
      </div>
    </div>
  );
}
