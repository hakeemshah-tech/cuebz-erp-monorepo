import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import EmployeesTable from "@/app/shared/employees/employees-list/table";
import { routesTenant } from "../../../../config/routes";

export default function EmployeesPage() {
  return (
    <>
      <PageHeader title="Employees" breadcrumb={[]}></PageHeader>
      <div className="p-4">
        <EmployeesTable pageSize={20} />
      </div>
    </>
  );
}
