"use client";

import React from "react";
import cn from "../../utils/class-names";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<Record<string, any>>;
  label?: string | number;
  className?: string;
  prefix?: string;
  postfix?: string;
  formattedNumber?: boolean;
  /** Override the heading; defaults to the category label from the axis. */
  formatter?: (value: any, name: string) => React.ReactNode;
}

/**
 * Recharts tooltip content. Recharts injects `active`/`payload`/`label`, so
 * every prop is optional and the component renders nothing when inactive.
 */
export function CustomTooltip({
  active,
  payload,
  label,
  className,
  prefix = "",
  postfix = "",
  formattedNumber = false,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      {label !== undefined && (
        <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </p>
      )}

      <ul className="space-y-0.5">
        {payload.map((item, index) => {
          const value =
            formattedNumber && typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value;

          return (
            <li
              key={`${item.dataKey ?? item.name ?? index}`}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
            >
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? item.fill }}
                aria-hidden
              />
              <span className="capitalize">{item.name ?? item.dataKey}</span>
              <span className="ms-auto font-medium text-gray-900 dark:text-gray-100">
                {formatter
                  ? formatter(item.value, item.name)
                  : `${prefix}${value}${postfix}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CustomTooltip;
