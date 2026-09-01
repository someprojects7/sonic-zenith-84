import { useEffect, useRef, useState } from "react";

/**
 * True while the user scrolls down, false again near the top or on a clear
 * scroll up. Used to collapse the decorative header while the tabs stay put.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 12) setHidden(false);
      else if (y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 24) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
