import React from "react";

export default function FileStackIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 2.5h6l4 4v11a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 17.5v-13A1.5 1.5 0 0 1 8 2.5Z" />
      <path d="M14 2.5v4h4" />
      <path d="M4 6.5v13A1.5 1.5 0 0 0 5.5 21H15" opacity="0.5" />
    </svg>
  );
}
