"use client";

import React, { useEffect, useState } from "react";
import subscriptionService from "@/services/subscriptionservice";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Flex, Tooltip } from "rizzui";
import Link from "next/link";
import EyeIcon from "@core/components/icons/eye";
import PencilIcon from "@core/components/icons/pencil";
import { routesSuperAdmin } from "@/config/routes";
import DeletePopover from "@core/components/delete-popover";
import toast from "react-hot-toast";
import { SubscriptionPlan } from "@/types/subscriptionPlanTypes";

export default function SubscriptionsTable({
  pageSize = 10,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState([]); // Table data
  const [loading, setLoading] = useState(true); // Loading state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    price: [null, null],
    createdAt: [null, null],
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getList({
        // page: pagination.pageIndex + 1,
        // limit: pagination.pageSize,
        search: filters.globalSearch,
        priceRange: filters.price,
        createdAtRange: filters.createdAt,
      });
      const responseData = response?.data || [];
      const totalCount = response?.totalCount || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const handlePageChange = (pageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 })); // Reset to first page
  };

  const { table } = useTanStackTable<SubscriptionPlan>({
    tableData: data, // Pass the dynamic data here
    columnConfig: [
      { accessorKey: "name", header: "Plan Name" },
      // { accessorKey: "description", header: "Description" },
      { accessorKey: "price", header: "Price (AED)" },
      { accessorKey: "interval", header: "Interval" },
      { accessorKey: "interval_count", header: "Interval Count" },
      // { accessorKey: "features.max_users", header: "Max Users" },
      { accessorKey: "features.max_organization", header: "Max Organizations" },
      // { accessorKey: "status", header: "Status" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <Flex align="center" justify="end" gap="3" className="pe-4">
            <Tooltip
              size="sm"
              content={"Edit Product"}
              placement="top"
              color="invert"
            >
              <Link
                href={routesSuperAdmin.subscriptions.editSubscription(
                  row.original._id
                )}
              >
                <ActionIcon
                  as="span"
                  size="sm"
                  variant="outline"
                  aria-label={"Edit Product"}
                >
                  <PencilIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <Tooltip
              size="sm"
              content={"View Product"}
              placement="top"
              color="invert"
            >
              <Link
                href={routesSuperAdmin.subscriptions.editSubscription(
                  row.original._id
                )}
              >
                <ActionIcon
                  as="span"
                  size="sm"
                  variant="outline"
                  aria-label={"View Product"}
                >
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <DeletePopover
              title={`Delete the Subscription`}
              description={`Are you sure you want to delete this #${row.original._id} Subscription?`}
              onDelete={async () => {
                try {
                  setLoading(true); // Show loading state
                  await subscriptionService.delete(row.original._id); // Call delete API
                  toast.success(
                    `Product #${row.original._id} deleted successfully.`
                  );
                  await fetchSubscriptions(); // Refresh data
                } catch (error) {
                  console.error("Error deleting product:", error);
                  toast.error(
                    "Failed to delete the product. Please try again."
                  );
                } finally {
                  setLoading(false); // Reset loading state
                }
              }}
            />
          </Flex>
        ),
      },
    ],
  });

  return (
    <div>
      {!hideFilters && (
        <Filters
          table={table}
          // filters={filters} setFilters={setFilters}
        />
      )}
      {loading ? (
        <p></p>
      ) : (
        <>
          {/* Render Table */}
          <Table table={table} variant="modern" />

          {/* Render Pagination */}
          {/* {!hidePagination && (
            <TablePagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={pagination.totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
 
          )} */}
        </>
      )}
    </div>
  );
}

// <TablePagination
//   table={{
//     getState: () => ({
//       pagination: {
//         pageIndex: pagination.pageIndex,
//         pageSize: pagination.pageSize,
//       },
//     }),
//     setPageSize: (size) =>
//       setPagination((prev) => ({ ...prev, pageSize: size })),
//     nextPage: () =>
//       setPagination((prev) => ({
//         ...prev,
//         pageIndex: prev.pageIndex + 1,
//       })),
//     previousPage: () =>
//       setPagination((prev) => ({
//         ...prev,
//         pageIndex: Math.max(0, prev.pageIndex - 1),
//       })),
//     firstPage: () =>
//       setPagination((prev) => ({ ...prev, pageIndex: 0 })),
//     lastPage: () =>
//       setPagination((prev) => ({
//         ...prev,
//         pageIndex: Math.ceil(prev.totalCount / prev.pageSize) - 1,
//       })),
//     getCanPreviousPage: () => pagination.pageIndex > 0,
//     getCanNextPage: () =>
//       pagination.pageIndex <
//       Math.ceil(pagination.totalCount / pagination.pageSize) - 1,
//     getPageCount: () =>
//       Math.ceil(pagination.totalCount / pagination.pageSize),
//   }}
// />
