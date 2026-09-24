import CreateRoleUser from "@/app/shared/roles-user/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateRoleUserPage() {
  return (
    <>
      <PageHeader title="Create User Role" breadcrumb={[]}></PageHeader>
      <CreateRoleUser />
    </>
  );
}
