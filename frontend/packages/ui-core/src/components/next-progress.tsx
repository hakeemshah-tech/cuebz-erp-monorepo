"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface NextProgressProps {
  color?: string;
  height?: number;
}

/**
 * Thin route-change progress bar.
 *
 * App Router gives no navigation-start event, so the bar is driven off the
 * pathname changing: it animates in, then completes and unmounts.
 *
 * Deliberately does not read `useSearchParams()`. This component mounts in the
 * root layout, and that hook opts every page into client-side rendering unless
 * it sits inside a Suspense boundary, which would break prerendering for the
 * whole app just to animate on query-only navigations.
 */
export default function NextProgress({
  color = "#0070F3",
  height = 3,
}: NextProgressProps) {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    const climb = window.setTimeout(() => setProgress(70), 80);
    const finish = window.setTimeout(() => setProgress(100), 220);
    const hide = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 520);

    return () => {
      window.clearTimeout(climb);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999]"
      style={{ height }}
    >
      <div
        className="h-full transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  );
}
