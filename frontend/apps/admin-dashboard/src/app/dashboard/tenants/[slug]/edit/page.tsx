import Link from "next/link";
import { Metadata } from "next";
import CreateEditTenant from "@/app/shared/tenant/create-edit";
import PageHeader from "@/app/shared/page-header";
import { routesSuperAdmin } from "@/config/routes";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  return { title: `Edit Tenant: ${slug}` };
}

const pageHeader = {
  title: "Edit Tenant",
  breadcrumb: [
    { href: routesSuperAdmin.tenants.tenantsList, name: "Tenants" },
    { name: "Edit" },
  ],
};

export default function EditTenantPage({ params }: Props) {
  const { slug } = params;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routesSuperAdmin.tenants.createTenant}>
          <Button>
            <PiPlusBold className="me-1.5" />
            Add Tenant
          </Button>
        </Link>
      </PageHeader>

      <CreateEditTenant slug={slug} />
    </>
  );
}
