"use client";

import React from "react";
import { Text, Title } from "rizzui";
import cn from "../../utils/class-names";

export interface TransactionType {
  title: string;
  amount: string | number;
  increased?: boolean;
  percentage?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  iconWrapperFill?: string;
}

export interface TransactionCardProps {
  transaction: TransactionType;
  className?: string;
}

/**
 * Summary tile for a financial figure with an optional period-over-period
 * delta. `increased` drives the arrow direction and colour independently of the
 * percentage value, because the API may report "N/A" when there is no baseline.
 */
export default function TransactionCard({
  transaction,
  className,
}: TransactionCardProps) {
  const { title, amount, increased, percentage, icon: Icon, iconWrapperFill } =
    transaction;

  const hasDelta =
    percentage !== undefined &&
    percentage !== null &&
    String(percentage).toLowerCase() !== "n/a";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      {Icon && (
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: iconWrapperFill ?? "#0070F3" }}
        >
          <Icon className="h-6 w-6" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <Text className="truncate text-sm text-gray-500 dark:text-gray-400">
          {title}
        </Text>
        <Title as="h4" className="mt-1 text-xl font-semibold">
          {amount}
        </Title>

        {hasDelta && (
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-xs font-medium",
              increased ? "text-green-600" : "text-red-600"
            )}
          >
            <span aria-hidden>{increased ? "▲" : "▼"}</span>
            {percentage}
          </span>
        )}
      </div>
    </div>
  );
}
