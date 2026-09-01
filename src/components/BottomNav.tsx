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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-glass pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("size-5", isActive && "text-brand")} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
