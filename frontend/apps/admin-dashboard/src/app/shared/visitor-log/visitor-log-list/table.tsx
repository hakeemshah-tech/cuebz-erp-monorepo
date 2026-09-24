// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import visitorService from "@/services/visitorLogService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import { VisitorLogType } from "@/types/visitorLogTypes";
// import { useModal } from "../../modal-views/use-modal";
// import VisitorDetailsModal from "./VisitorDetailsModal";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function VisitorLogTable({
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
//     status: "",
//     date: null,
//   });

//   const statusColors: any = {
//     "Positive Intention": "bg-green-500 text-white",
//     "Neutral Intention": "bg-yellow-500 text-white",
//     "Negative Intention": "bg-red-500 text-white",
//   };

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const fetchVisitors = async () => {
//     setLoading(true);
//     try {
//       const response = await visitorService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         status: filters.status,
//         search: filters.globalSearch || undefined,
//         visitor_type: filters.visitorType || undefined,
//         organizationId: filters.organizationId || undefined,
//         date: filters.date,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error: any) {
//       console.error("Error fetching visitors:", error.message);
//       toast.error("Failed to fetch visitors.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchVisitors = useCallback(debounce(fetchVisitors, 300), [
//     filters,
//     pagination.pageIndex,
//     pagination.pageSize,
//   ]);

//   useEffect(() => {
//     debouncedFetchVisitors();
//     return () => debouncedFetchVisitors.cancel();
//   }, [debouncedFetchVisitors]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0, // Reset to first page when filters are applied
//     }));
//     fetchVisitors();
//   };

//   const { table } = useTanStackTable<VisitorLogType>({
//     tableData: data,
//     columnConfig: [
//       {
//         accessorKey: "visitor_name",
//         header: "Visitor Name",
//         cell: ({ row }: any) => (
//           <Link
//             href={`/tenant/reception/visitor-log/${row.original._id}`}
//             className="text-primary"
//           >
//             {row.original.visitor_name}
//           </Link>
//         ),
//       },
//       { accessorKey: "visitor_company", header: "Visitor Company" },
//       {
//         accessorKey: "visitor_type",
//         header: "Visitor Type",
//         cell: ({ row }: any) => row.original.visitor_type || "N/A",
//       },
//       { accessorKey: "visitor_contact_number", header: "Contact Number" },
//       { accessorKey: "purpose_of_visit", header: "Purpose" },
//       {
//         accessorKey: "date",
//         header: "Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.date).isValid()
//             ? dayjs(row.original.date).format("DD-MMM-YYYY")
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
//                       <VisitorDetailsModal
//                         visitor={row.original}
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

//             {/* Edit Visitor Action */}
//             <Tooltip
//               size="sm"
//               content="Edit Visitor"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="Edit Visitor"
//                 onClick={() => {
//                   router.push(
//                     `/tenant/reception/visitor-log/${row.original._id}/edit`
//                   );
//                 }}
//               >
//                 <FiEdit />
//               </ActionIcon>
//             </Tooltip>

//             {/* Delete Visitor Action */}
//             <DeletePopover
//               title={`Delete Visitor`}
//               description={`Are you sure you want to delete the visitor ${row.original.visitor_name}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting visitor...");
//                   await visitorService.delete(row.original._id);
//                   toast.dismiss();
//                   toast.success(
//                     `Visitor ${row.original.visitor_name} deleted successfully.`
//                   );
//                   await fetchVisitors();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete visitor. Please try again.");
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
import visitorService from "@/services/visitorLogService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { VisitorLogType } from "@/types/visitorLogTypes";
import VisitorDetailsDrawer from "./VisitorDetailsDrawer";
import VisitorEditDrawer from "../create-edit/VisitorEditorForm";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";

const statusColors: any = {
  "Positive Intention": "bg-green-500 text-white",
  "Neutral Intention": "bg-yellow-500 text-white",
  "Negative Intention": "bg-red-500 text-white",
};

export default function VisitorLogTable({
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
    status: "",
    date: null,
  });

  const [selectedVisitor, setSelectedVisitor] = useState({} as VisitorLogType);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await visitorService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: filters.status,
        search: filters.globalSearch || undefined,
        visitor_type: filters.visitorType || undefined,
        organizationId: filters.organizationId || undefined,
        date: filters.date,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({ ...prev, totalCount }));
    } catch (error: any) {
      console.error("Error fetching visitors:", error.message);
      toast.error("Failed to fetch visitors.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchVisitors = useCallback(debounce(fetchVisitors, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchVisitors();
    return () => debouncedFetchVisitors.cancel();
  }, [debouncedFetchVisitors]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchVisitors();
  };

  const { table } = useTanStackTable<VisitorLogType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "visitor_name",
        header: "Visitor Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedVisitor(row.original);
              setDrawerOpen(true);
            }}
          >
            {row.original.visitor_name}
          </button>
        ),
      },
      { accessorKey: "visitor_company", header: "Visitor Company" },
      {
        accessorKey: "visitor_type",
        header: "Visitor Type",
        cell: ({ row }: any) => row.original.visitor_type || "N/A",
      },
      { accessorKey: "visitor_contact_number", header: "Contact Number" },
      { accessorKey: "purpose_of_visit", header: "Purpose" },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: any) =>
          dayjs(row.original.date).isValid()
            ? dayjs(row.original.date).format("DD-MMM-YYYY")
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
      {/* Detail Drawer */}
      <VisitorDetailsDrawer
        visitor={selectedVisitor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        refreshData={fetchVisitors}
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
