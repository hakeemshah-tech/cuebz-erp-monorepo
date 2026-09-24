"use client";

import CreateEditPettyCash from "@/app/shared/petty-cash/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

// Dynamically set the page title
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const id = params.id;
//   return { title: `Edit Petty Cash Entry: ${id}` };
// }

export default function EditPettyCashPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Petty Cash Entry" breadcrumb={[]}></PageHeader>
      <CreateEditPettyCash slug={id} />
    </>
  );
}
