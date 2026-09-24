"use client";

import React from "react";
import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import cn from "../../utils/class-names";

export type TableVariant = "classic" | "modern" | "minimal" | "elegant";

export interface TableClassNames {
  container?: string;
  rowClassName?: string;
  cellClassName?: string;
  headerCellClassName?: string;
}

export interface TableProps<TData> {
  table: TanStackTable<TData>;
  variant?: TableVariant;
  className?: string;
  classNames?: TableClassNames;
  emptyContent?: React.ReactNode;
  /** Rendered instead of rows while a fetch is in flight. */
  isLoading?: boolean;
}

const variantStyles: Record<
  TableVariant,
  { head: string; headCell: string; row: string; cell: string }
> = {
  classic: {
    head: "bg-gray-100 dark:bg-gray-800",
    headCell: "border-b border-gray-200 dark:border-gray-700",
    row: "border-b border-gray-100 dark:border-gray-800",
    cell: "",
  },
  modern: {
    head: "bg-gray-50 dark:bg-gray-800/60",
    headCell:
      "border-b border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300",
    row: "border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40",
    cell: "",
  },
  minimal: {
    head: "",
    headCell: "border-b border-gray-200 dark:border-gray-700",
    row: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40",
    cell: "",
  },
  elegant: {
    head: "bg-gray-50 dark:bg-gray-800/60",
    headCell:
      "border-y border-gray-200 uppercase tracking-wide text-[11px] dark:border-gray-700",
    row: "border-b border-gray-100 dark:border-gray-800",
    cell: "",
  },
};

/**
 * Presentational shell around a TanStack table instance. All state lives in the
 * instance supplied by `useTanStackTable`; this component only renders it.
 */
export default function Table<TData extends Record<string, any>>({
  table,
  variant = "modern",
  className,
  classNames,
  emptyContent = "No records found.",
  isLoading = false,
}: TableProps<TData>) {
  const styles = variantStyles[variant] ?? variantStyles.modern;
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
        className,
        classNames?.container
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className={styles.head}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() || undefined }}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 font-semibold",
                      styles.headCell,
                      canSort && "cursor-pointer select-none",
                      classNames?.headerCellClassName
                    )}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <span className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sorted === "asc" && <span aria-hidden>↑</span>}
                        {sorted === "desc" && <span aria-hidden>↓</span>}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-4 py-10 text-center text-gray-500"
              >
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary align-middle" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-4 py-10 text-center text-gray-500"
              >
                {emptyContent}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  styles.row,
                  row.getIsSelected() && "bg-primary-lighter/40",
                  classNames?.rowClassName
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-3 align-middle",
                      styles.cell,
                      classNames?.cellClassName
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
