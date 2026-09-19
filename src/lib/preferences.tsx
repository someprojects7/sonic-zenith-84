import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Vote = "up" | "down";

/**
 * Everything the person has told us about themselves: the interests that shape
 * the picks, the events they kept, how they rated a pick, and which events they
 * already looked at. Stored locally so a first-time visitor never has to sign up
 * before the app becomes useful.
 */
type Preferences = {
  interests: string[];
  saved: string[];
  toggleInterest: (category: string) => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  vote: (id: string) => Vote | null;
  setVote: (id: string, value: Vote | null) => void;
  isSeen: (id: string) => boolean;
  markSeen: (id: string) => void;
  /** The interest block on the Picks tab is dismissible; editing lives in the profile. */
  interestsDismissed: boolean;
  dismissInterests: () => void;
  /** The first-run walkthrough runs once; null while we still read storage. */
  tourDone: boolean | null;
  finishTour: () => void;
};

type Stored = {
  interests: string[];
  saved: string[];
  votes: Record<string, Vote>;
  seen: string[];
  interestsDismissed: boolean;
  tourDone: boolean;
};

const KEY = "sponsa.preferences";

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [seen, setSeen] = useState<string[]>([]);
  const [interestsDismissed, setInterestsDismissed] = useState(false);

  // Read after mount: touching localStorage during render breaks hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Stored>;
      if (Array.isArray(parsed.interests)) setInterests(parsed.interests);
      if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
      if (Array.isArray(parsed.seen)) setSeen(parsed.seen);
      if (parsed.votes && typeof parsed.votes === "object") setVotes(parsed.votes);
      if (parsed.interestsDismissed === true) setInterestsDismissed(true);
    } catch {
      // A corrupted value just means we start from a clean slate.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ interests, saved, votes, seen, interestsDismissed }),
      );
    } catch {
      // Private browsing can refuse writes; the session still works.
    }
  }, [interests, saved, votes, seen, interestsDismissed]);

  const markSeen = useCallback((id: string) => {
    setSeen((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const value = useMemo<Preferences>(() => {
    const toggle = (list: string[], item: string) =>
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

    return {
      interests,
      saved,
      toggleInterest: (category) => setInterests((list) => toggle(list, category)),
      toggleSaved: (id) => setSaved((list) => toggle(list, id)),
      isSaved: (id) => saved.includes(id),
      vote: (id) => votes[id] ?? null,
      setVote: (id, next) =>
        setVotes((current) => {
          const { [id]: _dropped, ...rest } = current;
          return next ? { ...rest, [id]: next } : rest;
        }),
      isSeen: (id) => seen.includes(id),
      markSeen,
      interestsDismissed,
      dismissInterests: () => setInterestsDismissed(true),
    };
  }, [interests, saved, votes, seen, markSeen, interestsDismissed]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
