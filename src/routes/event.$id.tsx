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
import { getEvent } from "@/data/events";

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
    const title = `${event.title} — ${event.day}, Vilnius`;
    const description = `${event.day} at ${event.time}, ${event.venue}. ${event.price}. ${
      event.about ?? "Details, tickets and location."
    }`.slice(0, 158);
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
  const isFree = event.price.toLowerCase().startsWith("free");

  const facts = [
    { icon: CalendarDays, label: "Date", value: `${event.day} · ${event.time}` },
    { icon: MapPin, label: "Where", value: `${event.venue}\n${event.address ?? "Vilnius"}` },
    { icon: Clock, label: "Doors", value: event.doorsOpen ? `Open ${event.doorsOpen}` : "—" },
    { icon: Users, label: "Entry", value: event.ageLimit ?? "All ages" },
  ];

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
              className="grid size-11 place-items-center rounded-full bg-glass text-foreground ring-1 ring-hairline backdrop-blur-md transition-transform active:scale-95"
            >
              <ChevronLeft className="size-[21px]" />
            </Link>
            <button
              aria-label="Share"
              className="grid size-11 place-items-center rounded-full bg-glass text-foreground ring-1 ring-hairline backdrop-blur-md transition-transform active:scale-95"
            >
              <Share2 className="size-[18px]" />
            </button>
          </div>
        </div>

        <main className="-mt-6 space-y-8 px-5">
          <header>
            <span className="inline-flex h-7 items-center rounded-full bg-surface-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {event.category}
            </span>
            <h1 className="mt-3 text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground text-balance-tight">
              {event.title}
            </h1>
            <p className="mt-2 text-[14px] leading-5 text-muted-foreground">
              {event.day} · {event.time} · {event.city ?? "Vilnius"}
            </p>
          </header>

          {typeof event.match === "number" && event.reason && (
            <section className="rounded-3xl bg-surface-2 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 shrink-0 text-brand" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {event.match}% match
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-[1.5] text-foreground/90">{event.reason}</p>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Details
            </h2>
            <div className="divide-y divide-hairline rounded-3xl bg-card ring-1 ring-hairline">
              {facts.map((f) => (
                <div key={f.label} className="flex min-h-[60px] items-center gap-3.5 px-4 py-3.5">
                  <f.icon className="size-[18px] shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-4 text-muted-foreground">{f.label}</p>
                    <p className="mt-0.5 whitespace-pre-line text-[14px] font-medium leading-5 text-foreground">
                      {f.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {event.about && (
            <section>
              <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                About
              </h2>
              <p className="text-[15px] leading-[1.55] text-foreground/90">{event.about}</p>
              {event.highlights && (
                <ul className="mt-4 space-y-2">
                  {event.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[14px] leading-5 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="min-w-0">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {event.source && (
            <p className="text-[12px] leading-4 text-muted-foreground">
              Found on <span className="text-foreground">{event.source}</span> · verified by Sponsa
            </p>
          )}
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
              {event.day} · {event.time}
            </p>
          </div>
          <button className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-gradient px-6 text-[15px] font-semibold text-brand-foreground shadow-brand transition-transform active:scale-[0.98]">
            {isFree ? <ArrowUpRight className="size-4" /> : <Ticket className="size-[18px]" />}
            {isFree ? "Open page" : "Get tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}
