import React from "react";

/** Decorative foliage silhouette for the split auth layout. */
export default function TreeShape(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 120" fill="none" aria-hidden="true" {...props}>
      <path d="M40 120V64" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
      <path
        d="M40 4 66 46H14L40 4Zm0 26 20 32H20l20-32Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M40 78 24 62M40 92l18-18" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
