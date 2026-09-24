"use client";

import CreateEditPettyCash from "@/app/shared/petty-cash/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreatePettyCashPage() {
  return (
    <>
      <PageHeader title="Create Petty Cash Entry" breadcrumb={[]}></PageHeader>
      <CreateEditPettyCash />
    </>
  );
}
