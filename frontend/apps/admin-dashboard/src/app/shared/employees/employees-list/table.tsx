"use client";

import React, { useState, useEffect, useCallback } from "react";
import employeeService from "@/services/employeeService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { EmployeeType } from "@/types/employeeTypes";
import EmployeeDetailsDrawer from "./EmployeeDetailsDrawer";
import EmployeeEditDrawer from "../create-edit/EmployeeEditForm";
import { FiEdit, FiTrash } from "react-icons/fi";

export default function EmployeesTable({
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
    department: "",
    jobTitle: "",
    nationality: "",
    dateOfJoining: null,
  });

  const [selectedEmployee, setSelectedEmployee] = useState({} as EmployeeType);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditOpen, setDrawerEditOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        department: filters.department || undefined,
        job_title: filters.jobTitle || undefined,
        nationality: filters.nationality || undefined,
        date_of_joining: filters.dateOfJoining,
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
      console.error("Error fetching employees:", error.message);
      toast.error("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchEmployees = useCallback(debounce(fetchEmployees, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchEmployees();
    return () => debouncedFetchEmployees.cancel();
  }, [debouncedFetchEmployees]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchEmployees();
  };

  const { table } = useTanStackTable<EmployeeType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "full_name",
        header: "Full Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedEmployee(row.original);
              setDrawerOpen(true);
            }}
          >
            {row.original.full_name}
          </button>
        ),
      },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "job_title", header: "Job Title" },
      {
        accessorKey: "date_of_joining",
        header: "Date of Joining",
        cell: ({ row }: any) =>
          dayjs(row.original.date_of_joining).isValid()
            ? dayjs(row.original.date_of_joining).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "nationality",
        header: "Nationality",
        cell: ({ row }: any) => row.original.nationality || "N/A",
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
      <EmployeeDetailsDrawer
        onDeleted={fetchEmployees}
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdated={fetchEmployees}
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
