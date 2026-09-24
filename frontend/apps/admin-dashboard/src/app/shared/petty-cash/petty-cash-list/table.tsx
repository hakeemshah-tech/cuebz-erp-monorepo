// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import pettyCashService from "@/services/pettycashService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import PettyCashDetailsModal from "./PettyCashDetailsModal";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { useModal } from "../../modal-views/use-modal";
// import { useRouter } from "next/navigation";
// import { routesTenant } from "@/config/routes";
// import { PettyCashType } from "@/types/pettyCashTypes";

// export default function PettyCashTable({
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
//     transaction_type: "",
//     transaction_date: null,
//   });

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const fetchPettyCashEntries = async () => {
//     setLoading(true);
//     try {
//       const response = await pettyCashService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         transaction_type: filters.transaction_type || undefined,
//         transaction_date: filters.transaction_date || undefined,
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
//       console.error("Error fetching petty cash data:", error.message);
//       toast.error("Failed to fetch petty cash data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchPettyCash = useCallback(
//     debounce(fetchPettyCashEntries, 300),
//     [filters, pagination.pageIndex, pagination.pageSize]
//   );

//   useEffect(() => {
//     debouncedFetchPettyCash();
//     return () => debouncedFetchPettyCash.cancel();
//   }, [debouncedFetchPettyCash]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0,
//     }));
//     fetchPettyCashEntries();
//   };

//   const { table } = useTanStackTable<PettyCashType>({
//     tableData: data,
//     columnConfig: [
//       {
//         accessorKey: "transaction_type",
//         header: "Transaction Type",
//         cell: ({ row }: any) => {
//           const transacton_type = row.original.transaction_type;

//           const statusColors: Record<string, string> = {
//             Add: "success",
//             Expense: "danger",
//           };

//           return (
//             <Badge
//               color={
//                 statusColors[transacton_type] as
//                   | "primary"
//                   | "danger"
//                   | "primary"
//                   | "info"
//               }
//               variant="flat"
//             >
//               {transacton_type}
//             </Badge>
//           );
//         },
//       },
//       {
//         accessorKey: "transaction_date",
//         header: "Transaction Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.transaction_date).isValid()
//             ? dayjs(row.original.transaction_date).format("DD-MMM-YYYY")
//             : "N/A",
//       },
//       {
//         accessorKey: "amount",
//         header: "Amount",
//         cell: ({ row }: any) => `₹${row.original.amount || "N/A"}`,
//       },
//       { accessorKey: "purpose", header: "Purpose" },
//       {
//         accessorKey: "remarks",
//         header: "Remarks",
//         cell: ({ row }: any) => row.original.remarks || "N/A",
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
//                       <PettyCashDetailsModal
//                         pettyCash={row.original}
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

//             {/* Edit Petty Cash Entry Action */}
//             <Tooltip
//               size="sm"
//               content="Edit Entry"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="Edit Entry"
//                 onClick={() => {
//                   router.push(
//                     routesTenant.financials.editPettyCash(row.original._id)
//                   );
//                 }}
//               >
//                 <FiEdit />
//               </ActionIcon>
//             </Tooltip>

//             {/* Delete Petty Cash Entry Action */}
//             <DeletePopover
//               title={`Delete Petty Cash Entry`}
//               description={`Are you sure you want to delete this entry?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting entry...");
//                   await pettyCashService.delete(row.original._id);
//                   toast.dismiss();
//                   toast.success(`Entry deleted successfully.`);
//                   await fetchPettyCashEntries();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete entry. Please try again.");
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

// ---------------

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import pettyCashService from "@/services/pettycashService";
// import Table from "@core/components/table";
// import TablePagination from "@core/components/table/pagination";
// import Filters from "./filters";
// import TransactionCard from "@core/components/cards/transaction-card";
// import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
// import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import PettyCashDetailsModal from "./PettyCashDetailsModal";
// import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
// import { PiBank, PiWalletBold, PiCurrencyCircleDollar } from "react-icons/pi";
// import { useModal } from "../../modal-views/use-modal";
// import { useRouter } from "next/navigation";
// import { routesTenant } from "@/config/routes";
// import { PettyCashType } from "@/types/pettyCashTypes";

// export default function PettyCashTable({
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
//   const [summaryData, setSummaryData] = useState({
//     totalReceived: 0,
//     totalExpense: 0,
//     balanceAmount: 0,
//   });
//   const [filters, setFilters] = useState({
//     globalSearch: "",
//     transaction_type: "",
//     transaction_date: null,
//   });

//   const { openModal, closeModal } = useModal();
//   const router = useRouter();

//   const fetchPettyCashEntries = async () => {
//     setLoading(true);
//     try {
//       const response = await pettyCashService.getList({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         transaction_type: filters.transaction_type || undefined,
//         transaction_date: filters.transaction_date || undefined,
//         search: filters.globalSearch || undefined,
//       });

//       const responseData = response?.data || [];
//       const totalCount = response?.pagination?.total || 0;
//       const summary = response?.totals || {
//         totalReceived: 0,
//         totalExpense: 0,
//         balanceAmount: 0,
//       };

//       setData(responseData);
//       setPagination((prev) => ({
//         ...prev,
//         totalCount,
//       }));
//       setSummaryData(summary);
//     } catch (error: any) {
//       console.error("Error fetching petty cash data:", error.message);
//       toast.error("Failed to fetch petty cash data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchPettyCash = useCallback(
//     debounce(fetchPettyCashEntries, 300),
//     [filters, pagination.pageIndex, pagination.pageSize]
//   );

//   useEffect(() => {
//     debouncedFetchPettyCash();
//     return () => debouncedFetchPettyCash.cancel();
//   }, [debouncedFetchPettyCash]);

//   const handleApplyFilters = () => {
//     setPagination((prev) => ({
//       ...prev,
//       pageIndex: 0,
//     }));
//     fetchPettyCashEntries();
//   };

//   const transactionCardsData = [
//     {
//       title: "Total Received",
//       amount: `AED ${summaryData.totalReceived.toLocaleString()}`,
//       increased: true,
//       percentage: "N/A",
//       icon: PiCurrencyCircleDollar,
//       iconWrapperFill: "#0070F3",
//     },
//     {
//       title: "Total Expense",
//       amount: `AED ${summaryData.totalExpense.toLocaleString()}`,
//       increased: false,
//       percentage: "N/A",
//       icon: PiWalletBold,
//       iconWrapperFill: "#F5A623",
//     },
//     {
//       title: "Balance Amount",
//       amount: `AED ${summaryData.balanceAmount.toLocaleString()}`,
//       increased: summaryData.balanceAmount >= 0,
//       percentage: "N/A",
//       icon: PiBank,
//       iconWrapperFill: "#8A63D2",
//     },
//   ];

//   const { table } = useTanStackTable<PettyCashType>({
//     tableData: data,
//     columnConfig: [
//       { accessorKey: "purpose", header: "Purpose" },
//       {
//         accessorKey: "transaction_type",
//         header: "Deposit / Expense",
//         cell: ({ row }: any) => {
//           const transaction_type = row.original.transaction_type;

//           const statusColors: Record<string, string> = {
//             Add: "success",
//             Expense: "danger",
//           };

//           return (
//             <Badge
//               color={
//                 statusColors[transaction_type] as
//                   | "primary"
//                   | "danger"
//                   | "primary"
//                   | "info"
//               }
//               variant="flat"
//             >
//               {transaction_type}
//             </Badge>
//           );
//         },
//       },
//       {
//         accessorKey: "transaction_date",
//         header: "Transaction Date",
//         cell: ({ row }: any) =>
//           dayjs(row.original.transaction_date).isValid()
//             ? dayjs(row.original.transaction_date).format("DD-MMM-YYYY")
//             : "N/A",
//       },
//       {
//         accessorKey: "amount",
//         header: "Amount",
//         cell: ({ row }: any) => (
//           <b
//             className={`${row.original.transaction_type === "Add" ? "text-green-dark" : "text-red-dark"} `}
//           >{`AED ${row.original.amount || "N/A"}`}</b>
//         ),
//       },
//       {
//         accessorKey: "remarks",
//         header: "Remarks",
//         cell: ({ row }: any) => row.original.remarks || "N/A",
//       },
//       {
//         accessorKey: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Flex align="center" justify="end" className="pe-4">
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
//                       <PettyCashDetailsModal
//                         pettyCash={row.original}
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

//             <Tooltip
//               size="sm"
//               content="Edit Entry"
//               placement="top"
//               color="invert"
//             >
//               <ActionIcon
//                 as="span"
//                 size="sm"
//                 variant="outline"
//                 aria-label="Edit Entry"
//                 onClick={() => {
//                   router.push(
//                     routesTenant.financials.editPettyCash(row.original._id)
//                   );
//                 }}
//               >
//                 <FiEdit />
//               </ActionIcon>
//             </Tooltip>

//             <DeletePopover
//               title={`Delete Petty Cash Entry`}
//               description={`Are you sure you want to delete this entry?`}
//               onDelete={async () => {
//                 try {
//                   toast.loading("Deleting entry...");
//                   await pettyCashService.delete(row.original._id);
//                   toast.dismiss();
//                   toast.success(`Entry deleted successfully.`);
//                   await fetchPettyCashEntries();
//                 } catch (error) {
//                   toast.dismiss();
//                   toast.error("Failed to delete entry. Please try again.");
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
//     <div className="shadow-md">
//       {/* Transaction Cards */}
//       <div className="flex gap-4 mb-6 overflow-x-auto">
//         {transactionCardsData.map((stat, index) => (
//           <TransactionCard
//             key={`transaction-card-${index}`}
//             transaction={stat}
//             className="min-w-[300px]"
//           />
//         ))}
//       </div>

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
import pettyCashService from "@/services/pettycashService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Badge, Flex, Tooltip } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import { PettyCashType } from "@/types/pettyCashTypes";
import PettyCashDetailsDrawer from "./PettyCashDetailsDrawer";
import { FiEye, FiTrash } from "react-icons/fi";
import { PiBank, PiWalletBold, PiCurrencyCircleDollar } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { routesTenant } from "@/config/routes";
import TransactionCard from "@core/components/cards/transaction-card";

export default function PettyCashTable({
  pageSize = 20,
  hideFilters = false,
  hidePagination = false,
}) {
  const [data, setData] = useState<PettyCashType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    globalSearch: "",
    transactionType: "",
    dateFrom: "",
    dateTo: "",
  });
  const [summaryData, setSummaryData] = useState({
    totalReceived: 0,
    totalExpense: 0,
    balanceAmount: 0,
  });

  const [selectedPettyCash, setSelectedPettyCash] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const fetchPettyCash = async () => {
    setLoading(true);
    try {
      const response = await pettyCashService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        transaction_type: filters.transactionType || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.globalSearch || undefined,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;
      const summary = response?.totals || {
        totalReceived: 0,
        totalExpense: 0,
        balanceAmount: 0,
      };

      setData(responseData);
      setPagination((prev) => ({ ...prev, totalCount }));
      setSummaryData(summary);
    } catch (error: any) {
      console.error("Error fetching petty cash:", error.message);
      toast.error("Failed to fetch petty cash.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPettyCash = useCallback(debounce(fetchPettyCash, 300), [
    filters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchPettyCash();
    return () => debouncedFetchPettyCash.cancel();
  }, [debouncedFetchPettyCash]);

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    fetchPettyCash();
  };

  const transactionCardsData = [
    {
      title: "Total Received",
      amount: `AED ${summaryData.totalReceived.toLocaleString()}`,
      increased: true,
      percentage: "N/A",
      icon: PiCurrencyCircleDollar,
      iconWrapperFill: "#0070F3",
    },
    {
      title: "Total Expense",
      amount: `AED ${summaryData.totalExpense.toLocaleString()}`,
      increased: false,
      percentage: "N/A",
      icon: PiWalletBold,
      iconWrapperFill: "#F5A623",
    },
    {
      title: "Balance Amount",
      amount: `AED ${summaryData.balanceAmount.toLocaleString()}`,
      increased: summaryData.balanceAmount >= 0,
      percentage: "N/A",
      icon: PiBank,
      iconWrapperFill: "#8A63D2",
    },
  ];

  const { table } = useTanStackTable<PettyCashType>({
    tableData: data,
    columnConfig: [
      {
        accessorKey: "purpose",
        header: "Purpose",
        cell: ({ row }: any) => (
          <button
            className="text-primary"
            onClick={() => {
              setSelectedPettyCash(row.original);
              setDetailsOpen(true);
            }}
          >
            {row?.original?.purpose}
          </button>
        ),
      },
      {
        accessorKey: "transaction_type",
        header: "Transaction Type",
      },
      {
        accessorKey: "transaction_date",
        header: "Transaction Date",
        cell: ({ row }: any) =>
          dayjs(row.original.transaction_date).isValid()
            ? dayjs(row.original.transaction_date).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: any) => `AED ${row.original.amount}`,
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
      <div>
        {/* Transaction Cards */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {transactionCardsData.map((stat, index) => (
            <TransactionCard
              key={`transaction-card-${index}`}
              transaction={stat}
              className="min-w-[300px]"
            />
          ))}
        </div>
      </div>
      <PettyCashDetailsDrawer
        pettyCash={selectedPettyCash}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        refreshData={fetchPettyCash}
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
        <div className="shadow-md">
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
        </div>
      )}
    </div>
  );
}
