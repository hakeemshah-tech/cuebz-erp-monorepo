"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableOptions,
  type VisibilityState,
} from "@tanstack/react-table";

/**
 * Most list screens in this app paginate on the server: they fetch one page and
 * hand those rows straight to the table. A conventional client-side page size
 * would silently truncate such a page, so the row model defaults to showing
 * everything it is given. Widgets that genuinely want client-side paging opt in
 * by passing `options.initialState.pagination.pageSize`.
 */
const SHOW_ALL_ROWS = 100_000;

export interface UseTanStackTableProps<TData> {
  tableData: TData[];
  columnConfig: ColumnDef<TData, any>[];
  options?: Partial<TableOptions<TData>>;
}

export interface UseTanStackTableReturn<TData> {
  table: Table<TData>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function useTanStackTable<TData extends Record<string, any>>({
  tableData,
  columnConfig,
  options,
}: UseTanStackTableProps<TData>): UseTanStackTableReturn<TData> {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Referentially stable across renders so the table does not reset state when
  // a parent re-renders with an equivalent array literal.
  const data = useMemo(() => tableData ?? [], [tableData]);
  const columns = useMemo(() => columnConfig ?? [], [columnConfig]);

  const { initialState, ...restOptions } = options ?? {};

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      ...initialState,
      pagination: {
        pageIndex: 0,
        pageSize: SHOW_ALL_ROWS,
        ...(initialState?.pagination ?? {}),
      },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    ...restOptions,
  });

  return {
    table,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    globalFilter,
    setGlobalFilter,
  };
}

export default useTanStackTable;
