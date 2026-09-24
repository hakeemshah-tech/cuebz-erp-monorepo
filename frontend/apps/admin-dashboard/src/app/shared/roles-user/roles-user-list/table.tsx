// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import rolesUserService from "@/services/rolesUserService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import { RolesUserType } from "@/types/rolesUserTypes";
// import { useModal } from "../../modal-views/use-modal";
// import RolesUserDetailsModal from "./RolesUserDetailsModal";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// export default function RolesUserTable({
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
//     role: "",
//     status: "",
//     tenant: "",
//     createdAt: "",
//   });

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const fetchRolesUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await rolesUserService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: filters.globalSearch || undefined,
//         role: filters.role || undefined,
//         status: filters.status || undefined,
//         tenant: filters.tenant || undefined,
//         createdAt: filters.createdAt || undefined,
//       });
//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//     } catch (error: any) {
//       console.error("Error fetching roles users:", error.message);
//       toast.error("Failed to fetch roles users.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchRolesUsers = useCallback(debounce(fetchRolesUsers, 300), [
//     filters,
//     pagination.pageIndex,
//     pagination.pageSize,
//   ]);

//   useEffect(() => {
//     debouncedFetchRolesUsers();
//     return () => debouncedFetchRolesUsers.cancel();
//   }, [debouncedFetchRolesUsers]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0, // Reset to first page when filters are applied
//     }));
//     fetchRolesUsers();
//   };

//   const { table } = useTanStackTable<RolesUserType>({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "name", header: "Name" },
//       { accessorKey: "email", header: "Email" },
//       { accessorKey: "role", header: "Role" },
//       {
//         accessorKey: "isVerified",
//         header: "Is Verified",
//         cell: ({ row }: any) => {
//           const isVerified = row.original.isVerified;
//           const badgeColor =
//             isVerified === true
//               ? "bg-green-500 text-white"
//               : "bg-red-500 text-white";
//           return (
//             <Badge className={`px-2 py-1 rounded ${badgeColor}`}>
//               {isVerified ? "Verified" : "Not Verified"}
//             </Badge>
//           );
//         },
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
import rolesUserService from "@/services/rolesUserService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { Badge } from "rizzui";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { RolesUserType } from "@/types/rolesUserTypes";
import { useRouter } from "next/navigation";
import RolesUserDetailsDrawer from "./RolesUserDetailsModal";

export default function RolesUserTable({
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
    role: "",
    status: "",
    tenant: "",
    createdAt: "",
  });

  const [selectedUser, setSelectedUser] = useState({}) as any;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const fetchRolesUsers = async () => {
    setLoading(true);
    try {
      const response = await rolesUserService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.globalSearch || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        tenant: filters.tenant || undefined,
        createdAt: filters.createdAt || undefined,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setData(responseData);
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
    } catch (error: any) {
      console.error("Error fetching roles users:", error.message);
      toast.error("Failed to fetch roles users.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchRolesUsers = useCallback(debounce(fetchRolesUsers, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchRolesUsers();
    return () => debouncedFetchRolesUsers.cancel();
  }, [debouncedFetchRolesUsers]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
    fetchRolesUsers();
  };

  const { table } = useTanStackTable<RolesUserType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedUser(row.original);
              setDetailsOpen(true);
            }}
          >
            {row.original.name}
          </button>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "isVerified",
        header: "Is Verified",
        cell: ({ row }: any) => {
          const isVerified = row.original.isVerified;
          const badgeColor =
            isVerified === true
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white";
          return (
            <Badge className={`px-2 py-1 rounded ${badgeColor}`}>
              {isVerified ? "Verified" : "Not Verified"}
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
      <RolesUserDetailsDrawer
        user={selectedUser}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        refreshData={fetchRolesUsers}
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
