"use client";

import { useEffect, useState } from "react";

/**
 * Returns false on the server and on the first client render, true afterwards.
 * Gate browser-only UI on this to avoid hydration mismatches.
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

export default useIsMounted;
