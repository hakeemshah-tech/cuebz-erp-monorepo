"use client";

import React, { useState, useEffect, useCallback } from "react";
import leadService from "@/services/leadService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { Badge } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { LeadType } from "@/types/leadTypes";
import LeadDetailsDrawer from "./LeadDetailsDrawer";

export default function LeadTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    leadStatus: "",
    assignedTo: "",
    leadSource: "",
    date: "",
  });

  const [selectedLead, setSelectedLead] = useState({}) as any;
  const [detailsOpen, setDetailsOpen] = useState(false);

  const leadStatusColors: any = {
    New: "bg-blue-500 text-white",
    Contacted: "bg-yellow-500 text-white",
    Qualified: "bg-green-500 text-white",
    "Proposal Sent": "bg-indigo-500 text-white",
    Won: "bg-teal-500 text-white",
    Lost: "bg-red-500 text-white",
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        date: filters.date || undefined,
        search: filters.globalSearch || undefined,
        lead_status: filters.leadStatus || undefined,
        assigned_to: filters.assignedTo || undefined,
        lead_source: filters.leadSource || undefined,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching leads:", error.message);
      toast.error("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchLeads = useCallback(debounce(fetchLeads, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchLeads();
    return () => debouncedFetchLeads.cancel();
  }, [debouncedFetchLeads]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchLeads();
  };

  const { table } = useTanStackTable<LeadType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "lead_identifier_name",
        header: "Indentifier Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedLead(row.original);
              setDetailsOpen(true);
            }}
          >
            {row.original.lead_identifier_name}
          </button>
        ),
      },
      { accessorKey: "lead_source", header: "Lead Source" },
      { accessorKey: "company_name", header: "Company Name" },
      { accessorKey: "contact_person", header: "Contact Person" },
      { accessorKey: "contact_number", header: "Contact Number" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "lead_status",
        header: "Lead Status",
        cell: ({ row }: any) => {
          const status = row.original.lead_status;
          const badgeColor =
            leadStatusColors[status] || "bg-gray-500 text-white";
          return (
            <Badge className={`px-2 py-1 rounded ${badgeColor}`}>
              {status || "N/A"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "date_created",
        header: "Date Created",
        cell: ({ row }: any) =>
          dayjs(row.original.createdAt).isValid()
            ? dayjs(row.original.createdAt).format("DD-MMM-YYYY")
            : "N/A",
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
      <LeadDetailsDrawer
        lead={selectedLead}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        refreshData={fetchLeads}
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
