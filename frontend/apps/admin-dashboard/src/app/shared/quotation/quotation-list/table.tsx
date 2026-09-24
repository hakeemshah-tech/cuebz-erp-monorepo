"use client";

import React, { useState, useEffect, useCallback } from "react";
import quotationService from "@/services/quotationService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { QuotationType } from "@/types/quotationTypes";
import QuotationDetailsDrawer from "./QuotationDetailsDrawer";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { routesTenant } from "@/config/routes";

export default function QuotationTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState<QuotationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    status: "",
    customer_id: "",
    dateFrom: "",
    dateTo: "",
  });

  const [selectedQuotation, setSelectedQuotation] = useState({}) as any;
  const [detailsOpen, setDetailsOpen] = useState(false);

  const router = useRouter();

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await quotationService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: filters.status || undefined,
        customer_id: filters.customer_id || undefined,
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
      console.error("Error fetching quotations:", error.message);
      toast.error("Failed to fetch quotations.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchQuotations = useCallback(debounce(fetchQuotations, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchQuotations();
    return () => debouncedFetchQuotations.cancel();
  }, [debouncedFetchQuotations]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchQuotations();
  };

  const { table } = useTanStackTable<QuotationType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "proposal_number",
        header: "Proposal Number",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedQuotation(row.original);
              setDetailsOpen(true);
            }}
          >
            {row.original.proposal_number}
          </button>
        ),
      },
      {
        accessorKey: "proposal_title",
        header: "Proposal Title",
        cell: ({ row }: any) => row.original.proposal_title || "N/A",
      },
      {
        accessorKey: "customer_id",
        header: "Customer",
        cell: ({ row }: any) => row.original.customer_id?.full_name || "N/A",
      },
      {
        accessorKey: "proposal_date",
        header: "Proposal Date",
        cell: ({ row }: any) =>
          dayjs(row.original.proposal_date).isValid()
            ? dayjs(row.original.proposal_date).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }: any) =>
          `AED ${row.original.total_amount.toFixed(2)}` || "N/A",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => {
          const status = row.original.status;
          const badgeColor =
            status === "Draft"
              ? "bg-gray-300 text-gray-700"
              : status === "Sent"
                ? "bg-blue-100 text-blue-800"
                : status === "Accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800";

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
      <QuotationDetailsDrawer
        quotation={selectedQuotation}
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

{
  /* Send Quotation Action */
}
{
  /* <Tooltip
              size="sm"
              content="Send Quotation"
              placement="top"
              color="invert"
            >
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label="Send Quotation"
                onClick={async () => {
                  try {
                    toast.loading("Sending quotation...");
                    await quotationService.sendQuotation(row.original._id);
                    toast.dismiss();
                    toast.success("Quotation sent successfully.");
                    fetchQuotations();
                  } catch (error) {
                    toast.dismiss();
                    toast.error("Failed to send quotation.");
                  }
                }}
              >
                <FiSend />
              </ActionIcon>
            </Tooltip> */
}
