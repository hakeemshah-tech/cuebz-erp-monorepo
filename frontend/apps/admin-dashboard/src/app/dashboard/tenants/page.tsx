import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import TenantsTable from "@/app/shared/tenant/tenant-list/table";

export default function TenantsPage() {
  return (
    <>
      <PageHeader title="Tenants" breadcrumb={[]}>
        <div className="mt-4 flex items-center gap-3">
          <Link href="/dashboard/tenants/create">
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Tenant
            </Button>
          </Link>
        </div>
      </PageHeader>
      <TenantsTable pageSize={20} />
    </>
  );
}
