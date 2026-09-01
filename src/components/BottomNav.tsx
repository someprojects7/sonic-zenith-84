import { CalendarDays, Heart, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "search", label: "Search", icon: Search },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "you", label: "You", icon: User },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-glass backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium leading-none transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("size-[22px]", isActive && "text-brand")} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
