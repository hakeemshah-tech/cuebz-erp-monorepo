import React from "react";

/** Curved pointer used to draw attention to an adjacent element. */
export default function ArrowShape(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 4c18 2 32 12 40 28"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M34 30l8 3 2-8.5"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
