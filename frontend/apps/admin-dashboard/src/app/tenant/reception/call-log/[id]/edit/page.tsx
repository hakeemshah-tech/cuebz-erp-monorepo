import CreateEditCallLog from "@/app/shared/call-log/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Visitor: ${id}` };
}

export default function EditVisitorPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Visitor" breadcrumb={[]}></PageHeader>
      <CreateEditCallLog slug={id} />
    </>
  );
}
