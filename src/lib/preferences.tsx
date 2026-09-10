import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Everything the person has told us about themselves: the interests that shape
 * the picks, and the events they kept. Stored locally so a first-time visitor
 * never has to sign up before the app becomes useful.
 */
type Preferences = {
  interests: string[];
  saved: string[];
  toggleInterest: (category: string) => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const KEY = "sponsa.preferences";

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  // Read after mount: touching localStorage during render breaks hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Pick<Preferences, "interests" | "saved">>;
      if (Array.isArray(parsed.interests)) setInterests(parsed.interests);
      if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
    } catch {
      // A corrupted value just means we start from a clean slate.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ interests, saved }));
    } catch {
      // Private browsing can refuse writes; the session still works.
    }
  }, [interests, saved]);

  const value = useMemo<Preferences>(() => {
    const toggle = (list: string[], item: string) =>
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

    return {
      interests,
      saved,
      toggleInterest: (category) => setInterests((list) => toggle(list, category)),
      toggleSaved: (id) => setSaved((list) => toggle(list, id)),
      isSaved: (id) => saved.includes(id),
    };
  }, [interests, saved]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
