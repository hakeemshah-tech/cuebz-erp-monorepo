import React from "react";

export default function TruckSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M2.5 6.5h10v9h-10a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Zm10 3h4l3 3.2v2.8h-7v-6Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="7" cy="17.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17.5" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
