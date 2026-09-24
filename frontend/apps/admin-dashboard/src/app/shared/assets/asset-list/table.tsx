"use client";

import React, { useState, useEffect, useCallback } from "react";
import assetService from "@/services/assetManagementService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { category } from "@/types/assetTypes";
import AssetDetailsDrawer from "./assetDetailsDrawer";
import { FiEdit, FiEye } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AssetTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState<category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    category: "",
    status: "",
    purchaseDate: "",
    warrantyExpiry: "",
  });

  const [selectedAsset, setSelectedAsset] = useState<category | {}>({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const statusColors: Record<string, string> = {
    "In Use": "bg-green-500 text-white",
    "In Storage": "bg-yellow-500 text-white",
    "Under Maintenance": "bg-blue-500 text-white",
    Retired: "bg-red-500 text-white",
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await assetService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.globalSearch || undefined,
        category: filters.category || undefined,
        status: filters.status || undefined,
        purchaseDate: filters.purchaseDate || undefined,
        warrantyExpiry: filters.warrantyExpiry || undefined,
      });
      setData(response?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: response?.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to fetch assets.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchAssets = useCallback(debounce(fetchAssets, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchAssets();
    return () => debouncedFetchAssets.cancel();
  }, [debouncedFetchAssets]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchAssets();
  };

  const { table } = useTanStackTable<category>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "name",
        header: "Asset Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary hover:underline"
            onClick={() => {
              setSelectedAsset(row.original);
              setDetailsOpen(true);
            }}
          >
            {row.original.name || "N/A"}
          </button>
        ),
      },
      { accessorKey: "category", header: "Asset Type" },
      {
        accessorKey: "purchaseDate",
        header: "Purchase Date",
        cell: ({ row }: any) =>
          row.original.purchaseDate
            ? dayjs(row.original.purchaseDate).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "warrantyExpiry",
        header: "Warranty Expiry",
        cell: ({ row }: any) =>
          row.original.warrantyExpiry
            ? dayjs(row.original.warrantyExpiry).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => (
          <Badge
            className={`px-2 py-1 rounded ${statusColors[row.original.status] || "bg-gray-500 text-white"}`}
          >
            {row.original.status || "N/A"}
          </Badge>
        ),
      },
    ],
  });

  const handlePageChange = (pageIndex: number) =>
    setPagination((prev) => ({ ...prev, pageIndex }));

  const handlePageSizeChange = (pageSize: number) =>
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));

  return (
    <div className="shadow-md">
      <AssetDetailsDrawer
        asset={selectedAsset}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      {!hideFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          table={table}
        />
      )}

      {loading ? (
        <div className="text-center py-6 text-sm text-gray-600">
          Loading assets...
        </div>
      ) : (
        <>
          <Table table={table} variant="modern" />
          {!hidePagination && (
            <TablePagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
}
