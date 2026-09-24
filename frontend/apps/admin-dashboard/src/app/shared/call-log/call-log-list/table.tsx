// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import callLogService from "@/services/callLogService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import { CallLogType } from "@/types/callLogTypes";
// import { useModal } from "../../modal-views/use-modal";
// import CallLogDetailsModal from "./CallLogDetailsDrawer";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function CallLogTable({
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
//     visitorType: "",
//     organizationId: "",
//     dateTime: "",
//     status: "",
//   });

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const statusColors: any = {
//     "Positive Intention": "bg-green-500 text-white",
//     "Neutral Intention": "bg-yellow-500 text-white",
//     "Negative Intention": "bg-red-500 text-white",
//   };

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     try {
//       const response = await callLogService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         dateTime: filters.dateTime || undefined,
//         search: filters.globalSearch || undefined,
//         visitor_type: filters.visitorType || undefined,
//         organizationId: filters.organizationId || undefined,
//         status: filters.status,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error: any) {
//       console.error("Error fetching call logs:", error.message);
//       toast.error("Failed to fetch call logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchCallLogs = useCallback(debounce(fetchCallLogs, 300), [
//     filters,
//     pagination.pageIndex,
//     pagination.pageSize,
//   ]);

//   useEffect(() => {
//     debouncedFetchCallLogs();
//     return () => debouncedFetchCallLogs.cancel();
//   }, [debouncedFetchCallLogs]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0, // Reset to first page when filters are applied
//     }));
//     fetchCallLogs();
//   };

//   const { table } = useTanStackTable<CallLogType>({
//     tableData: data,
//     columnConfig: [
//       {
//         accessorKey: "caller_name",
//         header: "Caller Name",
//         cell: ({ row }: any) => (
//           <Link
//             href={`/tenant/reception/call-log/${row.original._id}`}
//             className="text-primary"
//           >
//             {row.original.caller_name}
//           </Link>
//         ),
//       },
//       { accessorKey: "caller_company", header: "Caller Company" },
//       {
//         accessorKey: "visitor_type",
//         header: "Visitor Type",
//         cell: ({ row }: any) => row.original.visitor_type || "N/A",
//       },
//       { accessorKey: "caller_contact_number", header: "Contact Number" },
//       { accessorKey: "purpose_of_call", header: "Purpose" },
//       {
//         accessorKey: "date_time",
//         header: "Date & Time",
//         cell: ({ row }: any) =>
//           dayjs(row.original.date_time).isValid()
//             ? dayjs(row.original.date_time).format("DD-MMM-YYYY hh:mm a")
//             : "N/A",
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }: any) => {
//           const status = row.original.status;
//           const badgeColor = statusColors[status] || "bg-gray-500 text-white";
//           return (
//             <Badge className={`px-2 py-1 rounded ${badgeColor}`}>
//               {status || "N/A"}
//             </Badge>
//           );
//         },
//       },
//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" className="pe-4">
//             {/* View Details Action */}
//             <Tooltip
//               size="sm"
//               content="View Details"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="View Details"
//                 onClick={() => {
//                   openModal({
//                     view: (
//                       <CallLogDetailsModal
//                         callLog={row.original}
//                         closeModal={closeModal}
//                       />
//                     ),
//                     size: "lg",
//                   });
//                 }}
//               >
//                 <FiEye />
//               </ActionIcon>
//             </Tooltip>

//             {/* Edit Call Log Action */}
//             <Tooltip
//               size="sm"
//               content="Edit Call Log"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="Edit Call Log"
//                 onClick={() => {
//                   router.push(
//                     `/tenant/reception/call-log/${row.original._id}/edit`
//                   );
//                 }}
//               >
//                 <FiEdit />
//               </ActionIcon>
//             </Tooltip>

//             {/* Delete Call Log Action */}
//             <DeletePopover
//               title={`Delete Call Log`}
//               description={`Are you sure you want to delete the call log by ${row.original.caller_name}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting call log...");
//                   await callLogService.delete(row.original._id);
//                   toast.dismiss();
//                   toast.success(
//                     `Call log by ${row.original.caller_name} deleted successfully.`
//                   );
//                   await fetchCallLogs();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete call log. Please try again.");
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
//           onApplyFilters={handleApplyFilters}
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
import callLogService from "@/services/callLogService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { CallLogType } from "@/types/callLogTypes";
import { FiEdit, FiTrash } from "react-icons/fi";
import dayjs from "dayjs";
import CallLogDetailsDrawer from "./CallLogDetailsDrawer";
import CallLogEditDrawer from "../create-edit/CallLogEditDrawer";

export default function CallLogTable({
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
    visitorType: "",
    organizationId: "",
    dateTime: "",
    status: "",
  });

  const [selectedLog, setSelectedLog] = useState({}) as any;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const statusColors: any = {
    "Positive Intention": "bg-green-500 text-white",
    "Neutral Intention": "bg-yellow-500 text-white",
    "Negative Intention": "bg-red-500 text-white",
  };

  const fetchCallLogs = async () => {
    setLoading(true);
    try {
      const response = await callLogService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        dateTime: filters.dateTime || undefined,
        search: filters.globalSearch || undefined,
        visitor_type: filters.visitorType || undefined,
        organizationId: filters.organizationId || undefined,
        status: filters.status,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching call logs:", error.message);
      toast.error("Failed to fetch call logs.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCallLogs = useCallback(debounce(fetchCallLogs, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchCallLogs();
    return () => debouncedFetchCallLogs.cancel();
  }, [debouncedFetchCallLogs]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchCallLogs();
  };

  const { table } = useTanStackTable<CallLogType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "caller_name",
        header: "Caller Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedLog(row.original);
              setDetailsOpen(true);
            }}
          >
            {row.original.caller_name}
          </button>
        ),
        enableSorting: true,
      },
      { accessorKey: "caller_company", header: "Caller Company" },
      {
        accessorKey: "visitor_type",
        header: "Visitor Type",
        cell: ({ row }: any) => row.original.visitor_type || "N/A",
      },
      { accessorKey: "caller_contact_number", header: "Contact Number" },
      { accessorKey: "purpose_of_call", header: "Purpose" },
      {
        accessorKey: "date_time",
        header: "Date & Time",
        cell: ({ row }: any) =>
          dayjs(row.original.date_time).isValid()
            ? dayjs(row.original.date_time).format("DD-MMM-YYYY hh:mm a")
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
      <CallLogDetailsDrawer
        callLog={selectedLog}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        refreshData={fetchCallLogs}
      />

      <CallLogEditDrawer
        callLog={selectedLog}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          fetchCallLogs();
        }}
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

