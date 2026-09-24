import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import InvoicesTable from "@/app/shared/invoice/invoice-list/table";
import { routesTenant } from "@/config/routes";

export default function InvoicesPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader title="Invoices" breadcrumb={[]} />

      {/* Invoices Table with Pagination */}
      <div className="p-4">
        <InvoicesTable pageSize={20} />
      </div>
    </>
  );
}
