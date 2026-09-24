"use client";

import CreateEditVendor from "@/app/shared/vendor/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateVendorPage() {
  return (
    <>
      <PageHeader title="Create Vendor" breadcrumb={[]}></PageHeader>
      <CreateEditVendor />
    </>
  );
}
