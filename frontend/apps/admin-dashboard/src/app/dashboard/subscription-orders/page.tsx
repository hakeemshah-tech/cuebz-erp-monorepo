import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import SubscriptionOrdersTable from "@/app/shared/subscription-order/order-list/table";

export default function SubscriptionOrdersPage() {
  return (
    <>
      <PageHeader title="Subscription Orders" breadcrumb={[]}>
        <div className="mt-4 flex items-center gap-3">
          {/* <Link href="/dashboard/subscription-orders/create">
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Order
            </Button>
          </Link> */}
        </div>
      </PageHeader>
      <SubscriptionOrdersTable pageSize={20} />
    </>
  );
}
