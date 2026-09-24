// "use client";

// import React, { useEffect, useState } from "react";
// import tenantService from "@/services/tenantService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Flex, Tooltip, Badge } from "rizzui";
// import Link from "next/link";
// import PencilIcon from "@core/components/icons/pencil";
// import DeletePopover from "@core/components/delete-popover";
// import toast from "react-hot-toast";
// import { routes } from "@/config/routes";
// import dayjs from "dayjs";

// export default function TenantsTable({
//   pageSize = 20,
//   hideFilters = false,
//   hidePagination = false,
// }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: pageSize,
//     totalCount: 0,
//   });
//   const [filters, setFilters] = useState({
//     globalSearch: "",
//     createdAt: [null, null],
//   });

//   const statusColors = {
//     Active: "bg-green-500",
//     Expired: "bg-red-500",
//     Trialing: "bg-yellow-500",
//     "Payment Failed": "bg-orange-500",
//     "Pending Update": "bg-blue-500",
//   };

//   const fetchTenants = async () => {
//     setLoading(true);
//     try {
//       const response = await tenantService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: filters.globalSearch,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.totalCount || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error) {
//       console.error("Error fetching tenants:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTenants();
//   }, [pagination.pageIndex, pagination.pageSize, filters]);

//   const { table } = useTanStackTable({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "company_name", header: "Company Name" },
//       { accessorKey: "tenant_owner.name", header: "Owner Name" },
//       { accessorKey: "tenant_owner.email", header: "Owner Email" },
//       {
//         accessorKey: "subscription_start_date",
//         header: "Start",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_start_date).isValid()
//             ? dayjs(row.original.subscription_start_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_end_date",
//         header: "End",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_end_date).isValid()
//             ? dayjs(row.original.subscription_end_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.original.subscription_status;
//           const colorClass = statusColors[status] || "bg-gray-500"; // Default color if status not found

//           return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
//         },
//       },

//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" gap="3" className="pe-4">
//             <Tooltip
//               size="sm"
//               content={"Edit Tenant"}
//               placement="top"
//               color="invert"
//             >
//               <Link href={routes.tenants.editTenant(row.original._id)}>
//                 <ActionIcon
//                   as="span"
//                   size="sm"
//                   variant="outline"
//                   aria-label={"Edit Tenant"}
//                 >
//                   <PencilIcon className="h-4 w-4" />
//                 </ActionIcon>
//               </Link>
//             </Tooltip>
//             <DeletePopover
//               title={`Delete Tenant`}
//               description={`Are you sure you want to delete this tenant?`}
//               onDelete={async () => {
//                 try {
//                   await tenantService.delete(row.original._id);
//                   toast.success(`Tenant deleted successfully.`);
//                   fetchTenants(); // Refresh table
//                 } catch (error) {
//                   toast.error("Failed to delete the tenant.");
//                 }
//               }}
//             />
//           </Flex>
//         ),
//       },
//     ],
//   });

//   return (
//     <div>
//       {!hideFilters && (
//         <Filters table={table} filters={filters} setFilters={setFilters} />
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
//               table={{
//                 getState: () => ({
//                   pagination: {
//                     pageIndex: pagination.pageIndex,
//                     pageSize: pagination.pageSize,
//                   },
//                 }),
//                 setPageSize: (size) =>
//                   setPagination((prev) => ({ ...prev, pageSize: size })),
//                 nextPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: prev.pageIndex + 1,
//                   })),
//                 previousPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.max(0, prev.pageIndex - 1),
//                   })),
//                 firstPage: () =>
//                   setPagination((prev) => ({ ...prev, pageIndex: 0 })),
//                 lastPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.ceil(prev.totalCount / prev.pageSize) - 1,
//                   })),
//                 getCanPreviousPage: () => pagination.pageIndex > 0,
//                 getCanNextPage: () =>
//                   pagination.pageIndex <
//                   Math.ceil(pagination.totalCount / pagination.pageSize) - 1,
//                 getPageCount: () =>
//                   Math.ceil(pagination.totalCount / pagination.pageSize),
//               }}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

//-------------------------------------------HERE----------------------------------------

// "use client";

