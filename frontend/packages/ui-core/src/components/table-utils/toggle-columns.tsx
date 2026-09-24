"use client";

import React from "react";
import type { Table } from "@tanstack/react-table";
import { ActionIcon, Checkbox, Popover, Title } from "rizzui";

export interface ToggleColumnsProps<TData> {
  table: Table<TData>;
  /** Column ids that must always stay visible (e.g. the row action column). */
  pinned?: string[];
}

function columnLabel(column: any): string {
  const header = column.columnDef?.header;
  if (typeof header === "string" && header.length) return header;
  return String(column.id)
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Popover of checkboxes controlling per-column visibility on a table instance.
 */
export default function ToggleColumns<TData extends Record<string, any>>({
  table,
  pinned = [],
}: ToggleColumnsProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide() && !pinned.includes(column.id));

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger>
        <ActionIcon variant="outline" title="Toggle columns">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16M15 4v16" />
          </svg>
        </ActionIcon>
      </Popover.Trigger>

      <Popover.Content className="z-50 w-56 p-3">
        <Title as="h6" className="mb-2 text-sm font-semibold">
          Visible columns
        </Title>

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {columns.map((column) => (
            <Checkbox
              key={column.id}
              size="sm"
              label={columnLabel(column)}
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
          ))}
          {columns.length === 0 && (
            <p className="text-sm text-gray-500">No hideable columns.</p>
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}
