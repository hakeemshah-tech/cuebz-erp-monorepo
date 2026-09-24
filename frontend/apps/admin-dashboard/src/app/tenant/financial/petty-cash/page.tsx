"use client";

import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import PettyCashTable from "@/app/shared/petty-cash/petty-cash-list/table";
import { routesTenant } from "@/config/routes";

export default function PettyCashPage() {
  return (
    <>
      <PageHeader title="Petty Cash" breadcrumb={[]} />
      <div className="p-4">
        <PettyCashTable pageSize={20} />
      </div>
    </>
  );
}