// import React, { useEffect, useState } from "react";
// import tenantService from "@/services/tenantService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Flex, Tooltip, Badge } from "rizzui";
// import Link from "next/link";
// import PencilIcon from "@core/components/icons/pencil";
// import DeletePopover from "@core/components/delete-popover";
// import EyeIcon from "@core/components/icons/eye";
// import toast from "react-hot-toast";
// import { routes } from "@/config/routes";
// import { useModal } from "@/app/shared/modal-views/use-modal";
// import dayjs from "dayjs";
// import TenantDetailsModal from "@/app/shared/tenant/tenant-list/tenantDetails";
// import TenantSubscription from "./tenantSubscription";
// import TableActions from "./tableActions";
// import TenantsTableActions from "./tableActions";

// export default function TenantsTable({
//   pageSize = 20,
//   hideFilters = false,
//   hidePagination = false,
// }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: pageSize,
//     totalCount: 0,
//   });
//   const [filters, setFilters] = useState({
//     globalSearch: "",
//     status: null,
//     subscriptionPlan: null,
//   });

//   const { openModal, closeModal } = useModal();

//   const statusColors = {
//     Active: "bg-green-500",
//     Expired: "bg-red-500",
//     Trialing: "bg-yellow-500",
//     "Payment Failed": "bg-orange-500",
//     "Pending Update": "bg-blue-500",
//   };

//   const fetchTenants = async () => {
//     setLoading(true);
//     try {
//       const response = await tenantService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: filters.globalSearch,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error) {
//       console.error("Error fetching tenants:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTenants();
//   }, [pagination.pageIndex, pagination.pageSize, filters]);

//   const handleSubscriptionAction = async (
//     action: "create" | "update" | "renew",
//     tenantId: string
//   ) => {
//     try {
//       openModal({
//         view: (
//           <TenantSubscription
//             tenantId={tenantId}
//             action={action}
//             onSuccess={() => {
//               toast.success(`Subscription ${action}d successfully.`);
//               closeModal();
//             }}
//             closeModal={closeModal} // Pass the closeModal function
//           />
//         ),
//       });
//     } catch (error) {
//       toast.error("Failed to perform subscription action.");
//     }
//   };

//   const { table } = useTanStackTable({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "company_name", header: "Company Name" },
//       { accessorKey: "tenant_owner.name", header: "Owner Name" },
//       { accessorKey: "tenant_owner.email", header: "Owner Email" },
//       {
//         accessorKey: "subscription_plan",
//         header: "Plan",
//         cell: ({ row }) => row.original.subscription_plan?.name || "Free Tier",
//       },
//       {
//         accessorKey: "subscription_start_date",
//         header: "Start",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_start_date).isValid()
//             ? dayjs(row.original.subscription_start_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_end_date",
//         header: "End",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_end_date).isValid()
//             ? dayjs(row.original.subscription_end_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.original.subscription_status;
//           const colorClass = statusColors[status] || "bg-gray-500";

//           return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
//         },
//       },
//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" className="pe-4">
//             <TenantsTableActions row={row} fetchTenants={fetchTenants} />
//             <DeletePopover
//               title={`Delete Tenant`}
//               description={`Are you sure you want to delete the tenant #${row.original._id}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting tenant..."); // Show loading toast
//                   await tenantService.delete(row.original._id); // Call delete API
//                   toast.dismiss(); // Clear loading toast
//                   toast.success(
//                     `Tenant #${row.original._id} deleted successfully.`
//                   );
//                   await fetchTenants(); // Refresh table data
//                 } catch (error) {
//                   console.error("Error deleting tenant:", error);
//                   toast.dismiss(); // Clear loading toast
//                   toast.error("Failed to delete tenant. Please try again.");
//                 }
//               }}
//             />
//           </Flex>
//         ),
//       },
//     ],
//   });

