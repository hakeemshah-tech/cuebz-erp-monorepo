"use client";

import React from "react";
import cn from "../utils/class-names";

export interface SocialItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface SocialItemsProps {
  items?: SocialItem[];
  className?: string;
  iconClassName?: string;
}

const defaultItems: SocialItem[] = [
  {
    name: "Website",
    href: "https://www.example.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
      </svg>
    ),
  },
  {
    name: "Support",
    href: "mailto:info@example.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    ),
  },
];

/** Row of outbound links rendered on the error and empty-state pages. */
export default function SocialItems({
  items = defaultItems,
  className,
  iconClassName,
}: SocialItemsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          aria-label={item.name}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary dark:border-gray-700"
        >
          <span className={cn("h-4 w-4", iconClassName)}>{item.icon}</span>
        </a>
      ))}
    </div>
  );
}
