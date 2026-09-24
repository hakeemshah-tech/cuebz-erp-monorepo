"use client";

import React from "react";
import { Text, Title } from "rizzui";
import cn from "../../utils/class-names";

export interface MetricCardProps {
  title: React.ReactNode;
  metric: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  info?: React.ReactNode;
  chart?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  metricClassName?: string;
  contentClassName?: string;
  rounded?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
} as const;

/** Single KPI tile: an icon, a label, the value, and optional trend content. */
export default function MetricCard({
  title,
  metric,
  icon,
  iconClassName,
  info,
  chart,
  className,
  titleClassName,
  metricClassName,
  contentClassName,
  rounded = "md",
  children,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900",
        roundedStyles[rounded],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <div className={cn("min-w-0 flex-1", contentClassName)}>
        <Text
          className={cn(
            "truncate text-sm text-gray-500 dark:text-gray-400",
            titleClassName
          )}
        >
          {title}
        </Text>
        <Title
          as="h4"
          className={cn("mt-1 text-xl font-semibold", metricClassName)}
        >
          {metric}
        </Title>
        {info}
        {children}
      </div>

      {chart && <div className="h-12 w-20 shrink-0">{chart}</div>}
    </div>
  );
}