//   return (
//     <div>
//       {!hideFilters && (
//         <Filters table={table} filters={filters} setFilters={setFilters} />
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
//               table={{
//                 getState: () => ({
//                   pagination: {
//                     pageIndex: pagination.pageIndex,
//                     pageSize: pagination.pageSize,
//                   },
//                 }),
//                 setPageSize: (size) =>
//                   setPagination((prev) => ({ ...prev, pageSize: size })),
//                 nextPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: prev.pageIndex + 1,
//                   })),
//                 previousPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.max(0, prev.pageIndex - 1),
//                   })),
//                 firstPage: () =>
//                   setPagination((prev) => ({ ...prev, pageIndex: 0 })),
//                 lastPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.ceil(prev.totalCount / prev.pageSize) - 1,
//                   })),
//                 getCanPreviousPage: () => pagination.pageIndex > 0,
//                 getCanNextPage: () =>
//                   pagination.pageIndex <
//                   Math.ceil(pagination.totalCount / pagination.pageSize) - 1,
//                 getPageCount: () =>
//                   Math.ceil(pagination.totalCount / pagination.pageSize),
//               }}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import tenantService from "@/services/tenantService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { Flex, Badge } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import TenantsTableActions from "./tableActions";
// import DeletePopover from "@core/components/delete-popover";

// export default function TenantsTable({
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
//     subscriptionStatus: null,
//     subscriptionPlan: null,
//   });

//   const statusColors = {
//     Active: "bg-green-500",
//     Expired: "bg-red-500",
//     Trialing: "bg-yellow-500",
//     "Payment Failed": "bg-orange-500",
//     "Pending Update": "bg-blue-500",
//   };

//   const fetchTenants = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await tenantService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: filters.globalSearch,
//         status: filters.subscriptionStatus,
//         subscription_plan: filters.subscriptionPlan,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error) {
//       console.error("Error fetching tenants:", error.message);
//       toast.error("Failed to fetch tenants.");
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, pagination.pageIndex, pagination.pageSize]);

//   const handleApplyFilters = (newFilters) => {
//     setFilters(newFilters);
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0, // Reset to the first page when filters are applied
//     }));
//   };

//   useEffect(() => {
//     fetchTenants();
//   }, [fetchTenants]);

//   const { table } = useTanStackTable({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "company_name", header: "Company Name" },
//       { accessorKey: "tenant_owner.name", header: "Owner Name" },
//       { accessorKey: "tenant_owner.email", header: "Owner Email" },
//       {
//         accessorKey: "subscription_plan",
//         header: "Plan",
//         cell: ({ row }) => row.original.subscription_plan?.name || "Free Tier",
//       },
//       {
//         accessorKey: "subscription_start_date",
//         header: "Start",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_start_date).isValid()
//             ? dayjs(row.original.subscription_start_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_end_date",
//         header: "End",
//         cell: ({ row }) =>
//           dayjs(row.original.subscription_end_date).isValid()
//             ? dayjs(row.original.subscription_end_date).format("DD-MMM-YYYY")
//             : "Invalid Date",
//       },
//       {
//         accessorKey: "subscription_status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.original.subscription_status;
//           const colorClass = statusColors[status] || "bg-gray-500";

//           return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
//         },
//       },
//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" className="pe-4">
//             <TenantsTableActions row={row} fetchTenants={fetchTenants} />
//             <DeletePopover
//               title={`Delete Tenant`}
//               description={`Are you sure you want to delete the tenant #${row.original._id}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting tenant..."); // Show loading toast
//                   await tenantService.delete(row.original._id); // Call delete API
//                   toast.dismiss(); // Clear loading toast
//                   toast.success(
//                     `Tenant #${row.original._id} deleted successfully.`
//                   );
//                   await fetchTenants(); // Refresh table data
//                 } catch (error) {
//                   console.error("Error deleting tenant:", error);
//                   toast.dismiss(); // Clear loading toast
//                   toast.error("Failed to delete tenant. Please try again.");
//                 }
//               }}
//             />
//           </Flex>
//         ),
//       },
//     ],
//   });

