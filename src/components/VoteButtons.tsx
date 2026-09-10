import { ThumbsDown, ThumbsUp } from "lucide-react";

import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/** Thumbs up/down for one recommendation. Shared by the feed card and the event page. */
export function VoteButtons({ id }: { id: string }) {
  const { vote, setVote } = usePreferences();
  const current = vote(id);

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <VoteButton
        label="Good pick"
        icon={ThumbsUp}
        active={current === "up"}
        onClick={() => setVote(id, current === "up" ? null : "up")}
      />
      <VoteButton
        label="Not for me"
        icon={ThumbsDown}
        active={current === "down"}
        onClick={() => setVote(id, current === "down" ? null : "down")}
      />
    </div>
  );
}

/** The label shown next to the buttons, so both places read the same. */
export function voteLabel(state: "up" | "down" | null, match: number) {
  if (state === "up") return "More like this";
  if (state === "down") return "Fewer like this";
  return `${match}% match`;
}

function VoteButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof ThumbsUp;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-full transition-colors",
        active ? "bg-brand text-brand-foreground" : "text-muted-foreground active:bg-surface-2",
      )}
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  );
}
