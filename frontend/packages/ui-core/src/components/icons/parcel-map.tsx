import React from "react";

export default function ParcelMapIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 21.5s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 16.1 12 21.5 12 21.5Z" />
      <path d="M9.5 9.2 12 8l2.5 1.2v3L12 13.5 9.5 12.2v-3Z" />
    </svg>
  );
}