// {
//   accessorKey: "status",
//   header: "Status",
//   cell: ({ row }: any) => {
//     const status = row.original.status;
//     const badgeColor = statusColors[status] || "bg-gray-500 text-white";
//     return (
//       <Badge className={`px-2 py-1 rounded ${badgeColor}`}>
//         {status || "N/A"}
//       </Badge>
//     );
//   },
// },
// {
//   accessorKey: "action",
//   header: "Actions",
//   cell: ({ row }) => (
//     <Flex align="center" justify="end" className="pe-4">
//       <Tooltip
//         size="sm"
//         content="Edit Call Log"
//         placement="top"
//         color="invert"
//       >
//         <ActionIcon
//           as="span"
//           size="sm"
//           variant="outline"
//           aria-label="Edit Call Log"
//           onClick={() => {
//             setSelectedLog(row.original);
//             setEditOpen(true);
//           }}
//         >
//           <FiEdit />
//         </ActionIcon>
//       </Tooltip>

//       <DeletePopover
//         title={`Delete Call Log`}
//         description={`Are you sure you want to delete the call log by ${row.original.caller_name}?`}
//         onDelete={async () => {
//           try {
//             toast.loading("Deleting call log...");
//             await callLogService.delete(row.original._id);
//             toast.dismiss();
//             toast.success(
//               `Call log by ${row.original.caller_name} deleted successfully.`
//             );
//             await fetchCallLogs();
//           } catch (error) {
//             toast.dismiss();
//             toast.error("Failed to delete call log. Please try again.");
//           }
//         }}
//       />
//     </Flex>
//   ),
// },
