import React from "react";

/** Hand-drawn style underline used to accent a heading word. */
export default function UnderlineShape(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 168 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 8.5c26-3.5 52-5.2 78-5.2s52 1.7 78 5.2"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}
