import { Bell, ChevronRight, Heart, Sparkles, User } from "lucide-react";

const TASTE_LINKS = [
  { label: "Saved events", icon: Heart },
  { label: "Interests", icon: Sparkles },
  { label: "Notifications", icon: Bell },
] as const;

/** Who Sponsa thinks you are, and the switches that shape the picks. */
export function ProfileView() {
  return (
    <main className="space-y-8 pt-5">
      <section className="px-5">
        <div className="surface-card flex items-center gap-4 p-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
            <User className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[18px] font-bold leading-tight tracking-[-0.01em] text-foreground">
              Eduard
            </p>
            <p className="mt-1 truncate text-[13px] leading-4 text-muted-foreground">
              Vilnius · 12 picks liked
            </p>
          </div>
        </div>
      </section>

      <section className="px-5">
        <h2 className="eyebrow mb-3">Your taste</h2>
        <div className="surface-card divide-y divide-hairline">
          {TASTE_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex min-h-[56px] w-full items-center gap-3.5 px-5 text-left"
            >
              <Icon className="size-[18px] shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">
                {label}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
