"use client";

import React from "react";
import cn from "../../utils/class-names";

export interface CircleProgressBarProps {
  percentage: number;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  progressColor?: string;
  strokeClassName?: string;
  progressClassName?: string;
  className?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  /** Scale to the parent box instead of a fixed pixel size. */
  useParentResponsive?: boolean;
}

/**
 * Radial progress indicator drawn with a stroke-dashoffset arc.
 *
 * The circle is rotated -90deg so the arc starts at twelve o'clock.
 */
export default function CircleProgressBar({
  percentage,
  size = 120,
  stroke = "#e5e7eb",
  strokeWidth = 8,
  progressColor = "#0070F3",
  strokeClassName,
  progressClassName,
  className,
  label,
  labelClassName,
  useParentResponsive = false,
}: CircleProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Number(percentage) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={useParentResponsive ? { width: "100%" } : { width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={useParentResponsive ? "100%" : size}
        height={useParentResponsive ? "100%" : size}
        className="-rotate-90"
        role="img"
        aria-label={`${clamped}%`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={strokeClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-500", progressClassName)}
        />
      </svg>

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-sm font-semibold",
          labelClassName
        )}
      >
        {label ?? `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
