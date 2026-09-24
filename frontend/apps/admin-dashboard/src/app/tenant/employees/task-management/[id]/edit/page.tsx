import CreateEditTask from "@/app/shared/task-management/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Task: ${id}` };
}

export default function EditTaskPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Employee" breadcrumb={[]}></PageHeader>
      <CreateEditTask slug={id} />
    </>
  );
}
