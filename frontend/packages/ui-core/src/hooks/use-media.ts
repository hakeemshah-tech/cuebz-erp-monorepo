"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query.
 *
 * `defaultValue` is returned during SSR and the first client render, so the
 * server and client markup agree before the listener attaches.
 */
export function useMedia(query: string, defaultValue: boolean = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    // addListener is the Safari < 14 fallback.
    if (list.addEventListener) {
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    }
    list.addListener(onChange);
    return () => list.removeListener(onChange);
  }, [query]);

  return matches;
}

export default useMedia;
