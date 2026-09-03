import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AllEventsList } from "@/components/AllEventsList";
import { AppHeader } from "@/components/AppHeader";
import { FeedTabs, type FeedTab } from "@/components/FeedTabs";
import { ForYouFeed } from "@/components/ForYouFeed";
import { ProfileView } from "@/components/ProfileView";
import { useHideOnScroll } from "@/lib/use-hide-on-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sponsa — events worth your time in Vilnius" },
      {
        name: "description",
        content:
          "We scanned 746 events in Vilnius this week and picked the ones worth your time. Concerts, clubs, art and food, curated for you.",
      },
      { property: "og:title", content: "Sponsa — events worth your time" },
      {
        property: "og:description",
        content: "A weekly shortlist of city events, picked for your taste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* Mobile layout rules shared by every screen:
   - one horizontal gutter: px-5 (20px); only scrollers go edge to edge
   - vertical rhythm: 32px between sections, 16px between cards, 8px inside a text block
   - every tappable element is at least 44px high
   - recurring shapes come from the utilities in styles.css (surface-card, eyebrow, btn-brand…) */
type View = FeedTab | "profile";

function Index() {
  const [view, setView] = useState<View>("foryou");
  const headerHidden = useHideOnScroll();

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
        />

        {view === "foryou" && <ForYouFeed />}
        {view === "all" && <AllEventsList />}
        {view === "profile" && <ProfileView />}
      </div>
    </div>
  );
}
