import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import ChequeTrackerTable from "@/app/shared/cheque-tracker/cheque-tracker-list/table";
import { routesTenant } from "@/config/routes";

export default function ChequeTrackerPage() {
  return (
    <>
      <PageHeader title="Cheque Tracker" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <ChequeTrackerTable pageSize={20} />
      </div>
    </>
  );
}
