import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import RolesUserTable from "@/app/shared/roles-user/roles-user-list/table";
import { routesTenant } from "@/config/routes";

export default function RolesUserPage() {
  return (
    <>
      <PageHeader title="Roles & Users" breadcrumb={[]} />
      <div className="p-4">
        <RolesUserTable pageSize={20} />
      </div>
    </>
  );
}
