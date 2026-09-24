import CreateEditRoleUser from "@/app/shared/roles-user/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Role User: ${id}` };
}

export default function EditRoleUserPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Role User" breadcrumb={[]}></PageHeader>
      <CreateEditRoleUser slug={id} />
    </>
  );
}
