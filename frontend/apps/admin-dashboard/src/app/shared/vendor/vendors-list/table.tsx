"use client";

import React, { useState, useEffect, useCallback } from "react";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { VendorType } from "@/types/vendorTypes";
import vendorService from "@/services/vendorService";
import VendorDetailsDrawer from "./VendorDetailsDrawer";
import { Badge } from "rizzui";

export default function VendorsTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({ globalSearch: "" });

  const [selectedVendor, setSelectedVendor] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditOpen, setDrawerEditOpen] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await vendorService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.globalSearch || undefined,
      });
      setData(response?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: response?.pagination?.total || 0,
      }));
    } catch (error: any) {
      toast.error("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchVendors, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchVendors();
  };

  const { table } = useTanStackTable<VendorType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "vendor_name",
        header: "Company Name",
        cell: ({ row }: any) => (
          <button
            onClick={() => {
              setSelectedVendor(row.original);
              setDrawerOpen(true);
            }}
            className="text-primary"
          >
            {row.original.vendor_name}
          </button>
        ),
      },
      {
        accessorKey: "contact_person",
        header: "Contact Person",
        cell: ({ row }: any) => row.original.contact_person || "N/A",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }: any) => row.original.email || "N/A",
      },
      {
        accessorKey: "phone_number",
        header: "Phone Number",
        cell: ({ row }: any) => row.original.phone_number || "N/A",
      },
      {
        accessorKey: "vendor_type",
        header: "Vendor Type",
        cell: ({ row }: any) => (
          <Badge color="primary">{row.original.vendor_type || "N/A"}</Badge>
        ),
      },
    ],
  });

  return (
    <div className="shadow-md">
      <VendorDetailsDrawer
        vendor={selectedVendor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
        <div className="flex justify-center items-center py-10">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <Table table={table} variant="modern" />
          {!hidePagination && (
            <TablePagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
              onPageChange={(index) =>
                setPagination({ ...pagination, pageIndex: index })
              }
              onPageSizeChange={(size) =>
                setPagination({
                  pageSize: size,
                  pageIndex: 0,
                  totalCount: pagination.totalCount,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
