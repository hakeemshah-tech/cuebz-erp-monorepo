"use client";

import { useEffect, useState } from "react";

export interface WindowScroll {
  x: number;
  y: number;
}

/**
 * Track window scroll offset, sampled on animation frames so a fast scroll
 * cannot queue more state updates than the browser can paint.
 */
export function useWindowScroll(): WindowScroll {
  const [scroll, setScroll] = useState<WindowScroll>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScroll({ x: window.scrollX, y: window.scrollY });
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return scroll;
}

export default useWindowScroll;