//   return (
//     <div>
//       {!hideFilters && (
//         <Filters
//           filters={filters}
//           setFilters={setFilters}
//           onApplyFilters={handleApplyFilters}
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
//               table={{
//                 getState: () => ({
//                   pagination: {
//                     pageIndex: pagination.pageIndex,
//                     pageSize: pagination.pageSize,
//                   },
//                 }),
//                 setPageSize: (size) =>
//                   setPagination((prev) => ({ ...prev, pageSize: size })),
//                 nextPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: prev.pageIndex + 1,
//                   })),
//                 previousPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.max(0, prev.pageIndex - 1),
//                   })),
//                 firstPage: () =>
//                   setPagination((prev) => ({ ...prev, pageIndex: 0 })),
//                 lastPage: () =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     pageIndex: Math.ceil(prev.totalCount / prev.pageSize) - 1,
//                   })),
//                 getCanPreviousPage: () => pagination.pageIndex > 0,
//                 getCanNextPage: () =>
//                   pagination.pageIndex <
//                   Math.ceil(pagination.totalCount / pagination.pageSize) - 1,
//                 getPageCount: () =>
//                   Math.ceil(pagination.totalCount / pagination.pageSize),
//               }}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import tenantService from "@/services/tenantService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { Flex, Badge } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import TenantsTableActions from "./tableActions";
import DeletePopover from "@core/components/delete-popover";
import { debounce } from "lodash";
import { TenantDataType } from "@/types/tenantTypes";

export default function TenantsTable({
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
    subscriptionStatus: null,
    subscriptionPlan: null,
  });

  const statusColors = {
    Active: "bg-green-500",
    Expired: "bg-red-500",
    Trialing: "bg-yellow-500",
    "Payment Failed": "bg-orange-500",
    "Pending Update": "bg-blue-500",
  };

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await tenantService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.globalSearch,
        status: filters.subscriptionStatus,
        subscription_plan: filters.subscriptionPlan,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching tenants:", error.message);
      toast.error("Failed to fetch tenants.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce fetchTenants to handle rapid search input changes
  const debouncedFetchTenants = useCallback(debounce(fetchTenants, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchTenants();
    return () => debouncedFetchTenants.cancel();
  }, [debouncedFetchTenants]);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0, // Reset to the first page when filters are applied
    }));
  };

  const { table } = useTanStackTable<TenantDataType>({
    tableData: data,
    columnConfig: [
      { accessorKey: "company_name", header: "Company Name" },
      { accessorKey: "tenant_owner.name", header: "Owner Name" },
      { accessorKey: "tenant_owner.email", header: "Owner Email" },
      {
        accessorKey: "subscription_plan",
        header: "Plan",
        cell: ({ row }: any) =>
          row.original.subscription_plan?.name || "Free Tier",
      },
      {
        accessorKey: "subscription_start_date",
        header: "Start",
        cell: ({ row }: any) =>
          dayjs(row.original.subscription_start_date).isValid()
            ? dayjs(row.original.subscription_start_date).format("DD-MMM-YYYY")
            : "Invalid Date",
      },
      {
        accessorKey: "subscription_end_date",
        header: "End",
        cell: ({ row }: any) =>
          dayjs(row.original.subscription_end_date).isValid()
            ? dayjs(row.original.subscription_end_date).format("DD-MMM-YYYY")
            : "Invalid Date",
      },
      {
        accessorKey: "subscription_status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.subscription_status;
          const colorClass = statusColors[status] || "bg-gray-500";

          return <Badge className={`text-white ${colorClass}`}>{status}</Badge>;
        },
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <Flex align="center" justify="end" className="pe-4">
            <TenantsTableActions row={row} fetchTenants={fetchTenants} />
            <DeletePopover
              title={`Delete Tenant`}
              description={`Are you sure you want to delete the tenant #${row.original._id}?`}
              onDelete={async () => {
                try {
                  toast.loading("Deleting tenant..."); // Show loading toast
                  await tenantService.delete(row.original._id); // Call delete API
                  toast.dismiss(); // Clear loading toast
                  toast.success(
                    `Tenant #${row.original._id} deleted successfully.`
                  );
                  await fetchTenants(); // Refresh table data
                } catch (error) {
                  console.error("Error deleting tenant:", error);
                  toast.dismiss(); // Clear loading toast
                  toast.error("Failed to delete tenant. Please try again.");
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
    setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 })); // Reset to first page
  };

  return (
    <div>
      {!hideFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={fetchTenants}
          table={table}
        />
      )}
      {loading ? (
        <p></p>
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
