import Link from "next/link";
import { Metadata } from "next";
import CreateEditSubscription from "@/app/shared/subscriptions/create-edit";
import PageHeader from "@/app/shared/page-header";
import { routesSuperAdmin } from "@/config/routes";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  return { title: `Edit Subscription: ${slug}` };
}

const pageHeader = {
  title: "Edit Subscription Plan",
  breadcrumb: [
    {
      href: routesSuperAdmin.subscriptions.subscriptionsList,
      name: "Subscriptions",
    },
    { name: "Edit" },
  ],
};

export default function EditSubscriptionPage({ params }: Props) {
  const { slug } = params;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routesSuperAdmin.subscriptions.createSubscription}>
          <Button>
            <PiPlusBold className="me-1.5" />
            Add Subscription
          </Button>
        </Link>
      </PageHeader>

      <CreateEditSubscription slug={slug} />
    </>
  );
}
