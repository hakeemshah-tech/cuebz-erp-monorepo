import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import CallLogsTable from "@/app/shared/call-log/call-log-list/table";
import { routesTenant } from "@/config/routes";

export default function CallLogsPage() {
  return (
    <>
      <PageHeader title="Call Logs" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <CallLogsTable pageSize={20} />
      </div>
    </>
  );
}
