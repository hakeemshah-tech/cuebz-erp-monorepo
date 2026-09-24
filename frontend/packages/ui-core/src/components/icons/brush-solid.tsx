import React from "react";

export default function BrushSolidIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 16.5c2.2 0 3.5 1.2 3.5 3.2 0 1.4-1.1 2.3-3 2.3-2.2 0-3.5-1.3-3.5-2 0-.5.4-.8.8-1.2.5-.5.7-1.1.7-1.8 0-.3.2-.5.5-.5Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M9 15.5 20.2 4.3a1.8 1.8 0 0 1 2.5 2.5L11.5 18l-2.5-2.5Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
