import CreateEditChequeTracker from "@/app/shared/cheque-tracker/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateChequeTrackerPage() {
  return (
    <>
      <PageHeader title="Create Cheque Entry" breadcrumb={[]}></PageHeader>
      <CreateEditChequeTracker />
    </>
  );
}
