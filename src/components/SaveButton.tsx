import { Heart } from "lucide-react";

import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** The one way to keep an event. Stops the parent link from opening. */
export function SaveButton({ id, className }: { id: string; className?: string }) {
  const { isSaved, toggleSaved } = usePreferences();
  const saved = isSaved(id);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save event"}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSaved(id);
      }}
      className={cn(
        "icon-button size-9 text-muted-foreground active:bg-surface-2",
        saved && "text-rausch",
        className,
      )}
    >
      <Heart className={cn("size-[18px]", saved && "fill-current")} strokeWidth={2} />
    </button>
  );
}
