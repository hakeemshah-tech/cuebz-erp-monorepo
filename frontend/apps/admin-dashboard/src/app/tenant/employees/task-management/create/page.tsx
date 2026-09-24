import CreateEditTask from "@/app/shared/task-management/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateTaskPage() {
  return (
    <>
      <PageHeader title="Create Task" breadcrumb={[]}></PageHeader>
      <CreateEditTask />
    </>
  );
}
