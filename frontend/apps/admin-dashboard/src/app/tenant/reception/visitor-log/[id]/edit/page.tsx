import Link from "next/link";
import CreateEditVisitor from "@/app/shared/visitor-log/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Visitor: ${id}` };
}

export default function EditVisitorPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Visitor" breadcrumb={[]}>
        {/* <Link href="/tenant/visitors/create">
          <Button>
            <PiPlusBold className="me-1.5" />
            Add Visitor
          </Button>
        </Link> */}
      </PageHeader>

      <CreateEditVisitor slug={id} />
    </>
  );
}
