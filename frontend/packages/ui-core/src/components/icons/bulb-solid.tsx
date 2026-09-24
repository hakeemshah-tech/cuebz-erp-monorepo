import React from "react";

export default function BulbSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M12 2a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.6v.6h6v-.6c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M9.5 19h5M10 21.5h4" />
    </svg>
  );
}
