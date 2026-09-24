import CreateEditVendor from "@/app/shared/vendor/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Vendor: ${id}` };
}

export default function EditVendorPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Vendor" breadcrumb={[]}></PageHeader>
      <CreateEditVendor slug={id} />
    </>
  );
}
