"use client";

import WidgetCard from "@core/components/cards/widget-card";
import { Title, Button } from "rizzui";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import Link from "next/link";

const columns = [
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }: any) =>
      new Date(row.original.transaction_date).toLocaleDateString(),
  },
  {
    accessorKey: "transaction_type",
    header: "Type",
    cell: ({ row }: any) => (
      <span
        className={
          row.original.transaction_type === "Add"
            ? "text-green-600 font-medium"
            : "text-red-600 font-medium"
        }
      >
        {row.original.transaction_type}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: any) => `AED ${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
];

export default function RecentTransactionsTable({ data }: { data: any[] }) {
  const { table } = useTanStackTable({
    tableData: data,
    columnConfig: columns,
    options: {
      initialState: {
        pagination: { pageIndex: 0, pageSize: 5 },
      },
      enableColumnResizing: false,
    },
  });

  return (
    <WidgetCard
      title="Recent Transactions"
      description="Latest petty cash transactions"
      rounded="lg"
      className="h-full border-0 shadow-md"
      descriptionClassName="text-gray-500 mt-1.5"
      headerClassName="flex items-center justify-between"
      action={
        <Link href="/tenant/financial/petty-cash">
          <Button
            size="sm"
            variant="outline"
            className="text-sm font-medium border-gray-300 hover:border-primary hover:text-primary"
          >
            View All
          </Button>
        </Link>
      }
    >
      <div className="mt-4">
        <Table table={table} variant="elegant" />
      </div>
    </WidgetCard>
  );
}
