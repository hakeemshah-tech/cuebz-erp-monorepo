"use client";

import React from "react";
import { Badge } from "rizzui";

export interface StatusBadgeProps {
  status?: string | number | null;
  className?: string;
}

type BadgeColor = "success" | "danger" | "warning" | "info" | "primary";

/**
 * Map a free-text status from the API onto a badge colour. Domain statuses vary
 * per module (leads, invoices, subscriptions), so matching is done on
 * normalised substrings rather than an exhaustive enum.
 */
const COLOR_RULES: Array<{ match: RegExp; color: BadgeColor }> = [
  { match: /(active|paid|approved|completed|success|verified|won|open)/, color: "success" },
  { match: /(expired|cancel|reject|fail|overdue|inactive|lost|blocked)/, color: "danger" },
  { match: /(pending|await|progress|partial|draft|hold|review)/, color: "warning" },
  { match: /(new|sent|scheduled|info)/, color: "info" },
];

function resolveColor(status: string): BadgeColor {
  const normalised = status.toLowerCase();
  return COLOR_RULES.find((rule) => rule.match.test(normalised))?.color ?? "primary";
}

function toLabel(status: string): string {
  return status
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === null || status === undefined || status === "") return null;

  const asText = String(status);

  return (
    <Badge color={resolveColor(asText)} variant="flat" className={className}>
      {toLabel(asText)}
    </Badge>
  );
}
