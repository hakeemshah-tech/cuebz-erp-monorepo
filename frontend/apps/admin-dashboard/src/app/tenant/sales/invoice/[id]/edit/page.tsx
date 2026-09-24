import CreateEditInvoice from "@/app/shared/invoice/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Invoice: ${id}` };
}

export default function EditInvoicePage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Invoice" breadcrumb={[]}></PageHeader>

      <CreateEditInvoice slug={id} />
    </>
  );
}
