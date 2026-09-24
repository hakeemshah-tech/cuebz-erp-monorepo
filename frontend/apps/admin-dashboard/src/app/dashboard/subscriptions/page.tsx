import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import SubscriptionsTable from "@/app/shared/subscriptions/subscription-list/table";

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscription Plans" breadcrumb={[]}>
        <div className="mt-4 flex items-center gap-3">
          <Link href="/dashboard/subscriptions/create">
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Subscription Plan
            </Button>
          </Link>
        </div>
      </PageHeader>
      <SubscriptionsTable pageSize={10} />
    </>
  );
}
