"use client";

import React, { useState, useEffect, useCallback } from "react";
import invoiceService from "@/services/invoiceService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { InvoiceType } from "@/types/invoiceTypes";
import InvoiceDetailsDrawer from "./InvoiceDetailsDrawer";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { routesTenant } from "@/config/routes";

export default function InvoiceTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    status: "",
    quotation_id: "",
    dateFrom: "",
    dateTo: "",
  });

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | {}>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: filters.status || undefined,
        quotation_id: filters.quotation_id || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.globalSearch || undefined,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching invoices:", error.message);
      toast.error("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchInvoices = useCallback(debounce(fetchInvoices, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchInvoices();
    return () => debouncedFetchInvoices.cancel();
  }, [debouncedFetchInvoices]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchInvoices();
  };

  const { table } = useTanStackTable<InvoiceType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "invoice_number",
        header: "Invoice Number",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedInvoice(row.original);
              setDrawerOpen(true);
            }}
          >
            {row.original.invoice_number}
          </button>
        ),
      },
      {
        accessorKey: "quotation_id",
        header: "Quotation ID",
        cell: ({ row }: any) =>
          row.original.quotation_id?.proposal_number || "N/A",
      },
      {
        accessorKey: "invoice_date",
        header: "Invoice Date",
        cell: ({ row }: any) =>
          dayjs(row.original.invoice_date).isValid()
            ? dayjs(row.original.invoice_date).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }: any) =>
          dayjs(row.original.due_date).isValid()
            ? dayjs(row.original.due_date).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => {
          const status = row.original.status;
          const badgeColor =
            status === "Unpaid"
              ? "bg-gray-300 text-gray-700"
              : status === "Paid"
                ? "bg-green-100 text-green-800"
                : status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800";

          return (
            <Badge className={`capitalize px-2 py-1 rounded ${badgeColor}`}>
              {status}
            </Badge>
          );
        },
      },
    ],
  });

  const handlePageChange = (pageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
  };

  return (
    <div className="shadow-md">
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        refreshData={fetchInvoices}
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
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
}
