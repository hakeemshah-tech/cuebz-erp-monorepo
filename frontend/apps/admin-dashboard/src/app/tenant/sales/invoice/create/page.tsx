import CreateEditInvoice from "@/app/shared/invoice/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateInvoicePage() {
  return (
    <>
      <PageHeader title="Create Invoice" breadcrumb={[]}></PageHeader>
      <CreateEditInvoice />
    </>
  );
}
