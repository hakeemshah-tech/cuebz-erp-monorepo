import CreateEditChequeTracker from "@/app/shared/cheque-tracker/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Cheque Entry: ${id}` };
}

export default function EditChequeTrackerPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      <PageHeader title="Edit Cheque Entry" breadcrumb={[]}></PageHeader>
      <CreateEditChequeTracker slug={id} />
    </>
  );
}
