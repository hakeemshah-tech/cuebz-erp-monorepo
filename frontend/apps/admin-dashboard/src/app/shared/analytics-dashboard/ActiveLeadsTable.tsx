"use client";

import WidgetCard from "@core/components/cards/widget-card";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { Text, Button } from "rizzui";
import Link from "next/link";

const columns = [
  {
    accessorKey: "company_name",
    header: "Company",
  },
  {
    accessorKey: "contact_person",
    header: "Contact Person",
  },
  {
    accessorKey: "lead_status",
    header: "Status",
    cell: ({ row }: any) => (
      <span className="capitalize font-medium text-primary">
        {row.original.lead_status}
      </span>
    ),
  },
  {
    accessorKey: "lead_source",
    header: "Source",
  },
];

export default function ActiveLeadsTable({ data }: { data: any[] }) {
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
      title="Active Leads"
      description="Leads that are currently in pipeline"
      rounded="lg"
      className="h-full border-0 shadow-md"
      descriptionClassName="text-gray-500 mt-1.5"
      headerClassName="flex items-center justify-between"
      action={
        <Link href="/tenant/sales/leads">
          <Button
            size="sm"
            variant="outline"
            className="text-sm font-medium border-gray-300 hover:border-primary hover:text-primary"
          >
            View More
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
