"use client";

import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import VendorsTable from "@/app/shared/vendor/vendors-list/table";
import { routesTenant } from "@/config/routes";

export default function VendorsPage() {
  return (
    <>
      <PageHeader title="Vendors" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <VendorsTable pageSize={20} />
      </div>
    </>
  );
}

// import React from "react";

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
