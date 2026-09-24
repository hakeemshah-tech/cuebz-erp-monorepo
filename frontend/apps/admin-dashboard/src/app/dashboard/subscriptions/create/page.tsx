import { Suspense } from "react";
import Link from "next/link";
import CreateEditSubscription from "@/app/shared/subscriptions/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Button } from "rizzui";
import { routesSuperAdmin } from "@/config/routes";
import { PiPlusBold } from "react-icons/pi";

export const metadata = {
  title: "Create Subscription Plan",
};

const pageHeader = {
  title: "Create Subscription Plan",
  breadcrumb: [
    {
      href: routesSuperAdmin.subscriptions.subscriptionsList,
      name: "Subscriptions",
    },
    { name: "Create" },
  ],
};

export default function CreateSubscription() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routesSuperAdmin.subscriptions.createSubscription}>
          <Button>
            <PiPlusBold className="me-1.5" />
            Create Subscription
          </Button>
        </Link>
      </PageHeader>

      {/* Reads useSearchParams() to pick up an edit id, which opts the subtree
          into client rendering; the boundary keeps the page prerenderable. */}
      <Suspense fallback={null}>
        <CreateEditSubscription />
      </Suspense>
    </>
  );
}
