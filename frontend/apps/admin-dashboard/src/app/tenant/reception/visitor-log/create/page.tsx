import Link from "next/link";
import CreateEditVisitor from "@/app/shared/visitor-log/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Button } from "rizzui";
import { PiPlusBold } from "react-icons/pi";

export default function CreateVisitorPage() {
  return (
    <>
      <PageHeader title="Create Visitor" breadcrumb={[]}>
        {/* <Link href="/tenant/visitors/create">
          <Button>
            <PiPlusBold className="me-1.5" />
            Create Visitor
          </Button>
        </Link> */}
      </PageHeader>

      <CreateEditVisitor />
    </>
  );
}
