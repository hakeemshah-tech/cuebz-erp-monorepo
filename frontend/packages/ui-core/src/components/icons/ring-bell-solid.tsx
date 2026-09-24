import React from "react";

export default function RingBellSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5v3.4L5 15.5h14l-1.5-4.1V8A5.5 5.5 0 0 0 12 2.5Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}
