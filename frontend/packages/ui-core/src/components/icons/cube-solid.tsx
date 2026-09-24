import React from "react";

export default function CubeSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="m12 2.5 8.5 4.6v9.8L12 21.5 3.5 16.9V7.1L12 2.5Z"
        fill="currentColor"
        stroke="none"
        opacity="0.9"
      />
      <path d="m3.5 7.1 8.5 4.6 8.5-4.6M12 11.7v9.8" stroke="#fff" strokeOpacity="0.45" />
    </svg>
  );
}
