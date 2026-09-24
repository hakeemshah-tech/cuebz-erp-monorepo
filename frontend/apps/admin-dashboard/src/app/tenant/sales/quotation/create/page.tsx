import CreateEditQuotation from "@/app/shared/quotation/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateQuotationPage() {
  return (
    <>
      <PageHeader title="Create Quotation" breadcrumb={[]}></PageHeader>
      <CreateEditQuotation />
    </>
  );
}
