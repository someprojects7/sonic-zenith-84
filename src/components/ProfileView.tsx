import { Bell, ChevronRight, Heart, Sparkles, User } from "lucide-react";

const TASTE_LINKS = [
  { label: "Saved events", icon: Heart },
  { label: "Interests", icon: Sparkles },
  { label: "Notifications", icon: Bell },
] as const;

/** Who Sponsa thinks you are, and the switches that shape the picks. */
export function ProfileView() {
  return (
    <main className="space-y-8 pb-6 pt-8">
      <section className="px-5">
        <span className="grid size-16 place-items-center rounded-full bg-brand text-brand-foreground">
          <User className="size-7" strokeWidth={2} />
        </span>
        <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
          Eduard
        </h2>
        <p className="mt-1.5 text-[14px] leading-[1.43] text-muted-foreground">
          Vilnius · 12 picks liked
        </p>
      </section>

      <section className="px-5">
        <h3 className="mb-3 text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-foreground">
          Your taste
        </h3>
        <div className="divide-y divide-hairline overflow-hidden rounded-xl bg-card">
          {TASTE_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex min-h-[60px] w-full items-center gap-3 px-4 text-left active:bg-surface-2"
            >
              <Icon className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={2} />
              <span className="min-w-0 flex-1 truncate text-[16px] font-medium text-foreground">
                {label}
              </span>
              <ChevronRight
                className="size-[18px] shrink-0 text-muted-foreground"
                strokeWidth={2}
              />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
