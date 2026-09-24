import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import TasksTable from "@/app/shared/task-management/task-management-list/table";
import { routesTenant } from "../../../../config/routes";

export default function TaskManagementPage() {
  return (
    <>
      <PageHeader title="Task Management" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <TasksTable pageSize={20} />
      </div>
    </>
  );
}
