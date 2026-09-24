import CreateCallLog from "@/app/shared/call-log/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateVisitorPage() {
  return (
    <>
      <PageHeader title="Create Call Log" breadcrumb={[]}></PageHeader>
      <div className="bg-white">
        <CreateCallLog />
      </div>
    </>
  );
}
