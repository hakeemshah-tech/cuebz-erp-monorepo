"use client";

import React, { useState } from "react";
import cn from "../../utils/class-names";

export interface ButtonGroupOption {
  label: string;
  value: string;
}

/** Call sites pass either plain labels or explicit label/value pairs. */
export type ButtonGroupOptionInput = string | ButtonGroupOption;

export interface ButtonGroupActionProps {
  options: ButtonGroupOptionInput[];
  defaultActive?: string;
  onChange?: (value: string) => void;
  className?: string;
  activeClassName?: string;
  buttonClassName?: string;
}

/**
 * Segmented control used above charts to switch the reporting period.
 *
 * Uncontrolled: it owns the active value and reports changes through
 * `onChange`, which is how every call site in the dashboard uses it.
 */
function normalize(option: ButtonGroupOptionInput): ButtonGroupOption {
  return typeof option === "string" ? { label: option, value: option } : option;
}

export default function ButtonGroupAction({
  options,
  defaultActive,
  onChange,
  className,
  activeClassName,
  buttonClassName,
}: ButtonGroupActionProps) {
  const items = options.map(normalize);
  const [active, setActive] = useState(
    defaultActive ?? items[0]?.value ?? ""
  );

  function handleSelect(value: string) {
    setActive(value);
    onChange?.(value);
  }

  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800",
        className
      )}
    >
      {items.map((option) => {
        const isActive = option.value === active;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? cn(
                    "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-50",
                    activeClassName
                  )
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100",
              buttonClassName
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
