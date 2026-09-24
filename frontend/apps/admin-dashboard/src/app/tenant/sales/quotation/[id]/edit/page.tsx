import CreateEditQuotation from "@/app/shared/quotation/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Quotation: ${id}` };
}

export default function EditQuotationPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Quotation" breadcrumb={[]}></PageHeader>
      <CreateEditQuotation slug={id} />
    </>
  );
}
