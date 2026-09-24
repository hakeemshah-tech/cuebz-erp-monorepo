"use client";

import React from "react";

export interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string | number };
  prefix?: string;
  postfix?: string;
  /** Abbreviate thousands/millions (1200 -> 1.2k). */
  abbreviate?: boolean;
  className?: string;
}

function abbreviateNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

/**
 * Y-axis tick renderer for Recharts. Recharts clones this element and supplies
 * `x`, `y` and `payload`, so it is used as `tick={<CustomYAxisTick />}`.
 */
export function CustomYAxisTick({
  x = 0,
  y = 0,
  payload,
  prefix = "",
  postfix = "",
  abbreviate = true,
  className,
}: CustomYAxisTickProps) {
  const raw = payload?.value ?? "";
  const text =
    abbreviate && typeof raw === "number" ? abbreviateNumber(raw) : String(raw);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        className={className}
        fill="currentColor"
        fontSize={12}
        opacity={0.7}
      >
        {`${prefix}${text}${postfix}`}
      </text>
    </g>
  );
}

export default CustomYAxisTick;
