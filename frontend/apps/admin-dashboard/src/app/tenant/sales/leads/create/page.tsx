import CreateEditLead from "@/app/shared/leads/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateLeadPage() {
  return (
    <>
      <PageHeader title="Create Lead" breadcrumb={[]}></PageHeader>
      <CreateEditLead />
    </>
  );
}
