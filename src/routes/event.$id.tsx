import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";


import { eventPhotos, formatWhen, getEvent, isFree, type EventItem } from "@/data/events";

export const Route = createFileRoute("/event/$id")({
  loader: ({ params }) => {
    const event = getEvent(params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event unavailable — Sponsa" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const title = `${event.title} — ${event.day}, ${event.city}`;
    const description = `${formatWhen(event)}, ${event.venue}. ${event.price}. ${event.about}`.slice(
      0,
      158,
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventPage,
  notFoundComponent: EventMissing,
});

const facts = (event: EventItem) => [
  { icon: CalendarDays, label: "Date", value: formatWhen(event) },
  { icon: MapPin, label: "Where", value: `${event.venue}\n${event.address}` },
  { icon: Clock, label: "Doors", value: `Open ${event.doorsOpen}` },
  { icon: Users, label: "Entry", value: event.ageLimit },
];

function EventMissing() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-[15px] text-muted-foreground">This event is no longer listed.</p>
      <Link
        to="/"
        className="flex h-11 items-center rounded-full bg-surface-2 px-5 text-[14px] font-semibold text-foreground ring-1 ring-hairline"
      >
        Back to events
      </Link>
    </div>
  );
}

function EventPage() {
  const { event } = Route.useLoaderData();
  const free = isFree(event);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        {/* Cover doubles as the header: back and share float on it, so no separate bar is needed */}
        <div className="relative aspect-[4/3] w-full">
          <img
            src={event.image}
            alt={event.title}
            width={1024}
            height={768}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-x-5 top-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between">
            <Link
              to="/"
              aria-label="Back"
              className="icon-button size-11 bg-glass-media ring-1 ring-hairline backdrop-blur-md"
            >
              <ChevronLeft className="size-[21px]" />
            </Link>
            <button
              aria-label="Share"
              className="icon-button size-11 bg-glass-media ring-1 ring-hairline backdrop-blur-md"
            >
              <Share2 className="size-[18px]" />
            </button>
          </div>
        </div>

        <main className="space-y-8 px-5 pt-4">
          <header>
            <span className="eyebrow-brand inline-flex h-7 items-center rounded-full bg-surface-2 px-3">
              {event.category}
            </span>
            <h1 className="mt-3 text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground text-balance-tight">
              {event.title}
            </h1>
            <p className="mt-2 text-[14px] leading-5 text-muted-foreground">
              {formatWhen(event)} · {event.city}
            </p>
          </header>

          {event.match && event.reason && (
            <section className="rounded-3xl bg-surface-2 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 shrink-0 text-brand" />
                <span className="eyebrow-brand">{event.match}% match</span>
              </div>
              <p className="mt-2 text-[14px] leading-[1.5] text-foreground/90">{event.reason}</p>
            </section>
          )}

          <section>
            <h2 className="eyebrow mb-3">Details</h2>
            <div className="surface-card divide-y divide-hairline">
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
            </div>
          </section>

          <section>
            <h2 className="eyebrow mb-3">About</h2>
            <p className="text-[15px] leading-[1.55] text-foreground/90">{event.about}</p>
            <ul className="mt-4 space-y-2">
              {event.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-[14px] leading-5 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                  <span className="min-w-0">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-[12px] leading-4 text-muted-foreground">
            Found on <span className="text-foreground">{event.source}</span> · verified by Sponsa
          </p>
        </main>
      </div>

      {/* One decision, always reachable */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-glass px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-5 text-foreground">
              {event.price}
            </p>
            <p className="truncate text-[12px] leading-4 text-muted-foreground">
              {formatWhen(event)}
            </p>
          </div>
          <button className="btn-brand shrink-0 px-6">
            {free ? <ArrowUpRight className="size-4" /> : <Ticket className="size-[18px]" />}
            {free ? "Open page" : "Get tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}
