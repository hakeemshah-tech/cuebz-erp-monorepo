// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import taskService from "@/services/taskManagementService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import { TaskType } from "@/types/taskTypes";
// import { useModal } from "../../modal-views/use-modal";
// import TaskDetailsModal from "./TaskDetailsDrawer";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import { routesTenant } from "@/config/routes";
// import Link from "next/link";

// export default function TaskTable({
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
//     assignedTo: "",
//     priority: "",
//     status: "",
//     dueDate: null,
//     createdBy: "",
//   });

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const response = await taskService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         assignedTo: filters.assignedTo || undefined,
//         priority: filters.priority || undefined,
//         status: filters.status || undefined,
//         dueDate: filters.dueDate || undefined,
//         createdBy: filters.createdBy || undefined,
//         search: filters.globalSearch || undefined,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error: any) {
//       console.error("Error fetching tasks:", error.message);
//       toast.error("Failed to fetch tasks.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchTasks = useCallback(debounce(fetchTasks, 300), [
//     filters,
//     pagination.pageIndex,
//     pagination.pageSize,
//   ]);

//   useEffect(() => {
//     debouncedFetchTasks();
//     return () => debouncedFetchTasks.cancel();
//   }, [debouncedFetchTasks]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0,
//     }));
//     fetchTasks();
//   };

//   const { table } = useTanStackTable<TaskType>({
//     tableData: data,
//     columnConfig: [
//       {
//         accessorKey: "title",
//         header: "Task Title",
//         cell: ({ row }: any) => (
//           <Link
//             href={`/tenant/employees/task-management/${row.original._id}`}
//             className="text-primary"
//           >
//             {row.original.title}
//           </Link>
//         ),
//       },
//       {
//         accessorKey: "description",
//         header: "Description",
//         cell: ({ row }: any) => row.original.description || "N/A",
//       },
//       {
//         accessorKey: "assignedTo",
//         header: "Assigned To",
//         cell: ({ row }: any) => row.original.assignedTo.full_name || "N/A",
//       },
//       {
//         accessorKey: "priority",
//         header: "Priority",
//         cell: ({ row }: any) => (
//           <Badge
//             color={
//               row.original.priority === "High"
//                 ? "danger"
//                 : row.original.priority === "Medium"
//                   ? "warning"
//                   : "success"
//             }
//           >
//             {row.original.priority}
//           </Badge>
//         ),
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }: any) => (
//           <Badge
//             color={
//               row.original.status === "Pending"
//                 ? "warning"
//                 : row.original.status === "In Progress"
//                   ? "primary"
//                   : "success"
//             }
//           >
//             {row.original.status}
//           </Badge>
//         ),
//       },
//       {
//         accessorKey: "dueDate",
//         header: "Due Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.dueDate).isValid()
//             ? dayjs(row.original.dueDate).format("DD-MMM-YYYY")
//             : "N/A",
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
//                       <TaskDetailsModal
//                         task={row.original}
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

//             {/* Edit Task Action */}
//             <Tooltip
//               size="sm"
//               content="Edit Task"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="Edit Task"
//                 onClick={() => {
//                   router.push(
//                     routesTenant.employees.editTaskManagementRecord(
//                       row.original._id
//                     )
//                   );
//                 }}
//               >
//                 <FiEdit />
//               </ActionIcon>
//             </Tooltip>

//             {/* Delete Task Action */}
//             <DeletePopover
//               title={`Delete Task`}
//               description={`Are you sure you want to delete ${row.original.title}?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting task...");
//                   await taskService.delete(row.original._id);
//                   toast.dismiss();
//                   toast.success(`${row.original.title} deleted successfully.`);
//                   await fetchTasks();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete task. Please try again.");
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
import taskService from "@/services/taskManagementService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { TaskType } from "@/types/taskTypes";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";

export default function TaskTable({
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
    assignedTo: "",
    priority: "",
    status: "",
    dueDate: null,
    createdBy: "",
  });

  const [selectedTask, setSelectedTask] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEditOpen, setDrawerEditOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        assignedTo: filters.assignedTo || undefined,
        priority: filters.priority || undefined,
        status: filters.status || undefined,
        dueDate: filters.dueDate || undefined,
        createdBy: filters.createdBy || undefined,
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
      console.error("Error fetching tasks:", error.message);
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchTasks = useCallback(debounce(fetchTasks, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchTasks();
    return () => debouncedFetchTasks.cancel();
  }, [debouncedFetchTasks]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchTasks();
  };

  const { table } = useTanStackTable<TaskType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "title",
        header: "Task Title",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedTask(row.original);
              setDrawerOpen(true);
            }}
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }: any) => row.original.description || "N/A",
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }: any) => row.original?.assignedTo?.full_name || "N/A",
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }: any) => (
          <Badge
            color={
              row.original.priority === "High"
                ? "danger"
                : row.original.priority === "Medium"
                  ? "warning"
                  : "success"
            }
          >
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => (
          <Badge
            color={
              row.original.status === "Pending"
                ? "warning"
                : row.original.status === "In Progress"
                  ? "primary"
                  : "success"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }: any) =>
          dayjs(row.original.dueDate).isValid()
            ? dayjs(row.original.dueDate).format("DD-MMM-YYYY")
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
      <TaskDetailsDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdated={fetchTasks}
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
