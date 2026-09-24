import CreateEditCustomer from "@/app/shared/customers/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateCustomerPage() {
  return (
    <>
      <PageHeader title="Create Customer" breadcrumb={[]}></PageHeader>
      <CreateEditCustomer />
    </>
  );
}
