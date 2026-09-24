// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import subscriptionOrderService from "@/services/subscriptionOrderService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { Badge, Flex } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";

// const statusColors = {
//   Pending: "bg-yellow-500",
//   Paid: "bg-green-500",
//   Failed: "bg-red-500",
//   Canceled: "bg-gray-500",
// };

// export default function SubscriptionOrdersTable({
//   pageSize = 20,
//   hideFilters = false,
//   hidePagination = false,
// }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: pageSize,
//     totalCount: 0,
//   });
//   const [filters, setFilters] = useState({
//     globalSearch: "",
//     status: null,
//     tenant: null,
//     subscriptionPlan: null,
//   });

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await subscriptionOrderService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: filters.globalSearch,
//         status: filters.status,
//         tenant: filters.tenant,
//         subscriptionPlan: filters.subscriptionPlan,
//       });
//       const responseData = response?.data || [];
//       console.log(responseData, "heyyyyy");
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error: any) {
//       console.error("Error fetching orders:", error.message);
//       toast.error("Failed to fetch orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchOrders = useCallback(debounce(fetchOrders, 300), [
//     filters,
//     pagination.pageIndex,
//     pagination.pageSize,
//   ]);

//   useEffect(() => {
//     debouncedFetchOrders();
//     return () => debouncedFetchOrders.cancel();
//   }, [debouncedFetchOrders]);

//   const handleApplyFilters = (newFilters: any) => {
//     setFilters(newFilters);
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0,
//     }));
//   };

//   const { table } = useTanStackTable({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "tenant_id.company_name", header: "Company Name" },
//       { accessorKey: "subscription_plan.name", header: "Plan Name" },
//       {
//         accessorKey: "amount",
//         header: "Amount",
//         cell: ({ row }: any) =>
//           `${row.original.amount} ${row.original.currency.toUpperCase()}`,
//       },
//       {
//         accessorKey: "start_date",
//         header: "Start Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.start_date).isValid()
//             ? dayjs(row.original.start_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "end_date",
//         header: "End Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.end_date).isValid()
//             ? dayjs(row.original.end_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.original.status;
//           const colorClass = statusColors[status] || "bg-gray-500";
//           return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
//         },
//       },
//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" className="pe-4">
//             <DeletePopover
//               title={`Delete Order`}
//               description={`Are you sure you want to delete order #${row.original._id}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting order...");
//                   await subscriptionOrderService.delete(row.original._id);

//                   toast.dismiss();
//                   toast.success(
//                     `Order #${row.original._id} deleted successfully.`
//                   );
//                   await fetchOrders();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete order. Please try again.");
//                 }
//               }}
//             />
//           </Flex>
//         ),
//       },
//     ],
//   });

//   const handlePageChange = (pageIndex: number) => {
//     setPagination((prev) => ({ ...prev, pageIndex }));
//   };

//   const handlePageSizeChange = (pageSize: number) => {
//     setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
//   };

//   return (
//     <div>
//       {!hideFilters && (
//         <Filters
//           filters={filters}
//           setFilters={setFilters}
//           onApplyFilters={fetchOrders}
//           table={table}
//         />
//       )}
//       {loading ? (
//             <div className="flex justify-center items-center py-10">
//   <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
// </div>
//       ) : (
//         <>
//           <Table table={table} variant="modern" />
//           {!hidePagination && (
//             <TablePagination
//               pageIndex={pagination.pageIndex}
//               pageSize={pagination.pageSize}
//               totalCount={pagination.totalCount}
//               onPageChange={handlePageChange}
//               onPageSizeChange={handlePageSizeChange}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import subscriptionOrderService from "@/services/subscriptionOrderService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { SubscriptionOrderType } from "@/types/subscriptionOrdersTypes";
import { useModal } from "../../modal-views/use-modal";
import SubscriptionOrderDetailsModal from "./SubscriptionOrderDetailsModal";
import { FiDownload, FiEye } from "react-icons/fi";

const statusColors = {
  Pending: "bg-yellow-500",
  Paid: "bg-green-500",
  Failed: "bg-red-500",
  Canceled: "bg-gray-500",
};

export default function SubscriptionOrdersTable({
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
    status: "",
    tenantId: "",
    subscriptionPlanId: "",
  });

  const { openModal, closeModal } = useModal();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await subscriptionOrderService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: filters.status || undefined,
        tenantId: filters.tenantId || undefined,
        subscriptionPlanId: filters.subscriptionPlanId || undefined,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOrders = useCallback(debounce(fetchOrders, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchOrders();
    return () => debouncedFetchOrders.cancel();
  }, [debouncedFetchOrders]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0, // Reset to first page when filters are applied
    }));
    fetchOrders();
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // process.env.NODE_ENV === "development"
  //   ? "http://localhost:5000"
  //   : "https://api.example.com";

  const { table } = useTanStackTable<SubscriptionOrderType>({
    tableData: data,
    columnConfig: [
      { accessorKey: "tenant_id.company_name", header: "Company Name" },
      { accessorKey: "subscription_plan.name", header: "Plan Name" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: any) =>
          `${row.original.amount} ${row.original.currency.toUpperCase()}`,
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }: any) =>
          dayjs(row.original.start_date).isValid()
            ? dayjs(row.original.start_date).format("DD-MMM-YYYY")
            : "Invalid Date",
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }: any) =>
          dayjs(row.original.end_date).isValid()
            ? dayjs(row.original.end_date).format("DD-MMM-YYYY")
            : "Invalid Date",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colorClass = statusColors[status] || "bg-gray-500";
          return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
        },
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <Flex align="center" justify="end" className="pe-4">
            {/* View Details Action */}
            <Tooltip
              size="sm"
              content="View Details"
              placement="top"
              color="invert"
            >
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label="View Details"
                onClick={() => {
                  openModal({
                    view: (
                      <SubscriptionOrderDetailsModal
                        order={row.original}
                        closeModal={closeModal}
                      />
                    ),
                    size: "lg",
                  });
                }}
              >
                <FiEye />
              </ActionIcon>
            </Tooltip>

            {/* Download Invoice Action */}
            <Tooltip
              size="sm"
              content="Download Invoice"
              placement="top"
              color="invert"
            >
              <a
                href={`${BASE_URL}/api/subscription-orders/${row.original._id}/invoice/admin`}
                download
                aria-label="Download Invoice"
                className="inline-flex"
              >
                <ActionIcon as="span" size="sm" variant="outline">
                  <FiDownload />
                </ActionIcon>
              </a>
            </Tooltip>

            {/* Delete Action */}
            <DeletePopover
              title={`Delete Order`}
              description={`Are you sure you want to delete order #${row.original._id}?`}
              onDelete={async () => {
                try {
                  toast.loading("Deleting order...");
                  await subscriptionOrderService.delete(row.original._id);

                  toast.dismiss();
                  toast.success(
                    `Order #${row.original._id} deleted successfully.`
                  );
                  await fetchOrders();
                } catch (error) {
                  toast.dismiss();
                  toast.error("Failed to delete order. Please try again.");
                }
              }}
            />
          </Flex>
        ),
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
    <div>
      {!hideFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          // table={table}
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
