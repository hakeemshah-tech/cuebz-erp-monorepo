import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import VisitorsTable from "@/app/shared/visitor-log/visitor-log-list/table";

export default function VisitorsPage() {
  return (
    <>
      <PageHeader title="Visitors" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <VisitorsTable pageSize={20} />
      </div>
    </>
  );
}
