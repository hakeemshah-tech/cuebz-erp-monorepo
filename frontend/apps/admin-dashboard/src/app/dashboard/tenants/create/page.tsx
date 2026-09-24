import { Suspense } from "react";
import Link from "next/link";
import CreateEditTenant from "@/app/shared/tenant/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Button } from "rizzui";
import { routesSuperAdmin } from "@/config/routes";
import { PiPlusBold } from "react-icons/pi";

export const metadata = {
  title: "Create Tenant",
};

const pageHeader = {
  title: "Create Tenant",
  breadcrumb: [
    { href: routesSuperAdmin.tenants.tenantsList, name: "Tenants" },
    { name: "Create" },
  ],
};

export default function CreateTenant() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routesSuperAdmin.tenants.createTenant}>
          <Button>
            <PiPlusBold className="me-1.5" />
            Create Tenant
          </Button>
        </Link>
      </PageHeader>

      {/* Reads useSearchParams() to pick up an edit id, which opts the subtree
          into client rendering; the boundary keeps the page prerenderable. */}
      <Suspense fallback={null}>
        <CreateEditTenant />
      </Suspense>
    </>
  );
}
