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


import { formatWhen, getEvent, isFree, type EventItem } from "@/data/events";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <div className="h-1 w-full bg-accent-gradient" />
        <div className="px-4 pt-4">
          <img
            src={event.image}
            alt={event.title}
            width={1024}
            height={768}
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />
        </div>

        <main className="space-y-8 px-5 pt-5">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <span className="eyebrow-brand inline-flex h-7 items-center rounded-full bg-brand-soft px-3">
                {event.category}
              </span>
              <h1 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.03em] text-foreground text-balance-tight">
                {event.title}
              </h1>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted-foreground">
                {formatWhen(event)} · {event.city}
              </p>
            </div>
            <button
              type="button"
              aria-label="Share event"
              onClick={shareEvent}
              className="icon-button mt-1 size-11 shrink-0 bg-brand-soft text-brand"
            >
              <Share2 className="size-[18px]" strokeWidth={2.1} />
            </button>
          </header>

          {event.match && event.reason && (
            <section className="rounded-3xl bg-tone-cool p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 shrink-0 text-brand" />
                <span className="eyebrow-brand">{event.match}% match</span>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-foreground/90">{event.reason}</p>
            </section>
          )}

          <section>
            <h2 className="eyebrow mb-3">Details</h2>
            <div className="surface-card divide-y divide-hairline overflow-hidden">
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

      {/* One decision, always reachable; back stays under the thumb on mobile. */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-glass px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/"
            aria-label="Back to events"
            className="icon-button size-11 shrink-0 bg-surface-2 ring-1 ring-hairline"
          >
            <ChevronLeft className="size-[21px]" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-5 text-foreground">
              {event.price}
            </p>
            <p className="truncate text-[12px] leading-4 text-muted-foreground">
              {formatWhen(event)}
            </p>
          </div>
          <button type="button" className="btn-brand shrink-0 px-5">
            {free ? <ArrowUpRight className="size-4" /> : <Ticket className="size-[18px]" />}
            {free ? "Open page" : "Get tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}
