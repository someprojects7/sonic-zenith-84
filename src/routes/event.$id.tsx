import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarPlus,
  ChevronLeft,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import { PhoneFrame } from "@/components/PhoneFrame";
import { SaveButton } from "@/components/SaveButton";
import { VoteButtons, voteLabel } from "@/components/VoteButtons";
import { canonicalUrl } from "@/config/site";
import {
  formatWhen,
  getEvent,
  icsFile,
  isFree,
  mapEmbedUrl,
  mapLinkUrl,
  type EventItem,
} from "@/data/events";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/event/$id")({
  loader: ({ params }) => {
    const event = getEvent(params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event unavailable on Sponsa" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const title = `${event.title}, ${event.day}, ${event.city}`;
    const description =
      `${formatWhen(event)}, ${event.venue}. ${event.price}. ${event.about}`.slice(0, 158);
    const url = canonicalUrl(`/event/${event.id}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            url,
            description: event.about,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: event.venue,
              address: {
                "@type": "PostalAddress",
                streetAddress: event.address,
                addressLocality: event.city,
              },
            },
            offers: {
              "@type": "Offer",
              price: isFree(event) ? "0" : event.price,
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
      ],
    };
  },
  component: EventPage,
  notFoundComponent: EventMissing,
});

/** Only what the header does not already say: the date lives under the title. */
const facts = (event: EventItem) => [
  { icon: Clock, label: "Doors", value: event.doorsOpen },
  { icon: Users, label: "Entry", value: event.ageLimit },
  { icon: MapPin, label: "Where", value: `${event.venue}\n${event.address}` },
];

function EventMissing() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-[15px] text-muted-foreground">Event not listed.</p>
      <Link
        to="/app"
        className="flex h-11 items-center rounded-full bg-surface-2 px-5 text-[14px] font-semibold text-foreground"
      >
        Back
      </Link>
    </div>
  );
}

function EventPage() {
  const { event } = Route.useLoaderData();
  const { vote, markSeen } = usePreferences();
  const free = isFree(event);

  // Opening the page counts as looking at it, so the "new" flag clears.
  useEffect(() => markSeen(event.id), [event.id, markSeen]);

  const shareEvent = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `${formatWhen(event)} · ${event.venue}`,
          url,
        });
      } else {
        await navigator.clipboard?.writeText(url);
      }
    } catch {
      // Dismissing the native share sheet is a normal interaction.
    }
  };

  // Downloads a calendar file, which every phone and desktop opens in its own app.
  const addToCalendar = () => {
    const blob = new Blob([icsFile(event)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PhoneFrame>
      <div className="mx-auto min-h-screen max-w-md bg-background pb-6 md:min-h-full">
        <div className="px-4 pt-4">
          <img
            src={event.image}
            alt={event.title}
            width={1024}
            height={768}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        </div>

        <main className="space-y-8 px-5 pt-5">
          <header>
            <span className="inline-flex h-7 items-center rounded-full bg-card px-3 text-[12px] font-semibold text-foreground">
              {event.category}
            </span>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground text-balance-tight">
              {event.title}
            </h1>
            {/* The only place the date is spelled out in full. */}
            <p className="mt-2 text-[14px] font-medium leading-[1.43] text-foreground">
              {formatWhen(event)}
            </p>
            <p className="text-[14px] leading-[1.43] text-muted-foreground">
              {event.venue}, {event.city}
            </p>

            {/* Three equal actions on the event itself; rating the pick lives with the match. */}
            <div className="mt-4 flex items-center gap-2">
              <SaveButton id={event.id} className="size-11 bg-surface-2" />
              <button
                type="button"
                aria-label="Share event"
                onClick={shareEvent}
                className="icon-button size-11 shrink-0 bg-surface-2 text-foreground"
              >
                <Share2 className="size-[18px]" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Add to calendar"
                onClick={addToCalendar}
                className="icon-button size-11 shrink-0 bg-surface-2 text-foreground"
              >
                <CalendarPlus className="size-[18px]" strokeWidth={2} />
              </button>
            </div>
          </header>

          {event.match && event.reason && (
            <section className="rounded-xl bg-card p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 shrink-0 text-rausch" />
                <span className="min-w-0 flex-1 text-[13px] font-semibold text-foreground">
                  {voteLabel(vote(event.id), event.match)}
                </span>
                <VoteButtons id={event.id} />
              </div>
              <p className="mt-2 text-[14px] leading-[1.43] text-muted-foreground">
                {event.reason}
              </p>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
              Details
            </h2>
            <div className="divide-y divide-hairline overflow-hidden rounded-xl bg-card">
              {facts(event).map((fact) => (
                <div
                  key={fact.label}
                  className="flex min-h-[60px] items-center gap-3.5 px-4 py-3.5"
                >
                  <fact.icon className="size-[18px] shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-4 text-muted-foreground">{fact.label}</p>
                    <p className="mt-0.5 whitespace-pre-line text-[14px] font-medium leading-5 text-foreground">
                      {fact.value}
                    </p>
                  </div>
                </div>
              ))}

              <a
                href={mapLinkUrl(event)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${event.venue} in maps`}
                className="press block"
              >
                <iframe
                  title={`Map of ${event.venue}`}
                  src={mapEmbedUrl(event)}
                  loading="lazy"
                  className="pointer-events-none block h-[150px] w-full border-0 grayscale-[0.15]"
                />
              </a>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
              About
            </h2>
            <p className="text-[14px] leading-[1.43] text-foreground">{event.about}</p>
            <ul className="mt-4 space-y-2">
              {event.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-[14px] leading-5 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rausch" />
                  <span className="min-w-0">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-[12px] leading-4 text-muted-foreground">
            Source: <span className="text-foreground">{event.source}</span>, verified
          </p>
        </main>
      </div>

      {/* One decision, always reachable; sticky so it also pins inside the desktop phone frame. */}
      <div className="sticky bottom-0 z-30 border-t border-hairline bg-glass px-5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/app"
            aria-label="Back"
            className="icon-button size-11 shrink-0 bg-surface-2 text-foreground"
          >
            <ChevronLeft className="size-[21px]" />
          </Link>
          <p className="min-w-0 truncate text-[16px] font-semibold leading-5 text-foreground">
            {event.price}
          </p>
          <button
            type="button"
            className="cta-halo press flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-rausch px-5 text-[14px] font-medium text-white"
          >
            {free ? <ArrowUpRight className="size-4" /> : <Ticket className="size-[18px]" />}
            {free ? "Open" : "Tickets"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
