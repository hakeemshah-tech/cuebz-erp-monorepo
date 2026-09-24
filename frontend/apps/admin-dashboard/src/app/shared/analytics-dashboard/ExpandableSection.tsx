"use client";

import { useState } from "react";
import { Title } from "rizzui";
import { PiCaretDownBold, PiCaretRightBold } from "react-icons/pi";

export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-950">
      <button
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Title as="h4" className="text-lg font-semibold">
          {title}
        </Title>
        {isOpen ? (
          <PiCaretDownBold className="w-5 h-5" />
        ) : (
          <PiCaretRightBold className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 bg-white dark:bg-gray-950">{children}</div>
      )}
    </div>
  );
}
