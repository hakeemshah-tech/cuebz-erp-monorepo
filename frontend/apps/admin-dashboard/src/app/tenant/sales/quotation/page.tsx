import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import QuotationsTable from "@/app/shared/quotation/quotation-list/table";
import { routesTenant } from "@/config/routes";

export default function QuotationsPage() {
  return (
    <>
      <PageHeader title="Quotations" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <QuotationsTable pageSize={20} />
      </div>
    </>
  );
}
