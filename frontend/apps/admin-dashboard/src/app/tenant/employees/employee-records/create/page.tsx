import CreateEditEmployee from "@/app/shared/employees/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateEmployeePage() {
  return (
    <>
      <PageHeader title="Create Employee" breadcrumb={[]}></PageHeader>
      <CreateEditEmployee />
    </>
  );
}
