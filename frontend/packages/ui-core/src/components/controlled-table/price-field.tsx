"use client";

import React from "react";
import { Input } from "rizzui";
import cn from "../../utils/class-names";

export type PriceBound = number | string | undefined;

/**
 * A two-element range. It is deliberately not a fixed-length tuple: TanStack
 * column filter values arrive loosely typed (often `string[]` straight from an
 * input), and every call site passes one through unchanged.
 */
export type PriceRange = PriceBound[];

export interface PriceFieldProps {
  value?: PriceRange;
  onChange: (value: PriceRange) => void;
  label?: string;
  className?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

/**
 * Min/max numeric range filter.
 *
 * An empty input maps to `undefined` rather than 0, so clearing one bound
 * removes that side of the filter instead of pinning it to zero.
 */
export default function PriceField({
  value = [undefined, undefined],
  onChange,
  label,
  className,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
}: PriceFieldProps) {
  const [min, max] = value;

  function parse(input: string): PriceBound {
    if (input.trim() === "") return undefined;
    const parsed = Number(input);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          placeholder={minPlaceholder}
          value={min ?? ""}
          onChange={(event) => onChange([parse(event.target.value), max])}
          className="w-full"
        />
        <span className="text-gray-400">–</span>
        <Input
          type="number"
          inputMode="decimal"
          placeholder={maxPlaceholder}
          value={max ?? ""}
          onChange={(event) => onChange([min, parse(event.target.value)])}
          className="w-full"
        />
      </div>
    </div>
  );
}
