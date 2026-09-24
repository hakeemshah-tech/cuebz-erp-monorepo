import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import LeadsTable from "@/app/shared/leads/lead-list/table";
import { routesTenant } from "@/config/routes";

export default function LeadsPage() {
  return (
    <>
      <PageHeader title="Leads" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <LeadsTable pageSize={20} />
      </div>
    </>
  );
}
