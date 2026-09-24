"use client";

import React, { useState, useEffect, useCallback } from "react";
import customerService from "@/services/customerService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { CustomerType } from "@/types/customerTypes";
import { useModal } from "../../modal-views/use-modal";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomerDetailsDrawer from "./CustomerDetailsDrawer";

export default function CustomersTable({
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
    customerType: "",
    assignedTo: "",
    dateOfBirth: "",
  });

  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditOpen, setDrawerEditOpen] = useState(false);

  const { openModal, closeModal } = useModal();
  const router = useRouter();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        dateOfBirth: filters.dateOfBirth || undefined,
        search: filters.globalSearch || undefined,
        customerType: filters.customerType || undefined,
        assignedTo: filters.assignedTo || undefined,
      });

      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching customers:", error.message);
      toast.error("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchCustomers();
    return () => debouncedFetchCustomers.cancel();
  }, [debouncedFetchCustomers]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchCustomers();
  };

  const { table } = useTanStackTable<CustomerType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "full_name",
        header: "Full Name",
        cell: ({ row }: any) => (
          <button
            onClick={() => {
              setSelectedCustomer(row.original);
              setDrawerOpen(true);
            }}
            className="text-primary"
          >
            {row.original.full_name}
          </button>
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "phone_number",
        header: "Phone Number",
        cell: ({ row }: any) => row.original.phone_number || "N/A",
      },
      {
        accessorKey: "customer_type",
        header: "Customer Type",
        cell: ({ row }: any) => (
          <Badge className="px-2 py-1 rounded bg-blue-500 text-white">
            {row.original.customer_type}
          </Badge>
        ),
      },
      {
        accessorKey: "date_of_birth",
        header: "Date of Birth",
        cell: ({ row }: any) =>
          dayjs(row.original.date_of_birth).isValid()
            ? dayjs(row.original.date_of_birth).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "assigned_to",
        header: "Assigned To",
        cell: ({ row }: any) => row.original.assigned_to?.full_name || "N/A",
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
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdated={fetchCustomers}
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
