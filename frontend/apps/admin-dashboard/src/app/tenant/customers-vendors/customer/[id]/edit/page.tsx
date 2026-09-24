import CreateEditCustomer from "@/app/shared/customers/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Customer: ${id}` };
}

export default function EditCustomerPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Customer" breadcrumb={[]}></PageHeader>
      <CreateEditCustomer slug={id} />
    </>
  );
}
