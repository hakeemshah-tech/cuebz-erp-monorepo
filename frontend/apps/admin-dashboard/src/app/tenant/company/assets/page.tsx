import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import AssetsTable from "@/app/shared/assets/asset-list/table";

export default function AssetsPage() {
  return (
    <>
      {/* ✅ Page Header */}
      <PageHeader title="Assets Management" breadcrumb={[]}>
        {/* <div className="mt-4 flex items-center gap-3">
          <Link href="/tenant/company/assets/create">
            <Button>
              <PiPlusBold className="me-1.5 size-[17px]" />
              Add Asset
            </Button>
          </Link>
        </div> */}
      </PageHeader>

      {/* ✅ Asset Table Component */}
      <div className="p-4">
        <AssetsTable pageSize={20} />
      </div>
    </>
  );
}
