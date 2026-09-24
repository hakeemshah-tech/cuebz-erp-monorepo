import CreateEditLead from "@/app/shared/leads/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Lead: ${id}` };
}

export default function EditLeadPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Lead" breadcrumb={[]}></PageHeader>
      <CreateEditLead slug={id} />
    </>
  );
}
