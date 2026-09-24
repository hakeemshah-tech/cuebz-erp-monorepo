"use client";

import React from "react";
import { Button, Select } from "rizzui";
import cn from "../../utils/class-names";

export interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

/**
 * Server-side pagination control. It is driven entirely by props: the parent
 * owns `pageIndex`/`pageSize` and refetches when they change.
 *
 * `pageIndex` is zero-based on the wire and rendered one-based for the user.
 */
export default function TablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
}: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));
  const currentPage = Math.min(pageIndex, pageCount - 1);

  const firstRow = totalCount === 0 ? 0 : currentPage * pageSize + 1;
  const lastRow = Math.min((currentPage + 1) * pageSize, totalCount);

  const canPrev = currentPage > 0;
  const canNext = currentPage < pageCount - 1;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="whitespace-nowrap">Rows per page</span>
        <Select
          size="sm"
          className="w-[84px]"
          value={pageSize}
          options={pageSizeOptions.map((value) => ({
            label: String(value),
            value,
          }))}
          onChange={(option: any) =>
            onPageSizeChange(Number(option?.value ?? option))
          }
          getOptionValue={(option: any) => option.value}
          displayValue={(value: any) => String(value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="whitespace-nowrap text-sm text-gray-500">
          {firstRow}–{lastRow} of {totalCount}
        </span>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            aria-label="First page"
            disabled={!canPrev}
            onClick={() => onPageChange(0)}
          >
            «
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label="Previous page"
            disabled={!canPrev}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ‹
          </Button>
          <span className="px-2 text-sm text-gray-600 dark:text-gray-300">
            {currentPage + 1} / {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            aria-label="Next page"
            disabled={!canNext}
            onClick={() => onPageChange(currentPage + 1)}
          >
            ›
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label="Last page"
            disabled={!canNext}
            onClick={() => onPageChange(pageCount - 1)}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
