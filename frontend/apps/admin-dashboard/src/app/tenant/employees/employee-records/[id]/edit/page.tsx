import CreateEditEmployee from "@/app/shared/employees/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Employee: ${id}` };
}

export default function EditEmployeePage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Employee" breadcrumb={[]}></PageHeader>
      <CreateEditEmployee slug={id} />
    </>
  );
}
