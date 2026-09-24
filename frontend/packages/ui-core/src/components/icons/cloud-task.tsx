import React from "react";

export default function CloudTaskIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7 17.5a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9.2a3.7 3.7 0 0 1 .6 7.3" />
      <path d="m9.5 15.5 2 2 4-4.5" />
    </svg>
  );
}
