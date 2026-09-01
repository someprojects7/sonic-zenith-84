import { CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "you", label: "Profile", icon: User },
] as const;

/**
 * Two destinations only, so a full-width tab bar would look empty.
 * Instead: a floating capsule dock, centered, sized to its content —
 * reads intentional rather than half-filled.
 */
export function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-glass p-1.5 shadow-elevated ring-1 ring-hairline backdrop-blur-xl">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold leading-none transition-colors",
                isActive
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className={cn("size-[19px] shrink-0", isActive && "text-brand")} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
