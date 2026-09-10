import { Bell, ChevronRight, Heart, Sparkles, User } from "lucide-react";

const TASTE_LINKS = [
  { label: "Saved events", icon: Heart },
  { label: "Interests", icon: Sparkles },
  { label: "Notifications", icon: Bell },
] as const;

/** Who Sponsa thinks you are, and the switches that shape the picks. */
export function ProfileView() {
  return (
    <main className="space-y-7 pb-4 pt-6">
      <section className="px-5 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-gradient text-brand-foreground shadow-brand">
          <User className="size-7" strokeWidth={2.1} />
        </span>
        <h2 className="mt-4 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-foreground">
          Eduard
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.6] text-muted-foreground">
          Vilnius · 12 picks liked
        </p>
      </section>

      <section className="bg-tone-cool py-7">
        <p className="eyebrow mb-4 text-center">Your taste</p>
        <div className="px-4">
          <div className="surface-card divide-y divide-hairline overflow-hidden">
            {TASTE_LINKS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex min-h-[58px] w-full items-center gap-3.5 px-4 text-left"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="size-[17px]" strokeWidth={2.1} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold tracking-[-0.01em] text-foreground">
                  {label}
                </span>
                <ChevronRight
                  className="size-[18px] shrink-0 text-muted-foreground"
                  strokeWidth={2.2}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
